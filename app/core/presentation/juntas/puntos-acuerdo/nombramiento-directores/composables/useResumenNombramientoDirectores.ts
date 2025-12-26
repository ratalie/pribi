import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  TipoAcuerdo,
  getTipoAcuerdo,
} from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useDirectoryConfigurationStore } from "../stores/useDirectoryConfigurationStore";
import { useNombramientoDirectoresStore } from "../stores/useNombramientoDirectoresStore";
import { useVotacionDirectoresStore } from "../votacion/stores/useVotacionDirectoresStore";

/**
 * Composable para el resumen de nombramiento de directores
 *
 * Calcula:
 * - Directores antes/después del nombramiento (solo titulares)
 * - Directores propuestos y elegidos
 * - Datos del directorio (duración, fechas)
 * - Resultado de la votación (porcentajes, tipo) - calculado manualmente para modo CUMULATIVO
 * - Lista de directores elegidos con datos completos
 */
export function useResumenNombramientoDirectores() {
  const route = useRoute();
  const nombramientoStore = useNombramientoDirectoresStore();
  const votacionStore = useVotacionDirectoresStore();
  const directoryConfigStore = useDirectoryConfigurationStore();
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

      // Cargar configuración de directorio
      try {
        await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal - se usará snapshot
        if (error.statusCode !== 404 && error.status !== 404) {
          console.error("Error al cargar configuración:", error);
        }
      }

      // Cargar directores designados
      await nombramientoStore.loadDirectoresDesignados(societyId.value, flowId.value);

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
   * Directores titulares ANTES del nombramiento (desde snapshot)
   */
  const directoresAntes = computed(() => {
    const directores = snapshotStore.directores || [];
    return directores.filter((d) => d.rolDirector === "TITULAR");
  });

  const cantidadDirectoresAntes = computed(() => {
    return directoresAntes.value.length;
  });

  /**
   * Directores propuestos (candidatos marcados como TITULAR)
   */
  const directoresPropuestos = computed(() => {
    return nombramientoStore.directoresDesignados.filter(
      (d) => d.isCandidate === true && d.directorRole === "TITULAR"
    );
  });

  const cantidadDirectoresPropuestos = computed(() => {
    return directoresPropuestos.value.length;
  });

  /**
   * Calcular cupos disponibles para directores
   * Cupos = Tamaño del Directorio - Directores Actuales (del snapshot que no fueron removidos)
   */
  const cuposDisponibles = computed(() => {
    const tamañoDirectorio =
      directoryConfigStore.configuration?.cantidadDirectores ||
      snapshotStore.snapshot?.directory?.cantidadDirectores ||
      0;
    const directoresActuales = nombramientoStore.directoresDisponiblesDelSnapshot.filter(
      (d) => d.directorRole === "TITULAR"
    ).length;
    const cupos = tamañoDirectorio - directoresActuales;
    return Math.max(0, cupos); // No permitir valores negativos
  });

  /**
   * Calcular elegidos basándonos en la votación (si está disponible)
   * 
   * Para unanimidad: todos los items con tipoAprobacion === APROBADO_POR_TODOS son elegidos
   * Para mayoría: ordena por total de votos y toma los top N según cupos disponibles
   */
  function calcularElegidosDesdeVotacion(): string[] {
    if (!votacionStore.hasVotacion || votacionStore.itemsVotacion.length === 0) {
      return [];
    }

    // Verificar si es unanimidad (todos los items tienen tipoAprobacion === APROBADO_POR_TODOS)
    const esUnanimidad = votacionStore.itemsVotacion.every(
      (item) => item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS
    );

    if (esUnanimidad) {
      // En unanimidad, todos los items son elegidos
      return votacionStore.itemsVotacion
        .map((item) => item.personaId || "")
        .filter((id) => id !== "");
    }

    // Para mayoría acumulativa: sumar votos por candidato
    const votosPorCandidato = votacionStore.itemsVotacion.map((item) => {
      const totalVotos = item.votos.reduce(
        (sum, voto) => sum + (typeof voto.valor === "number" ? voto.valor : Number(voto.valor) || 0),
        0
      );
      return {
        personaId: item.personaId || "",
        totalVotos,
      };
    });

    // Ordenar por total de votos descendente
    const sorted = votosPorCandidato.sort((a, b) => b.totalVotos - a.totalVotos);

    // Seleccionar top N según cupos disponibles
    const cantidad = cuposDisponibles.value;
    const elegidosIds = sorted.slice(0, cantidad).map((e) => e.personaId);

    return elegidosIds;
  }

  /**
   * Directores elegidos (aprobados en votación)
   * 
   * Prioridad 1: Usar designationStatus === "ELEGIDO" si está disponible
   * Prioridad 2: Si no hay resultados y hay votación, calcular desde la votación
   */
  const directoresElegidos = computed(() => {
    // Primero intentar usar designationStatus
    const elegidosPorStatus = nombramientoStore.directoresDesignados.filter(
      (d) => d.designationStatus === "ELEGIDO" && d.directorRole === "TITULAR"
    );

    // Si hay resultados con designationStatus, usarlos
    if (elegidosPorStatus.length > 0) {
      return elegidosPorStatus;
    }

    // Si no hay resultados y hay votación guardada, calcular desde la votación
    if (votacionStore.hasVotacion && votacionStore.itemsVotacion.length > 0) {
      const elegidosPersonaIds = calcularElegidosDesdeVotacion();
      
      return nombramientoStore.directoresDesignados.filter(
        (d) =>
          d.directorRole === "TITULAR" &&
          d.isCandidate === true &&
          d.person.id &&
          elegidosPersonaIds.includes(d.person.id)
      );
    }

    return [];
  });

  const cantidadDirectoresElegidos = computed(() => {
    return directoresElegidos.value.length;
  });

  /**
   * Directores titulares DESPUÉS del nombramiento
   * = Directores antes + Directores elegidos
   */
  const cantidadDirectoresDespues = computed(() => {
    return cantidadDirectoresAntes.value + cantidadDirectoresElegidos.value;
  });

  /**
   * Datos del directorio
   */
  const directorio = computed(() => {
    // Prioridad: directoryConfigStore, fallback a snapshot
    const config = directoryConfigStore.configuration;
    const snapshotDir = snapshotStore.directorio;

    return config || snapshotDir;
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
    const periodo =
      directoryConfigStore.configuration?.periodo || snapshotStore.directorio?.periodo;
    return formatearPeriodo(periodo || undefined);
  });

  const fechaInicioDirectorio = computed(() => {
    const fecha =
      directoryConfigStore.configuration?.inicioMandato ||
      snapshotStore.directorio?.inicioMandato;
    if (!fecha) return "N/A";
    // Formatear fecha como DD/MM/YYYY
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, "0");
    const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  });

  const fechaFinDirectorio = computed(() => {
    const fecha =
      directoryConfigStore.configuration?.finMandato || snapshotStore.directorio?.finMandato;
    if (!fecha) return "N/A";
    // Formatear fecha como DD/MM/YYYY
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, "0");
    const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  });

  /**
   * Calcular resultado de votación para modo CUMULATIVO
   * En nombramiento, los votos son numéricos (cantidad de votos asignados)
   */
  function calcularResultadoPorItem(itemIndex: number) {
    if (!votacionStore.hasVotacion || votacionStore.itemsVotacion.length === 0) {
      return null;
    }

    const item = votacionStore.itemsVotacion[itemIndex];
    if (!item) return null;

    const snapshot = snapshotStore.snapshot;
    if (!snapshot) return null;

    // Obtener accionistas con derecho a voto
    const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;

    // Calcular total de votos asignados a este candidato (suma de valores numéricos)
    const totalVotosAsignados = item.votos.reduce(
      (sum, voto) => sum + (typeof voto.valor === "number" ? voto.valor : Number(voto.valor) || 0),
      0
    );

    // Calcular total de acciones con derecho a voto
    const totalAccionesConDerechoVoto = accionistasConDerechoVoto.reduce(
      (sum, acc) => sum + acc.totalAcciones,
      0
    );

    // Para modo CUMULATIVO, el porcentaje se calcula sobre el total de votos posibles
    // (cada accionista puede votar con todas sus acciones)
    const porcentajeVotos = totalAccionesConDerechoVoto > 0
      ? (totalVotosAsignados / totalAccionesConDerechoVoto) * 100
      : 0;

    // Determinar tipo de acuerdo
    const tipoAcuerdo = getTipoAcuerdo("nombramiento-directores");

    // Obtener quorum mínimo requerido
    const quorums = snapshotStore.quorums;
    const quorumMinimoRequerido =
      tipoAcuerdo === TipoAcuerdo.CALIFICADO
        ? quorums?.mayoriasAcuerdosCalificado || 60
        : quorums?.mayoriasAcuerdosSimple || 50;

    // Calcular acciones que votaron (accionistas que tienen al menos un voto)
    const accionistasIdsQueVotaron = new Set(item.votos.map((v) => v.accionistaId));
    const accionesVotantes = accionistasConDerechoVoto
      .filter((acc) => accionistasIdsQueVotaron.has(acc.shareholder.id))
      .reduce((sum, acc) => sum + acc.totalAcciones, 0);

    const porcentajeParticipacion =
      totalAccionesConDerechoVoto > 0
        ? (accionesVotantes / totalAccionesConDerechoVoto) * 100
        : 0;

    // Para modo CUMULATIVO, no hay "a favor/en contra", solo total de votos
    // El porcentaje de votos asignados indica el apoyo
    const porcentajeAFavor = porcentajeVotos;
    const porcentajeEnContra = 0; // No aplica en modo acumulativo
    const porcentajeAbstencion = 0; // No aplica en modo acumulativo

    // Determinar si fue aprobado (basándose en si está en la lista de elegidos)
    const candidato = nombramientoStore.directoresDesignados.find(
      (d) => d.person.id === item.personaId
    );
    const aprobado = candidato?.designationStatus === "ELEGIDO" || false;

    return {
      tipoAcuerdo,
      quorumMinimoRequerido,
      totalAccionesConDerechoVoto,
      accionesVotantes,
      porcentajeVotantes: porcentajeParticipacion,
      totalVotosAsignados,
      porcentajeAFavor,
      porcentajeEnContra,
      porcentajeAbstencion,
      aprobado,
      totalVotantes: item.votos.length,
      totalAccionistas: accionistasConDerechoVoto.length,
    };
  }

  /**
   * Resultado de la votación por item (cada director tiene su propio resultado)
   */
  const resultadosPorItem = computed(() => {
    if (!votacionStore.hasVotacion || votacionStore.itemsVotacion.length === 0) {
      return [];
    }

    return votacionStore.itemsVotacion.map((item, index) => {
      const resultado = calcularResultadoPorItem(index);

      // Extraer nombre del director y rol desde los candidatos usando personaId
      let nombreDirector = item.label || "";
      let rolDirector = "TITULAR";

      // Buscar en los candidatos por personaId para obtener el rol correcto
      if (item.personaId) {
        const candidato = nombramientoStore.directoresDesignados.find(
          (d) => d.person.id === item.personaId
        );
        if (candidato) {
          // Si no hay label o el label está vacío, construir nombre desde candidato
          if (!nombreDirector && candidato.person) {
            nombreDirector = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
              candidato.person.apellidoMaterno || ""
            }`.trim();
          }
          rolDirector = candidato.directorRole || "TITULAR";
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
    }).filter((r): r is NonNullable<typeof r> => r !== null && r.resultado !== null);
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
    if (!votacionStore.hasVotacion || votacionStore.itemsVotacion.length === 0) {
      return false;
    }
    // Si TODOS los items tienen tipoAprobacion: APROBADO_POR_TODOS → es unanimidad
    return votacionStore.itemsVotacion.every(
      (item) => item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS
    );
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
   * Porcentaje de votos favorables (para unanimidad, es 100%)
   */
  const porcentajeVotosFavorables = computed(() => {
    if (esUnanimidad.value) {
      return 100; // En unanimidad, todos votaron a favor
    }
    const resultado = resultadoVotacion.value;
    if (!resultado) return 0;
    return Math.round(resultado.porcentajeAFavor);
  });

  /**
   * Verificar si fue aprobado
   */
  const fueAprobado = computed(() => {
    // Si hay directores elegidos, la votación fue aprobada
    return cantidadDirectoresElegidos.value > 0;
  });

  /**
   * Datos de directores elegidos para la tabla
   */
  const datosDirectoresElegidos = computed(() => {
    return directoresElegidos.value.map((director) => {
      const persona = director.person;
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
        tipoDirector: director.directorRole,
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
    cantidadDirectoresPropuestos,
    cantidadDirectoresElegidos,
    datosDirectoresElegidos,

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

