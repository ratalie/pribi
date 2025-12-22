import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useDirectoryConfigurationStore } from "../../stores/useDirectoryConfigurationStore";
import { useVotacionCantidadStore } from "../stores/useVotacionCantidadStore";

/**
 * Controller para la vista de Votación de Configuración de Directorio (Cantidad)
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot, configuración de directorio)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionCantidadController() {
  const route = useRoute();
  const votacionStore = useVotacionCantidadStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();
  const directoryConfigStore = useDirectoryConfigurationStore();

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

      // 2. Cargar configuración de directorio
      try {
        await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal - se debe configurar primero
        if (error?.statusCode !== 404 && error?.status !== 404) {
          console.error(
            "[Controller][VotacionCantidad] Error al cargar configuración:",
            error
          );
        }
      }

      // 3. Cargar asistentes (para obtener votantes - solo los que asistieron)
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      // 4. Cargar votación existente (NO crear automáticamente)
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionCantidadController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          label: votacionStore.itemVotacion?.label,
          tipoAprobacion: votacionStore.itemVotacion?.tipoAprobacion,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
          votos: votacionStore.itemVotacion?.votos.map((v) => ({
            id: v.id,
            accionistaId: v.accionistaId,
            valor: v.valor,
          })),
        });
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionCantidadController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[Controller][VotacionCantidad] Error al cargar votación:", error);
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionCantidadController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        hasItem: !!votacionStore.itemVotacion,
        votantesCount: votantes.value.length,
        votantes: votantes.value.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          nombreCompleto: v.nombreCompleto,
        })),
      });
    } catch (error: any) {
      console.error("[Controller][VotacionCantidad] Error al cargar datos:", error);
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

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
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return "";
  }

  /**
   * Mapper: Calcular votantes desde snapshot + asistencias
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    const accionistasConAcciones = shareholders.map((accionista) => {
      const asignaciones = shareAllocations.filter(
        (asig) => asig.accionistaId === accionista.id
      );

      let totalAccionesConDerechoVoto = 0;

      asignaciones.forEach((asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
        if (shareClass && shareClass.conDerechoVoto) {
          totalAccionesConDerechoVoto += asig.cantidadSuscrita;
        }
      });

      return {
        accionista,
        totalAccionesConDerechoVoto,
      };
    });

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
   */
  const votantes = computed(() => {
    const votantesMapeados = mapearVotantesDesdeSnapshot();
    console.log(
      "[DEBUG][VotacionCantidadController] Votantes mapeados desde snapshot:",
      votantesMapeados.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        nombreCompleto: v.nombreCompleto,
        accionesConDerechoVoto: v.accionesConDerechoVoto,
      }))
    );
    return votantesMapeados;
  });

  /**
   * Obtener cantidad de directores configurada
   */
  const cantidadDirectores = computed(() => {
    return directoryConfigStore.configuration?.cantidadDirectores || 0;
  });

  /**
   * Obtener texto de votación
   */
  const textoVotacion = computed(() => {
    if (votacionStore.itemVotacion) {
      return votacionStore.itemVotacion.label;
    }
    // Texto por defecto basado en la cantidad de directores
    const cantidad = cantidadDirectores.value;
    return `¿Se aprueba que el Directorio esté conformado por ${cantidad} directores?`;
  });

  /**
   * Obtener voto de un accionista
   */
  const getVoto = computed(() => {
    return (accionistaId: string): VoteValue | null => {
      const voto = votacionStore.getVotoByAccionista(accionistaId);
      if (!voto) return null;
      return voto.valor as VoteValue;
    };
  });

  /**
   * Establecer voto de un accionista (SOLO actualiza estado local)
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.CONFIGURACION_DIRECTORIO,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: `Votación para aprobar la configuración del directorio con ${cantidadDirectores.value} directores`,
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [],
          },
        ],
      };
    }

    votacionStore.setVoto(accionistaId, valor);
  }

  /**
   * Cambiar tipo de votación (unanimidad/mayoría)
   */
  async function cambiarTipo(tipo: "unanimidad" | "mayoria") {
    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    votacionStore.setTipoAprobacion(tipoAprobacion);
  }

  /**
   * Guardar votación (crear o actualizar)
   * Se llama cuando el usuario hace click en "Siguiente"
   */
  async function guardarVotacion() {
    try {
      isLoading.value = true;
      error.value = null;

      if (!directoryConfigStore.configuration) {
        throw new Error(
          "Debe configurar la cantidad de directores antes de realizar la votación"
        );
      }

      const cantidad = cantidadDirectores.value;
      const itemId = votacionStore.itemVotacion?.id || votacionStore.generateUuid();
      const label = `¿Se aprueba que el Directorio esté conformado por ${cantidad} directores?`;
      const descripcion = `Votación para aprobar la configuración del directorio con ${cantidad} directores`;

      // ✅ Asegurar que hay sesión en memoria
      if (!votacionStore.sesionVotacion) {
        const sessionId = votacionStore.generateUuid();
        votacionStore.sesionVotacion = {
          id: sessionId,
          contexto: VoteContext.CONFIGURACION_DIRECTORIO,
          modo: VoteMode.SIMPLE,
          items: [
            {
              id: itemId,
              orden: 0,
              label,
              descripción: descripcion,
              tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
              votos: [],
            },
          ],
        };
      } else {
        // Asegurar que el contexto de la sesión existente sea correcto
        if (votacionStore.sesionVotacion.contexto !== VoteContext.CONFIGURACION_DIRECTORIO) {
          votacionStore.sesionVotacion.contexto = VoteContext.CONFIGURACION_DIRECTORIO;
        }

        // Asegurar que hay item
        if (!votacionStore.itemVotacion) {
          votacionStore.sesionVotacion.items.push({
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [],
          });
        } else {
          // Actualizar label y descripción del item existente
          const item = votacionStore.itemVotacion;
          item.label = label;
          item.descripción = descripcion;
        }
      }

      const item = votacionStore.itemVotacion;
      if (!item) {
        throw new Error("No se pudo crear el item de votación");
      }

      // ✅ Preparar votos para enviar
      let votos: Array<{ id: string; accionistaId: string; valor: string | number }>;

      const tipoAprobacion = item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;

      // ✅ Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));
      } else {
        // ✅ Si es mayoría, usar los votos que el usuario ingresó
        votos = item.votos.map((voto) => ({
          id: voto.id,
          accionistaId: voto.accionistaId,
          valor: voto.valor,
        }));
      }

      // Actualizar votos en el item antes de guardar
      item.votos = votos.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        valor: v.valor as VoteValue | number,
      }));

      if (votacionStore.hasVotacion) {
        // Actualizar votación existente
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
        // Crear nueva votación
        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          itemId,
          label,
          descripcion,
          tipoAprobacion
        );

        // Si hay votos y es sometida a votación, agregarlos después de crear
        if (votos.length > 0 && tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION) {
          for (const voto of votos) {
            await votacionStore.addVote(
              societyId.value,
              flowId.value,
              voto.accionistaId,
              voto.valor as VoteValue
            );
          }
        }
        // Para unanimidad, los votos ya están incluidos en el item antes de crear
      }
    } catch (error: any) {
      console.error("[Controller][VotacionCantidad] Error al guardar:", error);
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
    getVoto,
    cantidadDirectores,

    // Acciones
    cambiarTipo,
    setVoto,
    guardarVotacion,
  };
}



