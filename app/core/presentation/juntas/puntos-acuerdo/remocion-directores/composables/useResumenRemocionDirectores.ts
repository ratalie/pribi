import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { useRemocionDirectoresStore } from "../stores/useRemocionDirectoresStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionRemocionDirectoresStore } from "../votacion/stores/useVotacionRemocionDirectoresStore";

/**
 * Composable para el resumen de remoción de directores
 *
 * Calcula:
 * - Directores antes/después de la remoción
 * - Directores sujetos a remoción y removidos
 * - Datos del directorio (duración, fechas)
 * - Resultado de la votación (porcentajes, tipo)
 * - Lista de directores removidos con datos completos
 */
export function useResumenRemocionDirectores() {
  const route = useRoute();
  const remocionStore = useRemocionDirectoresStore();
  const votacionStore = useVotacionRemocionDirectoresStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  /**
   * Cargar datos necesarios
   */
  async function loadData() {
    try {
      // Cargar snapshot si no está cargado
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // Cargar directores (candidatos)
      await remocionStore.loadDirectores(societyId.value, flowId.value);

      // Cargar votación
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal
        if (error.statusCode !== 404 && error.status !== 404) {
          console.error("Error al cargar votación:", error);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del resumen:", error);
      throw error;
    }
  }

  /**
   * Directores titulares ANTES de la remoción (desde snapshot)
   */
  const directoresAntes = computed(() => {
    const directores = snapshotStore.directores || [];
    return directores.filter((d) => d.rolDirector === "TITULAR");
  });

  const cantidadDirectoresAntes = computed(() => {
    return directoresAntes.value.length;
  });

  /**
   * Directores sujetos a remoción (candidatos marcados como TITULAR)
   */
  const directoresSujetosRemocion = computed(() => {
    return remocionStore.candidatos.filter(
      (c) => c.isCandidate === true && c.rolDirector === "TITULAR"
    );
  });

  const cantidadDirectoresSujetosRemocion = computed(() => {
    return directoresSujetosRemocion.value.length;
  });

  /**
   * Directores removidos (aprobados en votación)
   * Son los que tienen isCandidate: true Y fueron aprobados (candidateStatus === "ELECTED" o isRemoved === true)
   */
  const directoresRemovidos = computed(() => {
    // Filtrar candidatos que fueron aprobados
    const candidatosAprobados = remocionStore.candidatos.filter((c) => {
      // Verificar si fue aprobado
      const fueAprobado =
        c.candidateStatus === "ELECTED" ||
        c.isRemoved === true ||
        c.removalStatus === "REMOVIDO";

      return c.isCandidate === true && fueAprobado;
    });

    return candidatosAprobados;
  });

  const cantidadDirectoresRemovidos = computed(() => {
    return directoresRemovidos.value.length;
  });

  /**
   * Directores titulares DESPUÉS de la remoción
   */
  const cantidadDirectoresDespues = computed(() => {
    return cantidadDirectoresAntes.value - cantidadDirectoresRemovidos.value;
  });

  /**
   * Datos del directorio
   */
  const directorio = computed(() => {
    return snapshotStore.directorio;
  });

  /**
   * Convertir periodo del directorio (enum) a formato legible
   */
  function formatearPeriodo(periodo?: string): string {
    if (!periodo) return "N/A";

    const periodosMap: Record<string, string> = {
      ONE_YEAR: "1 año",
      TWO_YEARS: "2 años",
      THREE_YEARS: "3 años",
      TRIENAL: "3 años",
      QUADRENNIAL: "4 años",
      FIVE_YEARS: "5 años",
      SIX_YEARS: "6 años",
    };

    return periodosMap[periodo] || periodo;
  }

  const duracionDirectorio = computed(() => {
    return formatearPeriodo(directorio.value?.periodo);
  });

  const fechaInicioDirectorio = computed(() => {
    if (!directorio.value?.inicioMandato) return "N/A";
    // Formatear fecha como DD/MM/YYYY
    const fecha = new Date(directorio.value.inicioMandato);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  });

  const fechaFinDirectorio = computed(() => {
    if (!directorio.value?.finMandato) return "N/A";
    // Formatear fecha como DD/MM/YYYY
    const fecha = new Date(directorio.value.finMandato);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  });

  /**
   * Resultado de la votación por item (cada director tiene su propio resultado)
   */
  const resultadosPorItem = computed(() => {
    if (!votacionStore.hasVotacion || votacionStore.items.length === 0) {
      return [];
    }

    return votacionStore.items.map((item, index) => {
      try {
        const resultado = votacionStore.getResult("remocion-directores", index);
        
        // Extraer nombre del director desde el label del item o desde los candidatos
        // El label tiene formato: "Se aprueba la remoción del director [NOMBRE] de sus funciones como [ROL]."
        let nombreDirector = "";
        let rolDirector = "TITULAR";
        
        // Intentar extraer del label
        const label = item.label || "";
        const match = label.match(/del director (.+?) de sus funciones como (.+?)\./);
        if (match) {
          nombreDirector = match[1]?.trim() || "";
          rolDirector = match[2]?.trim() || "TITULAR";
        } else {
          // Si no se puede extraer del label, usar los candidatos por índice
          const candidatosFiltrados = remocionStore.candidatos.filter(
            (c) => c.isCandidate === true && c.rolDirector === "TITULAR"
          );
          const candidato = candidatosFiltrados[index];
          if (candidato?.persona) {
            nombreDirector = `${candidato.persona.nombre} ${candidato.persona.apellidoPaterno} ${
              candidato.persona.apellidoMaterno || ""
            }`.trim();
            rolDirector = candidato.rolDirector || "TITULAR";
          }
        }

        return {
          itemIndex: index,
          itemId: item.id,
          resultado,
          nombreDirector,
          rolDirector,
          esUnanimidad: item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS,
        };
      } catch (error) {
        console.error(`Error al obtener resultado de votación para item ${index}:`, error);
        return null;
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null);
  });

  /**
   * Resultado de la votación (primer item - para compatibilidad con unanimidad)
   */
  const resultadoVotacion = computed(() => {
    const resultados = resultadosPorItem.value;
    return resultados.length > 0 ? resultados[0]?.resultado || null : null;
  });

  /**
   * Verificar si es unanimidad (para el primer item)
   */
  const esUnanimidad = computed(() => {
    const resultados = resultadosPorItem.value;
    return resultados.length > 0 ? resultados[0]?.esUnanimidad || false : false;
  });

  /**
   * Porcentaje de participación
   */
  const porcentajeParticipacion = computed(() => {
    const resultado = resultadoVotacion.value;
    if (!resultado) return 0;
    return Math.round(resultado.porcentajeVotantes);
  });

  /**
   * Porcentaje de votos favorables
   */
  const porcentajeVotosFavorables = computed(() => {
    const resultado = resultadoVotacion.value;
    if (!resultado) return 0;
    return Math.round(resultado.porcentajeAFavor);
  });

  /**
   * Verificar si fue aprobado
   */
  const fueAprobado = computed(() => {
    const resultado = resultadoVotacion.value;
    return resultado?.aprobado ?? false;
  });

  /**
   * Datos de directores removidos para la tabla
   */
  const datosDirectoresRemovidos = computed(() => {
    return directoresRemovidos.value.map((director) => {
      const persona = director.persona;
      let nombreRazonSocial = "";
      let tipoDocumento = "";
      let numeroDocumento = "";

      if (persona) {
        nombreRazonSocial = `${persona.nombre} ${persona.apellidoPaterno} ${
          persona.apellidoMaterno || ""
        }`.trim();
        tipoDocumento = persona.tipoDocumento;
        numeroDocumento = persona.numeroDocumento;
      }

      return {
        nombreRazonSocial,
        tipoDirector: director.rolDirector,
        tipoDocumento,
        numeroDocumento,
      };
    });
  });

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  return {
    // Datos de directores
    cantidadDirectoresAntes,
    cantidadDirectoresDespues,
    cantidadDirectoresSujetosRemocion,
    cantidadDirectoresRemovidos,
    datosDirectoresRemovidos,

    // Datos del directorio
    duracionDirectorio,
    fechaInicioDirectorio,
    fechaFinDirectorio,

    // Resultado de votación
    resultadoVotacion,
    resultadosPorItem, // ✅ Lista de resultados por cada director
    esUnanimidad,
    porcentajeParticipacion,
    porcentajeVotosFavorables,
    fueAprobado,

    // Métodos
    loadData,
  };
}

