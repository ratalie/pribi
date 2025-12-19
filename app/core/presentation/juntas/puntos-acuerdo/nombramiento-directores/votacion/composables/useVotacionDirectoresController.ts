import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";
import { useDirectoryConfigurationStore } from "../../stores/useDirectoryConfigurationStore";
import { useNombramientoDirectoresStore } from "../../stores/useNombramientoDirectoresStore";
import { useVotacionDirectoresStore } from "../stores/useVotacionDirectoresStore";

/**
 * Controller para la vista de Votación Acumulativa de Directores
 *
 * Orquesta:
 * - Carga de datos (candidatos, accionistas, votación existente)
 * - Conversión de formatos (local → backend)
 * - Guardado de votación completa
 * - Cálculo de elegidos y marcado de estados
 */
export function useVotacionDirectoresController() {
  const route = useRoute();
  const votacionStore = useVotacionDirectoresStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();
  const directoryConfigStore = useDirectoryConfigurationStore();
  const nombramientoStore = useNombramientoDirectoresStore();
  const directoresStore = useDirectoresStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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
   * (Reutilizado de useVotacionCantidadController)
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
          accionistaId: item.accionista.id, // ✅ ShareholderV2.id
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

      // 2. Cargar configuración de directorio (para obtener cantidadDirectores)
      try {
        await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal - se usará snapshot
        if (error?.statusCode !== 404 && error?.status !== 404) {
          console.error(
            "[Controller][VotacionDirectores] Error al cargar configuración:",
            error
          );
        }
      }

      // 3. Cargar directores designados (para obtener candidatos)
      await nombramientoStore.loadDirectoresDesignados(societyId.value, flowId.value);

      // 4. Cargar asistentes (para obtener votantes - solo los que asistieron)
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      // 5. Cargar votación existente (NO crear automáticamente)
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionDirectoresController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          itemsCount: votacionStore.itemsVotacion.length,
          items: votacionStore.itemsVotacion.map((item) => ({
            id: item.id,
            label: item.label,
            personaId: item.personaId,
            votosCount: item.votos.length,
          })),
        });

        // ✅ Si hay votación existente, convertir votos del formato backend al formato local
        if (votacionStore.hasVotacion && votacionStore.itemsVotacion.length > 0) {
          convertirVotosBackendALocal();
        }
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionDirectoresController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[Controller][VotacionDirectores] Error al cargar votación:", error);
        }
      }

      console.log("[DEBUG][VotacionDirectoresController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        candidatosCount: candidatos.value.length,
        votantesCount: votantes.value.length,
      });
    } catch (error: any) {
      console.error("[Controller][VotacionDirectores] Error al cargar datos:", error);
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtener candidatos (directores titulares con isCandidate: true)
   */
  const candidatos = computed(() => {
    return nombramientoStore.directoresTitularesCandidatos;
  });

  /**
   * Obtener votantes (accionistas que asistieron con sus acciones)
   */
  const votantes = computed(() => {
    return mapearVotantesDesdeSnapshot();
  });

  /**
   * Obtener cantidad de directores (prioridad a directoryConfigStore, fallback a snapshot)
   */
  const cantidadDirectores = computed(() => {
    // 1. Prioridad: Si se configuró en cantidad.vue
    if (directoryConfigStore.configuration?.cantidadDirectores) {
      return directoryConfigStore.configuration.cantidadDirectores;
    }

    // 2. Fallback: Snapshot (valor original de la sociedad)
    return snapshotStore.snapshot?.directory?.cantidadDirectores || 0;
  });

  /**
   * Convertir votos del formato backend (VoteItem[]) al formato local (useDirectoresStore)
   * (para cargar votación existente)
   */
  function convertirVotosBackendALocal() {
    const items = votacionStore.itemsVotacion;
    const votantesArray = votantes.value;
    const candidatosArray = candidatos.value;

    // Crear mapa de personaId → candidato (para mapear items a candidatos)
    const candidatosPorPersonaId = new Map(candidatosArray.map((c) => [c.person.id || "", c]));

    // Crear mapa de accionistaId → índice (para mapear accionistaId a índice)
    const indicePorAccionistaId = new Map(
      votantesArray.map((v, idx) => [v.accionistaId, idx])
    );

    // Convertir items del backend a formato local
    const votosAsignados: Array<{
      candidatoNombreCompleto: string;
      accionistaIndex: number;
      cantidad: number;
    }> = [];

    items.forEach((item) => {
      if (!item.personaId) return;

      const candidato = candidatosPorPersonaId.get(item.personaId);
      if (!candidato) return;

      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      // Convertir cada voto del item
      item.votos.forEach((voto) => {
        const accionistaIndex = indicePorAccionistaId.get(voto.accionistaId);
        if (accionistaIndex === undefined) return;

        const cantidad = typeof voto.valor === "number" ? voto.valor : 0;

        votosAsignados.push({
          candidatoNombreCompleto: nombreCompleto,
          accionistaIndex,
          cantidad,
        });
      });
    });

    // Actualizar useDirectoresStore con los votos cargados
    directoresStore.setVotosAsignados(votosAsignados);
  }

  /**
   * Convertir votos del formato local (useDirectoresStore) al formato backend (VoteItem[])
   *
   * Formato local:
   * Array<{ candidatoNombreCompleto: string; accionistaIndex: number; cantidad: number }>
   *
   * Formato backend:
   * VoteItem[] donde cada item tiene votos: VoteEntry[]
   */
  function convertirVotosLocalABackend(
    votosAsignados: Array<{
      candidatoNombreCompleto: string;
      accionistaIndex: number;
      cantidad: number;
    }>,
    votantesArray: typeof votantes.value,
    candidatosArray: typeof candidatos.value
  ): VoteItem[] {
    // Agrupar votos por candidato
    const votosPorCandidato = new Map<string, VoteEntry[]>();

    candidatosArray.forEach((candidato) => {
      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      // Buscar votos de este candidato
      const votosDelCandidato = votosAsignados.filter(
        (v) => v.candidatoNombreCompleto === nombreCompleto
      );

      // Convertir a VoteEntry[]
      const votosBackend: VoteEntry[] = votosDelCandidato
        .map((votoLocal) => {
          const votante = votantesArray[votoLocal.accionistaIndex];
          if (!votante) return null;

          return {
            id: votacionStore.generateUuid(),
            accionistaId: votante.accionistaId, // ✅ ShareholderV2.id
            valor: votoLocal.cantidad, // ✅ NÚMERO (no string)
          };
        })
        .filter((v): v is VoteEntry => v !== null);

      votosPorCandidato.set(nombreCompleto, votosBackend);
    });

    // Construir VoteItem[] (uno por cada candidato)
    const items: VoteItem[] = candidatosArray.map((candidato, index) => {
      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      // Obtener personaId del candidato (necesario para mapear después)
      // El backend devuelve person.id en DesignationDirectorResponseDTO
      const personaId = candidato.person?.id || undefined;

      // Si hay votación existente, intentar usar el itemId existente
      const itemExistente = personaId ? votacionStore.getItemByPersonaId(personaId) : null;

      return {
        id: itemExistente?.id || votacionStore.generateUuid(),
        orden: index,
        label: nombreCompleto,
        descripcion: "Candidato a director titular",
        personaId: personaId, // ✅ PersonV2.id del candidato
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
        votos: votosPorCandidato.get(nombreCompleto) || [],
      };
    });

    return items;
  }

  /**
   * Calcular quiénes fueron elegidos (top N según cantidadDirectores)
   */
  function calcularElegidos(
    items: VoteItem[]
  ): Array<{ itemId: string; directorId: string; totalVotos: number }> {
    // Sumar votos por candidato (suma de todos los accionistas)
    const votosPorCandidato = items.map((item) => {
      const totalVotos = item.votos.reduce(
        (sum, voto) => sum + (typeof voto.valor === "number" ? voto.valor : 0),
        0
      );
      return {
        itemId: item.id,
        directorId: "", // Se obtendrá después
        personaId: item.personaId || "",
        totalVotos,
      };
    });

    // Ordenar por total de votos descendente
    const sorted = votosPorCandidato.sort((a, b) => b.totalVotos - a.totalVotos);

    // Seleccionar top N (donde N = cantidadDirectores)
    const cantidad = cantidadDirectores.value;
    const elegidos = sorted.slice(0, cantidad);

    // Mapear personaId → directorId usando candidatos
    return elegidos.map((elegido) => {
      // Buscar candidato que tenga el mismo person.id
      const candidato = candidatos.value.find((c) => c.person.id === elegido.personaId);
      return {
        itemId: elegido.itemId,
        directorId: candidato?.id || "", // ✅ ID del DirectorFlowAction (DesignationDirectorResponseDTO.id)
        totalVotos: elegido.totalVotos,
      };
    });
  }

  /**
   * Guardar votación completa
   */
  async function guardarVotacion(
    votosAsignados: Array<{
      candidatoNombreCompleto: string;
      accionistaIndex: number;
      cantidad: number;
    }>
  ) {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Convertir votos del formato local al formato backend
      const items = convertirVotosLocalABackend(
        votosAsignados,
        votantes.value,
        candidatos.value
      );

      // 2. Guardar votación en backend (create o update según corresponda)
      await votacionStore.guardarVotacion(societyId.value, flowId.value, items);

      // 3. Calcular elegidos
      const elegidos = calcularElegidos(items);

      // 4. Marcar estados (ELEGIDO/NO_ELEGIDO)
      const elegidosIds = new Set(elegidos.map((e) => e.directorId));

      for (const candidato of candidatos.value) {
        const estado = elegidosIds.has(candidato.id)
          ? ("ELEGIDO" as const)
          : ("NO_ELEGIDO" as const);

        await nombramientoStore.updateEstadoDirector(
          societyId.value,
          flowId.value,
          candidato.id, // designationId (ID del DirectorFlowAction)
          estado
        );
      }

      console.log("[Controller][VotacionDirectores] Votación guardada exitosamente:", {
        itemsCount: items.length,
        elegidosCount: elegidos.length,
        elegidos: elegidos.map((e) => ({
          directorId: e.directorId,
          totalVotos: e.totalVotos,
        })),
      });
    } catch (error: any) {
      console.error("[Controller][VotacionDirectores] Error al guardar votación:", error);
      error.value = error.message || "Error al guardar votación";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // Estados
    isLoading,
    error,

    // Funciones
    loadData,
    guardarVotacion,

    // Computed
    candidatos,
    votantes,
    cantidadDirectores,
  };
}

