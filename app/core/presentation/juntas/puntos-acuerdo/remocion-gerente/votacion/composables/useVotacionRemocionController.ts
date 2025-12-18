import { computed, nextTick, onActivated, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionRemocionStore } from "../stores/useVotacionRemocionStore";

/**
 * Controller para la vista de Votación de Remoción de Gerente
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Filtrado de votantes (asistentes con acciones con derecho a voto)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionRemocionController() {
  const route = useRoute();
  const votacionStore = useVotacionStore();
  const votacionRemocionStore = useVotacionRemocionStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot (para gerente general)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes)
      console.log("[DEBUG][VotacionRemocionController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionRemocionController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );

      // 3. Cargar votación existente (si existe)
      try {
        await votacionStore.loadVotacion(
          societyId.value,
          flowId.value,
          VoteContext.REMOCION_GERENTE
        );
        console.log("[DEBUG][VotacionRemocionController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
          contexto: votacionStore.sesionVotacion?.contexto,
        });

        // ✅ 4. Verificar que el contexto de la sesión cargada sea correcto
        if (
          votacionStore.sesionVotacion &&
          votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_GERENTE
        ) {
          console.error(
            "[DEBUG][VotacionRemocionController] ⚠️ ERROR: Sesión cargada tiene contexto incorrecto:",
            {
              contextoEsperado: VoteContext.REMOCION_GERENTE,
              contextoObtenido: votacionStore.sesionVotacion.contexto,
            }
          );
          // Limpiar la sesión incorrecta para evitar conflictos
          votacionStore.sesionVotacion = null;
        }

        // ✅ 5. Sincronizar votos con votantes actuales (fuente de verdad)
        // Esto asegura que solo se mantengan votos de accionistas que actualmente tienen derecho a voto
        // Usar nextTick para asegurar que votantes esté definido
        if (votacionStore.hasVotacion && votacionStore.itemVotacion) {
          await nextTick();
          sincronizarVotosConVotantesActuales();
        }
      } catch (error: any) {
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionRemocionController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[Controller][VotacionRemocion] Error al cargar votación:", error);
        }
      }
    } catch (error: any) {
      console.error("[Controller][VotacionRemocion] Error al cargar datos:", error);
      throw error;
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
   * Mapper: Calcular votantes desde snapshot + asistencias
   *
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   *
   * Lógica:
   * 1. Calcular acciones con derecho a voto desde snapshot (shareAllocations + shareClasses)
   * 2. Filtrar solo accionistas que asistieron (asistenciaStore)
   * 3. Combinar datos: snapshot (accionista, acciones) + asistencia (id registro, representante)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][VotacionRemocionController] No hay snapshot disponible para mapear votantes"
      );
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    console.log("[DEBUG][VotacionRemocionController] Mapeando votantes desde snapshot:", {
      totalShareholders: shareholders.length,
      totalShareAllocations: shareAllocations.length,
      totalShareClasses: shareClasses.length,
      totalAsistencias: asistencias.length,
    });

    // 1. Calcular acciones con derecho a voto por accionista desde snapshot
    const accionistasConAcciones = shareholders.map((accionista) => {
      // Buscar todas las asignaciones de este accionista
      const asignaciones = shareAllocations.filter(
        (asig) => asig.accionistaId === accionista.id
      );

      let totalAccionesConDerechoVoto = 0;

      asignaciones.forEach((asig) => {
        // Buscar la clase de acción correspondiente
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);

        if (!shareClass) {
          console.warn(
            `[DEBUG][VotacionRemocionController] No se encontró shareClass con id ${asig.accionId} para accionista ${accionista.id}`
          );
          return;
        }

        // Solo contar acciones con derecho a voto
        if (shareClass.conDerechoVoto) {
          totalAccionesConDerechoVoto += asig.cantidadSuscrita;
        }
      });

      return {
        accionista,
        totalAccionesConDerechoVoto,
      };
    });

    console.log(
      "[DEBUG][VotacionRemocionController] Accionistas con acciones calculadas:",
      accionistasConAcciones.map((item) => ({
        accionistaId: item.accionista.id,
        nombre: getNombreCompletoShareholder(item.accionista),
        accionesConDerechoVoto: item.totalAccionesConDerechoVoto,
      }))
    );

    // 2. Filtrar solo los que tienen acciones con derecho a voto Y asistieron
    const votantes = accionistasConAcciones
      .filter((item) => item.totalAccionesConDerechoVoto > 0)
      .map((item) => {
        // Buscar registro de asistencia del accionista
        const asistencia = asistencias.find((a) => a.accionista.id === item.accionista.id);

        // Solo incluir si asistió
        if (!asistencia || !asistencia.asistio) {
          return null;
        }

        // Combinar datos: snapshot (accionista, acciones) + asistencia (id, representante)
        return {
          id: asistencia.id, // ID del registro de asistencia
          accionistaId: item.accionista.id, // ID del accionista (para votos)
          accionista: item.accionista,
          nombreCompleto: getNombreCompletoShareholder(item.accionista),
          tipoPersona: item.accionista.person.tipo,
          accionesConDerechoVoto: item.totalAccionesConDerechoVoto, // ✅ Calculado desde snapshot
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    console.log("[DEBUG][VotacionRemocionController] Votantes mapeados desde snapshot:", {
      total: votantes.length,
      votantes: votantes.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        nombreCompleto: v.nombreCompleto,
        accionesConDerechoVoto: v.accionesConDerechoVoto,
      })),
    });

    return votantes;
  }

  /**
   * Obtener votantes (asistentes con acciones con derecho a voto)
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  const votantes = computed(() => {
    // ✅ Usar mapper que calcula desde snapshot
    return mapearVotantesDesdeSnapshot();
  });

  /**
   * Sincroniza votos históricos con votantes actuales
   *
   * ⚠️ IMPORTANTE: Los votantes actuales son la fuente de verdad
   * - Solo se mantienen votos de accionistas que actualmente tienen derecho a voto
   * - Los votos de accionistas que ya no tienen derecho a voto se eliminan del item
   * - Los votos históricos quedan en el backend pero no se envían en updates
   */
  function sincronizarVotosConVotantesActuales() {
    if (!votacionStore.itemVotacion) {
      return;
    }

    const item = votacionStore.itemVotacion;
    const votantesActuales = votantes.value;
    const accionistasIdsActuales = new Set(votantesActuales.map((v) => v.accionistaId));

    // Contar votos antes de sincronizar
    const votosAntes = item.votos.length;

    // ✅ Filtrar votos: solo mantener los de accionistas que actualmente tienen derecho a voto
    const votosSincronizados = item.votos.filter((voto) =>
      accionistasIdsActuales.has(voto.accionistaId)
    );

    // Contar votos después de sincronizar
    const votosDespues = votosSincronizados.length;
    const votosEliminados = votosAntes - votosDespues;

    // Actualizar votos en el item
    item.votos = votosSincronizados;

    console.log("[DEBUG][VotacionRemocionController] Sincronización de votos completada:", {
      votosAntes,
      votosDespues,
      votosEliminados,
      votantesActuales: votantesActuales.length,
      accionistasConVoto: accionistasIdsActuales.size,
    });

    if (votosEliminados > 0) {
      console.warn(
        `[DEBUG][VotacionRemocionController] ⚠️ Se eliminaron ${votosEliminados} votos de accionistas que ya no tienen derecho a voto`
      );
    }
  }

  /**
   * Obtener texto de votación
   */
  const textoVotacion = computed(() => {
    if (votacionStore.itemVotacion) {
      return votacionStore.itemVotacion.label;
    }
    return votacionRemocionStore.textoVotacion;
  });

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
   * ⚠️ IMPORTANTE: Si no hay sesión/item, se crea en memoria (se guardará al hacer "Siguiente")
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionRemocionController] Creando sesión en memoria al votar (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionRemocionStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_GERENTE, // ✅ Contexto específico
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la remoción del gerente general",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionRemocionController] Creando item en memoria al votar (no guardado todavía)"
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionRemocionStore.textoVotacion;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la remoción del gerente general",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[Controller][VotacionRemocion] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      // Actualizar voto existente en estado local
      votoExistente.valor = valor as string | number;
      console.log("[DEBUG][VotacionRemocionController] Voto actualizado en memoria:", {
        accionistaId,
        valor,
      });
    } else {
      // Agregar nuevo voto en estado local
      const voteId = votacionStore.generateUuid();
      item.votos.push({
        id: voteId,
        accionistaId,
        valor: valor as string | number,
      });
      console.log("[DEBUG][VotacionRemocionController] Voto agregado en memoria:", {
        accionistaId,
        valor,
        voteId,
      });
    }
  }

  /**
   * Cambiar tipo de aprobación (SOLO actualiza estado local, NO guarda, NO hace fetch)
   * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
   * ⚠️ IMPORTANTE: Si no hay sesión/item, se crea en memoria (se guardará al hacer "Siguiente")
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    console.log("[DEBUG][VotacionRemocionController] cambiarTipoAprobacion llamado:", {
      tipo,
      hasVotacion: votacionStore.hasVotacion,
      hasSesion: !!votacionStore.sesionVotacion,
      hasItem: !!votacionStore.itemVotacion,
    });

    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionRemocionController] Creando sesión en memoria (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionRemocionStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_GERENTE, // ✅ Contexto específico
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la remoción del gerente general",
            tipoAprobacion,
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Si hay sesión pero no hay item, crear item en memoria
      if (!votacionStore.itemVotacion) {
        console.log(
          "[DEBUG][VotacionRemocionController] Creando item en memoria (no guardado todavía)"
        );
        const itemId = votacionStore.generateUuid();
        const textoVotacionValue = votacionRemocionStore.textoVotacion;

        votacionStore.sesionVotacion.items.push({
          id: itemId,
          orden: 0,
          label: textoVotacionValue,
          descripción: "Votación sobre la remoción del gerente general",
          tipoAprobacion,
          votos: [],
        });
      } else {
        // ✅ Actualizar tipoAprobacion en el item existente (solo en memoria)
        const item = votacionStore.itemVotacion;
        item.tipoAprobacion = tipoAprobacion;
        console.log(
          "[DEBUG][VotacionRemocionController] Tipo de aprobación actualizado en memoria:",
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
   * ⚠️ IMPORTANTE: Esta función se ejecuta SOLO cuando el usuario hace click en "Siguiente"
   *
   * Lógica:
   * 1. Si no hay sesión/item en memoria, crearlos con datos actuales
   * 2. Si es unanimidad: generar todos los votos a favor automáticamente
   * 3. Si es sometida a votos: usar los votos que el usuario haya seleccionado
   * 4. Crear o actualizar la votación en el backend
   */
  async function guardarVotacion() {
    console.log(
      "[DEBUG][VotacionRemocionController] guardarVotacion() ejecutado - Iniciando guardado..."
    );

    // ✅ 1. Asegurar que hay sesión/item en memoria (crear si no existe)
    // ⚠️ IMPORTANTE: Asegurar que el contexto siempre sea REMOCION_GERENTE
    if (!votacionStore.sesionVotacion) {
      console.log("[DEBUG][VotacionRemocionController] No hay sesión en memoria, creando...");
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionRemocionStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_GERENTE, // ✅ Contexto específico
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la remoción del gerente general",
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Asegurar que el contexto de la sesión existente sea correcto
      if (votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_GERENTE) {
        console.warn(
          "[DEBUG][VotacionRemocionController] ⚠️ Contexto incorrecto en sesión existente, corrigiendo...",
          {
            contextoActual: votacionStore.sesionVotacion.contexto,
            contextoCorrecto: VoteContext.REMOCION_GERENTE,
          }
        );
        votacionStore.sesionVotacion.contexto = VoteContext.REMOCION_GERENTE;
      }
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.log("[DEBUG][VotacionRemocionController] No hay item en memoria, creando...");
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionRemocionStore.textoVotacion;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la remoción del gerente general",
        tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
        votos: [],
      });
    }

    const finalItem = votacionStore.itemVotacion!;
    const tipoAprobacion = finalItem.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS;

    console.log("[DEBUG][VotacionRemocionController] Estado antes de guardar:", {
      tipoAprobacion,
      votosActuales: finalItem.votos.length,
      votantesDisponibles: votantes.value.length,
    });

    try {
      // ✅ 2. Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        console.log(
          "[DEBUG][VotacionRemocionController] Es unanimidad - generando todos los votos a favor"
        );

        // Limpiar votos existentes y generar nuevos para todos los votantes
        finalItem.votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));

        console.log(
          "[DEBUG][VotacionRemocionController] Votos generados para unanimidad:",
          finalItem.votos.length
        );
      } else {
        // ✅ 3. Si es sometida a votos, sincronizar votos con votantes actuales antes de validar
        // ⚠️ IMPORTANTE: Asegurar que solo se envíen votos de votantes actuales (fuente de verdad)
        sincronizarVotosConVotantesActuales();

        // Actualizar finalItem con votos sincronizados
        const itemSincronizado = votacionStore.itemVotacion!;
        finalItem.votos = itemSincronizado.votos;

        // Validar que haya votos después de sincronización
        if (finalItem.votos.length === 0) {
          throw new Error("Debe registrar al menos un voto para votación por mayoría");
        }
        console.log(
          "[DEBUG][VotacionRemocionController] Es sometida a votos - usando votos sincronizados:",
          finalItem.votos.length
        );
      }

      // ✅ 4. Actualizar la sesión en memoria con los votos generados/seleccionados
      // Asegurar que el item tenga los datos correctos
      const itemEnSesion = votacionStore.sesionVotacion!.items[0];
      if (itemEnSesion) {
        itemEnSesion.id = finalItem.id;
        itemEnSesion.label = finalItem.label;
        itemEnSesion.descripción = finalItem.descripción;
        itemEnSesion.tipoAprobacion = finalItem.tipoAprobacion;
        itemEnSesion.votos = finalItem.votos; // ✅ Actualizar con votos generados/seleccionados
      }

      // ✅ 5. Crear o actualizar la votación en el backend
      // ⚠️ IMPORTANTE: Enviar TODO en un solo request (item + votos)
      const existeEnBackend = votacionStore.hasVotacion;
      const itemExisteEnBackend = existeEnBackend && !!votacionStore.itemVotacion;

      console.log("[DEBUG][VotacionRemocionController] Estado antes de guardar:", {
        existeEnBackend,
        itemExisteEnBackend,
        sessionId: votacionStore.sesionVotacion!.id,
        itemId: finalItem.id,
        tipoAprobacion,
        votosCount: finalItem.votos.length,
      });

      if (!existeEnBackend) {
        // ✅ Crear nueva votación con POST (incluyendo item + votos en un solo request)
        console.log(
          "[DEBUG][VotacionRemocionController] Creando nueva votación en backend (POST con todo)..."
        );
        console.log("[DEBUG][VotacionRemocionController] Datos a crear:", {
          sessionId: votacionStore.sesionVotacion!.id,
          itemId: finalItem.id,
          tipoAprobacion,
          votosCount: finalItem.votos.length,
        });

        // ✅ Asegurar que la sesión en memoria tenga los votos antes de crear
        votacionStore.sesionVotacion!.items[0] = finalItem;

        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          VoteContext.REMOCION_GERENTE
        );

        console.log("[DEBUG][VotacionRemocionController] Votación creada exitosamente");
      } else if (!itemExisteEnBackend) {
        // ✅ Sesión existe pero item no existe: usar PUT con accion: "add" (incluyendo votos)
        console.log(
          "[DEBUG][VotacionRemocionController] Agregando item a sesión existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.addVoteItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.REMOCION_GERENTE
        );

        console.log("[DEBUG][VotacionRemocionController] Item agregado exitosamente");
      } else {
        // ✅ Sesión e item existen: usar PUT con accion: "add" para reemplazar todo (incluyendo votos)
        // ⚠️ IMPORTANTE: Enviar todo en un solo request
        console.log(
          "[DEBUG][VotacionRemocionController] Actualizando item existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.REMOCION_GERENTE
        );

        console.log("[DEBUG][VotacionRemocionController] Item actualizado exitosamente");
      }

      console.log("[DEBUG][VotacionRemocionController] Guardado completado exitosamente");
    } catch (error: any) {
      console.error("[Controller][VotacionRemocion] Error al guardar votación:", error);
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
    textoVotacion,
    isLoading: computed(() => votacionStore.status === "loading"),
    error: computed(() => votacionStore.errorMessage),
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
