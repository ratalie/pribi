import { computed, onActivated, onMounted } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";
import { useCapitalizacionesManagerStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesManagerStore";

/**
 * Controller para la vista de Votación de Capitalización de Créditos
 *
 * Orquesta:
 * - Carga de datos (asistentes, capitalizaciones, snapshot)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionCapitalizacionController() {
  const route = useRoute();
  const votacionStore = useVotacionStore();
  const capitalizacionesManagerStore = useCapitalizacionesManagerStore();
  const snapshotStore = useSnapshotStore();
  const asistenciaStore = useAsistenciaStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const isLoading = computed(() => votacionStore.status === "loading");
  const error = computed(() => votacionStore.errorMessage);

  /**
   * Helper: Obtener nombre completo de un accionista
   */
  function getNombreCompletoShareholder(shareholder: any): string {
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
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][VotacionCapitalizacionController] No hay snapshot disponible para mapear votantes"
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
   * Obtener votantes (solo asistentes) con formato para componentes
   * ✅ FUENTE DE VERDAD: Snapshot (calcula accionesConDerechoVoto desde snapshot)
   */
  const votantes = computed(() => {
    const votantesMapeados = mapearVotantesDesdeSnapshot();
    return votantesMapeados;
  });

  /**
   * Generar texto de votación desde capitalizaciones
   */
  const textoVotacion = computed(() => {
    const capitalizaciones = capitalizacionesManagerStore.capitalizaciones;

    if (capitalizaciones.length === 0) {
      return "Se aprueba la capitalización de créditos propuesta.";
    }

    // Calcular totales
    const montoTotal = capitalizaciones.reduce(
      (sum, c) => sum + (c.montoConvertido || c.monto),
      0
    );
    const accionesNuevas = capitalizaciones.reduce((sum, c) => sum + c.accionesPorRecibir, 0);

    // Obtener valor nominal desde snapshot
    const valorNominal = snapshotStore.snapshot?.nominalValue || 0;
    const primeraCapitalizacion = capitalizaciones[0];
    const moneda = primeraCapitalizacion.tipoMoneda === "USD" ? "$" : "S/";

    // Calcular capital antes y después
    const asignaciones = snapshotStore.snapshot?.shareAllocations || [];
    const accionesAntes = asignaciones.reduce((sum, asig) => sum + asig.cantidadSuscrita, 0);
    const capitalAntes = accionesAntes * valorNominal;
    const capitalDespues = capitalAntes + montoTotal;
    const accionesDespues = accionesAntes + accionesNuevas;

    return `Se aprueba el aumento de capital POR ${moneda}${montoTotal.toFixed(2)} ${
      primeraCapitalizacion.tipoMoneda === "USD" ? "dólares" : "soles"
    }, vía capitalización de créditos, mediante la emisión de ${accionesNuevas} acciones con un valor nominal de ${moneda}${valorNominal.toFixed(
      2
    )}, haciendo que el capital aumente de ${moneda}${capitalAntes.toFixed(
      2
    )} (${accionesAntes} acciones) a ${moneda}${capitalDespues.toFixed(
      2
    )} (${accionesDespues} acciones)`;
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
        "[DEBUG][VotacionCapitalizacionController] Creando sesión en memoria al votar (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.CAPITALIZACION_DE_CREDITOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción:
              "Votación sobre la aprobación de la capitalización de créditos propuesta",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionCapitalizacionController] Creando item en memoria al votar (no guardado todavía)"
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de la capitalización de créditos propuesta",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[VotacionCapitalizacionController] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      // Actualizar voto existente en estado local
      votoExistente.valor = valor as string | number;
      console.log("[DEBUG][VotacionCapitalizacionController] Voto actualizado en memoria:", {
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
      console.log("[DEBUG][VotacionCapitalizacionController] Voto agregado en memoria:", {
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
    console.log("[DEBUG][VotacionCapitalizacionController] cambiarTipoAprobacion llamado:", {
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
        "[DEBUG][VotacionCapitalizacionController] Creando sesión en memoria (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.CAPITALIZACION_DE_CREDITOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción:
              "Votación sobre la aprobación de la capitalización de créditos propuesta",
            tipoAprobacion,
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Si hay sesión pero no hay item, crear item en memoria
      if (!votacionStore.itemVotacion) {
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Creando item en memoria (no guardado todavía)"
        );
        const itemId = votacionStore.generateUuid();
        const textoVotacionValue = textoVotacion.value;

        votacionStore.sesionVotacion.items.push({
          id: itemId,
          orden: 0,
          label: textoVotacionValue,
          descripción:
            "Votación sobre la aprobación de la capitalización de créditos propuesta",
          tipoAprobacion,
          votos: [],
        });
      } else {
        // ✅ Actualizar tipoAprobacion en el item existente (solo en memoria)
        const item = votacionStore.itemVotacion;
        item.tipoAprobacion = tipoAprobacion;
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Tipo de aprobación actualizado en memoria:",
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
      "[DEBUG][VotacionCapitalizacionController] guardarVotacion() ejecutado - Iniciando guardado..."
    );

    // ✅ 1. Asegurar que hay sesión/item en memoria (crear si no existe)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionCapitalizacionController] No hay sesión en memoria, creando..."
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.CAPITALIZACION_DE_CREDITOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción:
              "Votación sobre la aprobación de la capitalización de créditos propuesta",
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
            votos: [],
          },
        ],
      };
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.log(
        "[DEBUG][VotacionCapitalizacionController] No hay item en memoria, creando..."
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de la capitalización de créditos propuesta",
        tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
        votos: [],
      });
    }

    const finalItem = votacionStore.itemVotacion!;
    const tipoAprobacion = finalItem.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS;

    console.log("[DEBUG][VotacionCapitalizacionController] Estado antes de guardar:", {
      tipoAprobacion,
      votosActuales: finalItem.votos.length,
      votantesDisponibles: votantes.value.length,
    });

    try {
      // ✅ 2. Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Es unanimidad - generando todos los votos a favor"
        );

        // Limpiar votos existentes y generar nuevos para todos los votantes
        finalItem.votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));

        console.log(
          "[DEBUG][VotacionCapitalizacionController] Votos generados para unanimidad:",
          finalItem.votos.length
        );
      } else {
        // ✅ 3. Si es sometida a votos, validar que haya votos
        if (finalItem.votos.length === 0) {
          throw new Error("Debe registrar al menos un voto para votación por mayoría");
        }
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Es sometida a votos - usando votos del usuario:",
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
        itemEnSesion.votos = finalItem.votos;
      }

      // ✅ 5. Crear o actualizar la votación en el backend
      // ⚠️ IMPORTANTE: Enviar TODO en un solo request (item + votos)
      const existeEnBackend = votacionStore.hasVotacion;
      const itemExisteEnBackend = existeEnBackend && !!votacionStore.itemVotacion;

      console.log("[DEBUG][VotacionCapitalizacionController] Estado antes de guardar:", {
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
          "[DEBUG][VotacionCapitalizacionController] Creando nueva votación en backend (POST con todo)..."
        );

        // ✅ Asegurar que la sesión en memoria tenga los votos antes de crear
        votacionStore.sesionVotacion!.items[0] = finalItem;

        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          VoteContext.CAPITALIZACION_DE_CREDITOS
        );

        console.log("[DEBUG][VotacionCapitalizacionController] Votación creada exitosamente");
      } else if (!itemExisteEnBackend) {
        // ✅ Sesión existe pero item no existe: usar PUT con accion: "add" (incluyendo votos)
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Agregando item a sesión existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.addVoteItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.CAPITALIZACION_DE_CREDITOS
        );

        console.log("[DEBUG][VotacionCapitalizacionController] Item agregado exitosamente");
      } else {
        // ✅ Sesión e item existen: usar PUT con accion: "add" para reemplazar todo (incluyendo votos)
        // ⚠️ IMPORTANTE: Enviar todo en un solo request
        console.log(
          "[DEBUG][VotacionCapitalizacionController] Actualizando item existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.CAPITALIZACION_DE_CREDITOS
        );

        console.log("[DEBUG][VotacionCapitalizacionController] Item actualizado exitosamente");
      }

      console.log(
        "[DEBUG][VotacionCapitalizacionController] Guardado completado exitosamente"
      );
    } catch (error: any) {
      console.error("[VotacionCapitalizacionController] Error al guardar votación:", error);
      throw error;
    }
  }

  /**
   * Cargar datos necesarios para la votación
   */
  async function loadData() {
    try {
      console.log("[VotacionCapitalizacionController] Cargando datos...");

      // 1. Cargar snapshot (para capital actual y mapear votantes)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes - solo los que asistieron)
      console.log("[DEBUG][VotacionCapitalizacionController] Cargando asistentes...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      // 3. Cargar capitalizaciones
      await capitalizacionesManagerStore.loadCapitalizaciones(
        String(societyId.value),
        String(flowId.value)
      );

      // 4. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(
          societyId.value,
          flowId.value,
          VoteContext.CAPITALIZACION_DE_CREDITOS
        );
        console.log("[DEBUG][VotacionCapitalizacionController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
        });
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionCapitalizacionController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[VotacionCapitalizacionController] Error al cargar votación:", error);
        }
      }

      console.log("[VotacionCapitalizacionController] Datos cargados exitosamente");
    } catch (error: any) {
      console.error("[VotacionCapitalizacionController] Error al cargar datos:", error);
      throw error;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar datos al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    loadData();
  });

  return {
    isLoading,
    error,
    votantes,
    textoVotacion,
    guardarVotacion,
    setVoto,
    cambiarTipoAprobacion,
    getVoto,
    loadData,
  };
}
