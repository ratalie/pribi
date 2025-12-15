import { onMounted, onActivated, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useVotacionPronunciamientoStore } from "../stores/useVotacionPronunciamientoStore";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";

/**
 * Controller para la vista de Votación de Pronunciamiento de Gestión Social
 * 
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionPronunciamientoController() {
  const route = useRoute();
  const votacionStore = useVotacionPronunciamientoStore();
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
      console.log("[DEBUG][VotacionPronunciamientoController] Cargando asistentes...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log("[DEBUG][VotacionPronunciamientoController] Asistentes cargados:", asistenciaStore.asistencias);
      console.log("[DEBUG][VotacionPronunciamientoController] Asistentes que asistieron:", 
        asistenciaStore.asistencias.filter(a => a.asistio)
      );

      // 3. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionPronunciamientoController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
        });
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log("[DEBUG][VotacionPronunciamientoController] No hay votación existente (404), se creará al guardar");
        } else {
          console.error("[Controller][VotacionPronunciamiento] Error al cargar votación:", error);
        }
      }
      
      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionPronunciamientoController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        hasItem: !!votacionStore.itemVotacion,
        votantesCount: votantes.value.length,
      });
    } catch (error: any) {
      console.error("[Controller][VotacionPronunciamiento] Error al cargar datos:", error);
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
    
    console.log("[DEBUG][VotacionPronunciamientoController] Votantes filtrados:", filtrados);
    
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
    // Texto por defecto para pronunciamiento
    return "¿Se aprueba la memoria, los estados financieros y la gestión social presentados en la junta?";
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
      console.log("[DEBUG][VotacionPronunciamientoController] Creando sesión en memoria al votar (no guardada todavía)");
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;
      
      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.GESTION_SOCIAL,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la aprobación de la memoria, los estados financieros y la gestión social presentados en la junta",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log("[DEBUG][VotacionPronunciamientoController] Creando item en memoria al votar (no guardado todavía)");
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;
      
      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de la memoria, los estados financieros y la gestión social presentados en la junta",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[Controller][VotacionPronunciamiento] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      // Actualizar voto existente en estado local
      votoExistente.valor = valor as string | number;
      console.log("[DEBUG][VotacionPronunciamientoController] Voto actualizado en memoria:", {
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
      console.log("[DEBUG][VotacionPronunciamientoController] Voto agregado en memoria:", {
        accionistaId,
        valor,
        voteId,
      });
    }
  }

  /**
   * Cambiar tipo de votación (unanimidad/mayoría)
   */
  async function cambiarTipo(tipo: "unanimidad" | "mayoria") {
    if (!votacionStore.itemVotacion) {
      console.warn("[Controller][VotacionPronunciamiento] No hay item de votación para cambiar tipo");
      return;
    }

    const tipoAprobacion = tipo === "unanimidad"
      ? VoteAgreementType.APROBADO_POR_TODOS
      : VoteAgreementType.SOMETIDO_A_VOTACION;

    // Si cambia a unanimidad, limpiar votos (no se necesitan)
    if (tipo === "unanimidad") {
      votacionStore.itemVotacion.votos = [];
    }

    // Actualizar tipo de aprobación en memoria
    votacionStore.itemVotacion.tipoAprobacion = tipoAprobacion;

    console.log("[DEBUG][VotacionPronunciamientoController] Tipo de votación cambiado:", {
      tipo,
      tipoAprobacion,
    });
  }

  /**
   * Guardar votación (crear o actualizar)
   * Se llama cuando el usuario hace click en "Siguiente"
   */
  async function guardarVotacion() {
    try {
      isLoading.value = true;
      error.value = null;

      if (!votacionStore.sesionVotacion || !votacionStore.itemVotacion) {
        throw new Error("No hay sesión de votación para guardar");
      }

      const item = votacionStore.itemVotacion;
      const itemId = item.id;
      const label = item.label;
      const descripcion = item.descripción;
      const tipoAprobacion = item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;

      // Preparar votos para enviar
      const votos = item.votos.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        valor: v.valor,
      }));

      // Si ya existe en backend, actualizar
      if (votacionStore.hasVotacion) {
        console.log("[DEBUG][VotacionPronunciamientoController] Actualizando votación existente");
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
        console.log("[DEBUG][VotacionPronunciamientoController] Creando nueva votación");
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

      console.log("[DEBUG][VotacionPronunciamientoController] Votación guardada exitosamente");
    } catch (error: any) {
      console.error("[Controller][VotacionPronunciamiento] Error al guardar votación:", error);
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
    getVoto,
    setVoto,
    cambiarTipo,
    guardarVotacion,
    loadData,
  };
}


