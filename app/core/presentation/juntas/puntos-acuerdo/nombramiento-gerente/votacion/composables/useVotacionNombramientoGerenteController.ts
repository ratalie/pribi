import { computed, nextTick, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type {
  PersonaJuridica,
  PersonaNatural,
  Shareholder,
} from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Controller para la vista de Votación de Nombramiento de Gerente
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Filtrado de votantes (asistentes con acciones con derecho a voto)
 * - Generación de pregunta hardcodeada usando datos del gerente del snapshot
 * - Manejo de votos en memoria local (solo visual, no guarda en backend)
 */
export function useVotacionNombramientoGerenteController() {
  const route = useRoute();
  const votacionStore = useVotacionStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Cargar snapshot (ya está cargado, pero verificamos)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes)
      console.log("[DEBUG][VotacionNombramientoGerenteController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );

      // 3. Cargar votación existente (si existe)
      try {
        await votacionStore.loadVotacion(
          societyId.value,
          flowId.value,
          VoteContext.DESIGNACION_GERENTE
        );
        console.log("[DEBUG][VotacionNombramientoGerenteController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
          contexto: votacionStore.sesionVotacion?.contexto,
        });

        // ✅ 4. Verificar que el contexto de la sesión cargada sea correcto
        if (
          votacionStore.sesionVotacion &&
          votacionStore.sesionVotacion.contexto !== VoteContext.DESIGNACION_GERENTE
        ) {
          console.error(
            "[DEBUG][VotacionNombramientoGerenteController] ⚠️ ERROR: Sesión cargada tiene contexto incorrecto:",
            {
              contextoEsperado: VoteContext.DESIGNACION_GERENTE,
              contextoObtenido: votacionStore.sesionVotacion.contexto,
            }
          );
          // Limpiar la sesión incorrecta para evitar conflictos
          votacionStore.sesionVotacion = null;
        }

        // ✅ 5. Sincronizar votos con votantes actuales (fuente de verdad)
        if (votacionStore.hasVotacion && votacionStore.itemVotacion) {
          await nextTick();
          sincronizarVotosConVotantesActuales();
        }
      } catch (error: any) {
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionNombramientoGerenteController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionNombramientoGerente] Error al cargar votación:",
            error
          );
        }
      }
    } catch (err: any) {
      console.error("[Controller][VotacionNombramientoGerente] Error al cargar datos:", err);
      error.value = err.message || "Error al cargar datos";
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Helper: Obtener nombre completo de un accionista
   */
  function getNombreCompletoShareholder(shareholder: Shareholder): string {
    const person = shareholder.person;
    if (person.tipo === "NATURAL") {
      return `${person.nombre} ${person.apellidoPaterno} ${
        person.apellidoMaterno || ""
      }`.trim();
    }
    // Para personas jurídicas y otros tipos
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return ""; // Fallback
  }

  /**
   * Helper: Obtener nombre completo del gerente según su tipo
   */
  function getNombreCompletoGerente(persona: PersonaNatural | PersonaJuridica): string {
    if (persona.tipo === "NATURAL") {
      return `${persona.nombre} ${persona.apellidoPaterno} ${
        persona.apellidoMaterno || ""
      }`.trim();
    } else {
      return persona.razonSocial;
    }
  }

  /**
   * Mapper: Calcular votantes desde snapshot + asistencias
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][VotacionNombramientoGerenteController] No hay snapshot disponible para mapear votantes"
      );
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    // 1. Calcular acciones con derecho a voto por accionista desde snapshot
    const accionistasConAcciones = shareholders.map((accionista) => {
      const asignaciones = shareAllocations.filter(
        (asig) => asig.accionistaId === accionista.id
      );

      let totalAccionesConDerechoVoto = 0;

      asignaciones.forEach((asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);

        if (!shareClass) {
          return;
        }

        if (shareClass.conDerechoVoto) {
          totalAccionesConDerechoVoto += asig.cantidadSuscrita;
        }
      });

      return {
        accionista,
        totalAccionesConDerechoVoto,
      };
    });

    // 2. Filtrar solo los que tienen acciones con derecho a voto Y asistieron
    const votantes = accionistasConAcciones
      .filter((item) => item.totalAccionesConDerechoVoto > 0)
      .map((item) => {
        const asistencia = asistencias.find((a) => a.accionista.id === item.accionista.id);

        if (!asistencia || !asistencia.asistio) {
          return null;
        }

        return {
          id: asistencia.id,
          accionistaId: item.accionista.id,
          accionista: item.accionista,
          nombreCompleto: getNombreCompletoShareholder(item.accionista),
          tipoPersona: item.accionista.person.tipo,
          accionesConDerechoVoto: item.totalAccionesConDerechoVoto,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return votantes;
  }

  /**
   * Obtener votantes (asistentes con acciones con derecho a voto)
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  const votantes = computed(() => {
    return mapearVotantesDesdeSnapshot();
  });

  /**
   * Generar pregunta de votación usando datos del gerente del snapshot
   */
  const pregunta = computed(() => {
    const gerente = snapshotStore.snapshot?.gerenteGeneral;

    if (!gerente) {
      return "Se aprueba el nombramiento del gerente general.";
    }

    const nombreGerente = getNombreCompletoGerente(gerente.persona);

    return `Se aprueba el nombramiento del gerente general ${nombreGerente} en sus funciones como gerente general de la sociedad.`;
  });

  /**
   * Mensaje de aprobación
   */
  const mensajeAprobacion = computed(() => {
    return "el nombramiento del gerente general.";
  });

  /**
   * Sincroniza votos históricos con votantes actuales
   */
  function sincronizarVotosConVotantesActuales() {
    if (!votacionStore.itemVotacion) {
      return;
    }

    const item = votacionStore.itemVotacion;
    const votantesActuales = votantes.value;
    const accionistasIdsActuales = new Set(votantesActuales.map((v) => v.accionistaId));

    // ✅ Filtrar votos: solo mantener los de accionistas que actualmente tienen derecho a voto
    const votosSincronizados = item.votos.filter((voto) =>
      accionistasIdsActuales.has(voto.accionistaId)
    );

    // Actualizar votos en el item
    item.votos = votosSincronizados;

    console.log(
      "[DEBUG][VotacionNombramientoGerenteController] Sincronización de votos completada:",
      {
        votosAntes: item.votos.length,
        votosDespues: votosSincronizados.length,
        votantesActuales: votantesActuales.length,
      }
    );
  }

  /**
   * Obtener voto de un accionista
   */
  function getVoto(accionistaId: string): VoteValue | null {
    const voto = votacionStore.getVotoByAccionista(accionistaId);
    if (!voto) return null;
    return voto.valor as VoteValue;
  }

  /**
   * Establecer voto de un accionista (SOLO actualiza estado local, NO guarda, NO hace fetch)
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Creando sesión en memoria al votar (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const preguntaValue = pregunta.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.DESIGNACION_GERENTE,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: preguntaValue,
            descripción: "Votación sobre el nombramiento del gerente general",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Creando item en memoria al votar (no guardado todavía)"
      );
      const itemId = votacionStore.generateUuid();
      const preguntaValue = pregunta.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: preguntaValue,
        descripción: "Votación sobre el nombramiento del gerente general",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[Controller][VotacionNombramientoGerente] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      votoExistente.valor = valor as string | number;
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Voto actualizado en memoria:",
        {
          accionistaId,
          valor,
        }
      );
    } else {
      const voteId = votacionStore.generateUuid();
      item.votos.push({
        id: voteId,
        accionistaId,
        valor: valor as string | number,
      });
      console.log("[DEBUG][VotacionNombramientoGerenteController] Voto agregado en memoria:", {
        accionistaId,
        valor,
        voteId,
      });
    }
  }

  /**
   * Cambiar tipo de aprobación (SOLO actualiza estado local, NO guarda, NO hace fetch)
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    console.log(
      "[DEBUG][VotacionNombramientoGerenteController] cambiarTipoAprobacion llamado:",
      {
        tipo,
        hasVotacion: votacionStore.hasVotacion,
        hasSesion: !!votacionStore.sesionVotacion,
        hasItem: !!votacionStore.itemVotacion,
      }
    );

    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Creando sesión en memoria (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const preguntaValue = pregunta.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.DESIGNACION_GERENTE,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: preguntaValue,
            descripción: "Votación sobre el nombramiento del gerente general",
            tipoAprobacion,
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Si hay sesión pero no hay item, crear item en memoria
      if (!votacionStore.itemVotacion) {
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Creando item en memoria (no guardado todavía)"
        );
        const itemId = votacionStore.generateUuid();
        const preguntaValue = pregunta.value;

        votacionStore.sesionVotacion.items.push({
          id: itemId,
          orden: 0,
          label: preguntaValue,
          descripción: "Votación sobre el nombramiento del gerente general",
          tipoAprobacion,
          votos: [],
        });
      } else {
        // ✅ Actualizar tipoAprobacion en el item existente (solo en memoria)
        const item = votacionStore.itemVotacion;
        item.tipoAprobacion = tipoAprobacion;
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Tipo de aprobación actualizado en memoria:",
          {
            tipo,
            tipoAprobacion,
            itemId: item.id,
          }
        );
      }
    }
  }

  /**
   * Guardar votación (para useJuntasFlowNext)
   */
  async function guardarVotacion() {
    console.log(
      "[DEBUG][VotacionNombramientoGerenteController] guardarVotacion() ejecutado - Iniciando guardado..."
    );

    // ✅ 1. Asegurar que hay sesión/item en memoria (crear si no existe)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] No hay sesión en memoria, creando..."
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const preguntaValue = pregunta.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.DESIGNACION_GERENTE,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: preguntaValue,
            descripción: "Votación sobre el nombramiento del gerente general",
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Asegurar que el contexto de la sesión existente sea correcto
      if (votacionStore.sesionVotacion.contexto !== VoteContext.DESIGNACION_GERENTE) {
        console.warn(
          "[DEBUG][VotacionNombramientoGerenteController] ⚠️ Contexto incorrecto en sesión existente, corrigiendo...",
          {
            contextoActual: votacionStore.sesionVotacion.contexto,
            contextoCorrecto: VoteContext.DESIGNACION_GERENTE,
          }
        );
        votacionStore.sesionVotacion.contexto = VoteContext.DESIGNACION_GERENTE;
      }
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] No hay item en memoria, creando..."
      );
      const itemId = votacionStore.generateUuid();
      const preguntaValue = pregunta.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: preguntaValue,
        descripción: "Votación sobre el nombramiento del gerente general",
        tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
        votos: [],
      });
    }

    const finalItem = votacionStore.itemVotacion!;
    const tipoAprobacion = finalItem.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS;

    console.log("[DEBUG][VotacionNombramientoGerenteController] Estado antes de guardar:", {
      tipoAprobacion,
      votosActuales: finalItem.votos.length,
      votantesDisponibles: votantes.value.length,
    });

    try {
      // ✅ 2. Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Es unanimidad - generando todos los votos a favor"
        );

        finalItem.votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));

        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Votos generados para unanimidad:",
          finalItem.votos.length
        );
      } else {
        // ✅ 3. Si es sometida a votos, sincronizar votos con votantes actuales
        sincronizarVotosConVotantesActuales();

        const itemSincronizado = votacionStore.itemVotacion!;
        finalItem.votos = itemSincronizado.votos;

        if (finalItem.votos.length === 0) {
          throw new Error("Debe registrar al menos un voto para votación por mayoría");
        }
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Es sometida a votos - usando votos sincronizados:",
          finalItem.votos.length
        );
      }

      // ✅ 4. Actualizar la sesión en memoria con los votos generados/seleccionados
      const itemEnSesion = votacionStore.sesionVotacion!.items[0];
      if (itemEnSesion) {
        itemEnSesion.id = finalItem.id;
        itemEnSesion.label = finalItem.label;
        itemEnSesion.descripción = finalItem.descripción;
        itemEnSesion.tipoAprobacion = finalItem.tipoAprobacion;
        itemEnSesion.votos = finalItem.votos;
      }

      // ✅ 5. Crear o actualizar la votación en el backend
      const existeEnBackend = votacionStore.hasVotacion;
      const itemExisteEnBackend = existeEnBackend && !!votacionStore.itemVotacion;

      console.log("[DEBUG][VotacionNombramientoGerenteController] Estado antes de guardar:", {
        existeEnBackend,
        itemExisteEnBackend,
        sessionId: votacionStore.sesionVotacion!.id,
        itemId: finalItem.id,
        tipoAprobacion,
        votosCount: finalItem.votos.length,
      });

      if (!existeEnBackend) {
        // ✅ Crear nueva votación con POST
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Creando nueva votación en backend (POST con todo)..."
        );

        votacionStore.sesionVotacion!.items[0] = finalItem;

        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          VoteContext.DESIGNACION_GERENTE
        );

        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Votación creada exitosamente"
        );
      } else if (!itemExisteEnBackend) {
        // ✅ Sesión existe pero item no existe: usar PUT con accion: "add"
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Agregando item a sesión existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.addVoteItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.DESIGNACION_GERENTE
        );

        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Item agregado exitosamente"
        );
      } else {
        // ✅ Sesión e item existen: usar PUT con accion: "add" para reemplazar todo
        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Actualizando item existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.DESIGNACION_GERENTE
        );

        console.log(
          "[DEBUG][VotacionNombramientoGerenteController] Item actualizado exitosamente"
        );
      }

      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Guardado completado exitosamente"
      );
    } catch (error: any) {
      console.error(
        "[Controller][VotacionNombramientoGerente] Error al guardar votación:",
        error
      );
      throw error;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    if (!votacionStore.hasVotacion) {
      loadData();
    }
  });

  return {
    // Estado
    votantes,
    pregunta,
    mensajeAprobacion,
    isLoading: computed(() => votacionStore.status === "loading" || isLoading.value),
    error: computed(() => votacionStore.errorMessage || error.value),
    esUnanimidad: computed(() => votacionStore.esUnanimidad),
    esSometidaAVotacion: computed(() => votacionStore.esSometidaAVotacion),

    // Métodos
    getVoto,
    setVoto,
    cambiarTipoAprobacion,
    guardarVotacion,
    loadData,
  };
}
