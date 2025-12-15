import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionAplicacionResultadosStore } from "../stores/useVotacionAplicacionResultadosStore";

/**
 * Controller para la vista de Votación de Aplicación de Resultados
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionAplicacionResultadosController() {
  const route = useRoute();
  const votacionStore = useVotacionAplicacionResultadosStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Cargar snapshot
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes - solo los que asistieron)
      console.log("[DEBUG][VotacionAplicacionResultadosController] Cargando asistentes...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Asistentes cargados:",
        asistenciaStore.asistencias
      );
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Asistentes que asistieron:",
        asistenciaStore.asistencias.filter((a) => a.asistio)
      );

      // 3. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionAplicacionResultadosController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
        });
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionAplicacionResultadosController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionAplicacionResultados] Error al cargar votación:",
            error
          );
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Carga de datos completada:",
        {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          votantesCount: votantes.value.length,
        }
      );
    } catch (error: any) {
      console.error(
        "[Controller][VotacionAplicacionResultados] Error al cargar datos:",
        error
      );
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtener votantes (solo asistentes) con formato para componentes
   */
  const votantes = computed(() => {
    const asistentes = asistenciaStore.asistenciasEnriquecidas;
    const filtrados = asistentes.filter((a) => a.asistio);

    console.log(
      "[DEBUG][VotacionAplicacionResultadosController] Votantes filtrados:",
      filtrados
    );

    return filtrados.map((a) => ({
      id: a.id, // ID del registro de asistencia
      accionistaId: a.accionista.id, // ✅ ID del accionista (para votos)
      accionista: a.accionista,
      nombreCompleto: a.nombreCompleto,
      tipoPersona: a.tipoPersona,
    }));
  });

  /**
   * Obtener texto de votación
   */
  const textoVotacion = computed(() => {
    if (votacionStore.itemVotacion) {
      return votacionStore.itemVotacion.label;
    }
    // Texto por defecto para aplicación de resultados
    return "¿Se aprueba la propuesta de aplicación de los resultados del ejercicio?";
  });

  /**
   * Obtener voto de un accionista
   * ✅ Computed para que sea reactivo cuando cambie el store
   */
  const getVoto = computed(() => {
    return (accionistaId: string): VoteValue | null => {
      const voto = votacionStore.getVotoByAccionista(accionistaId);
      if (!voto) return null;
      return voto.valor as VoteValue;
    };
  });

  /**
   * Establecer voto de un accionista (SOLO actualiza estado local, NO guarda, NO hace fetch)
   * ⚠️ IMPORTANTE: Si no hay sesión/item, se crea en memoria (se guardará al hacer "Siguiente")
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Creando sesión en memoria al votar (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.APLICACION_UTILIDADES,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción:
              "Votación sobre la aprobación de la propuesta de aplicación de los resultados del ejercicio",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Creando item en memoria al votar (no guardado todavía)"
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción:
          "Votación sobre la aprobación de la propuesta de aplicación de los resultados del ejercicio",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[Controller][VotacionAplicacionResultados] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      // Actualizar voto existente en estado local
      votoExistente.valor = valor as string | number;
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Voto actualizado en memoria:",
        {
          accionistaId,
          valor,
        }
      );
    } else {
      // Agregar nuevo voto en estado local
      const voteId = votacionStore.generateUuid();
      item.votos.push({
        id: voteId,
        accionistaId,
        valor: valor as string | number,
      });
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Voto agregado en memoria:",
        {
          accionistaId,
          valor,
          voteId,
        }
      );
    }
  }

  /**
   * Cambiar tipo de votación (unanimidad/mayoría)
   */
  async function cambiarTipo(tipo: "unanimidad" | "mayoria") {
    // ✅ Si no hay sesión, crear en memoria
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Creando sesión en memoria al cambiar tipo"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.APLICACION_UTILIDADES,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción:
              "Votación sobre la aprobación de la aplicación de resultados económicos",
            tipoAprobacion:
              tipo === "unanimidad"
                ? VoteAgreementType.APROBADO_POR_TODOS
                : VoteAgreementType.SOMETIDO_A_VOTACION,
            votos: [],
          },
        ],
      };
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Sesión creada con tipo:",
        tipo
      );
      return;
    }

    // ✅ Si hay sesión pero no hay item, crear item
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Creando item en memoria al cambiar tipo"
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de la aplicación de resultados económicos",
        tipoAprobacion:
          tipo === "unanimidad"
            ? VoteAgreementType.APROBADO_POR_TODOS
            : VoteAgreementType.SOMETIDO_A_VOTACION,
        votos: [],
      });
      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Item creado con tipo:",
        tipo
      );
      return;
    }

    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // Si cambia a unanimidad, limpiar votos (no se necesitan)
    if (tipo === "unanimidad") {
      votacionStore.itemVotacion.votos = [];
    }

    // Actualizar tipo de aprobación en memoria
    votacionStore.itemVotacion.tipoAprobacion = tipoAprobacion;

    console.log("[DEBUG][VotacionAplicacionResultadosController] Tipo de votación cambiado:", {
      tipo,
      tipoAprobacion,
    });
  }

  /**
   * Guardar votación (crear o actualizar)
   * Se llama cuando el usuario hace click en "Siguiente"
   */
  async function guardarVotacion() {
    console.log("🚀 [VotacionAplicacionResultadosController] guardarVotacion() llamado");
    try {
      isLoading.value = true;
      error.value = null;

      console.log("[DEBUG][VotacionAplicacionResultadosController] Estado antes de guardar:", {
        hasSesion: !!votacionStore.sesionVotacion,
        hasItem: !!votacionStore.itemVotacion,
        hasVotacion: votacionStore.hasVotacion,
        itemId: votacionStore.itemVotacion?.id,
        tipoAprobacion: votacionStore.itemVotacion?.tipoAprobacion,
        votosCount: votacionStore.itemVotacion?.votos.length || 0,
        votantesCount: votantes.value.length,
      });

      if (!votacionStore.sesionVotacion || !votacionStore.itemVotacion) {
        console.error("[DEBUG][VotacionAplicacionResultadosController] No hay sesión o item");
        throw new Error("No hay sesión de votación para guardar");
      }

      const item = votacionStore.itemVotacion;
      const itemId = item.id;
      const label = item.label;
      const descripcion = item.descripción;
      const tipoAprobacion = item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;

      // ✅ Preparar votos para enviar
      let votos: Array<{ id: string; accionistaId: string; valor: string | number }>;

      // ✅ Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        console.log(
          "[DEBUG][VotacionAplicacionResultadosController] Es unanimidad - generando todos los votos a favor"
        );
        votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));
        console.log(
          "[DEBUG][VotacionAplicacionResultadosController] Votos generados para unanimidad:",
          votos.length
        );
      } else {
        // ✅ Si es sometida a votos, usar los votos del usuario
        votos = item.votos.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          valor: v.valor,
        }));

        // Validar que haya votos
        if (votos.length === 0) {
          throw new Error("Debe registrar al menos un voto para votación por mayoría");
        }
        console.log(
          "[DEBUG][VotacionAplicacionResultadosController] Es sometida a votos - usando votos del usuario:",
          votos.length
        );
      }

      // Si ya existe en backend, actualizar
      if (votacionStore.hasVotacion) {
        console.log(
          "[DEBUG][VotacionAplicacionResultadosController] Actualizando votación existente"
        );
        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          itemId,
          label,
          descripcion,
          tipoAprobacion,
          votos
        );
      } else {
        // Si no existe, crear nueva
        console.log("[DEBUG][VotacionAplicacionResultadosController] Creando nueva votación");
        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          itemId,
          label,
          descripcion,
          tipoAprobacion
        );

        // Si hay votos, agregarlos después de crear
        if (votos.length > 0) {
          for (const voto of votos) {
            await votacionStore.addVote(
              societyId.value,
              flowId.value,
              voto.accionistaId,
              voto.valor as VoteValue
            );
          }
        }
      }

      console.log(
        "[DEBUG][VotacionAplicacionResultadosController] Votación guardada exitosamente"
      );
    } catch (error: any) {
      console.error(
        "[Controller][VotacionAplicacionResultados] Error al guardar votación:",
        error
      );
      error.value = error.message || "Error al guardar votación";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar datos al activar (cuando se navega de vuelta)
  onActivated(() => {
    loadData();
  });

  return {
    // Estados
    isLoading,
    error,

    // Datos
    votantes,
    textoVotacion,

    // Métodos
    getVoto: getVoto, // ✅ Pasar el computed directamente
    setVoto,
    cambiarTipo,
    guardarVotacion,
    loadData,
  };
}
