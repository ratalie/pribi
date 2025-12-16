import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import type { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Controller para la vista de Votación de Nombramiento de Apoderados
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Filtrado de votantes (asistentes con acciones con derecho a voto)
 * - Generación de preguntas hardcodeadas (una por apoderado nombrado)
 * - Manejo de votos en memoria local por pregunta (solo visual, no guarda en backend)
 */

/**
 * ⚠️ DATOS MOCK - Temporal hasta que tengamos el endpoint
 * TODO: Reemplazar con GET que obtenga los apoderados nombrados
 */
interface ApoderadoParaNombrar {
  id: string;
  nombre: string;
  puesto: string; // Clase de apoderado (ej: "Apoderado Especial", "Apoderado Judicial")
}

const APODERADOS_MOCK: ApoderadoParaNombrar[] = [
  {
    id: "mock-1",
    nombre: "Luis Martínez Torres",
    puesto: "Apoderado Especial",
  },
  {
    id: "mock-2",
    nombre: "Ana Fernández Sánchez",
    puesto: "Apoderado Judicial",
  },
  {
    id: "mock-3",
    nombre: "Carlos Vargas Ramírez",
    puesto: "Apoderado Comercial",
  },
];

export function useVotacionNombramientoApoderadosController() {
  const route = useRoute();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado local para votos por pregunta (solo visual, no se guarda en backend)
  // Estructura: Map<`${preguntaIndex}-${accionistaId}`, VoteValue>
  const votos = ref<Map<string, VoteValue>>(new Map());
  const tipoAprobacion = ref<"unanimidad" | "mayoria">("unanimidad");
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
      console.log("[DEBUG][VotacionNombramientoApoderadosController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionNombramientoApoderadosController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );
    } catch (err: any) {
      console.error(
        "[Controller][VotacionNombramientoApoderados] Error al cargar datos:",
        err
      );
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
   * Mapper: Calcular votantes desde snapshot + asistencias
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][VotacionNombramientoApoderadosController] No hay snapshot disponible para mapear votantes"
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
   * Generar preguntas de votación para cada apoderado nombrado
   * Formato: "Se aprueba el nombramiento del apoderado [nombre] en sus funciones como [puesto]"
   */
  const preguntas = computed(() => {
    return APODERADOS_MOCK.map(
      (apoderado) =>
        `Se aprueba el nombramiento del apoderado ${apoderado.nombre} en sus funciones como ${apoderado.puesto}.`
    );
  });

  /**
   * Mensaje de aprobación
   */
  const mensajeAprobacion = computed(() => {
    return "el nombramiento de los apoderados seleccionados.";
  });

  /**
   * Obtener voto de un accionista para una pregunta específica
   */
  function getVoto(preguntaIndex: number, accionistaId: string): VoteValue | null {
    const key = `${preguntaIndex}-${accionistaId}`;
    return votos.value.get(key) || null;
  }

  /**
   * Establecer voto de un accionista para una pregunta específica
   */
  function setVoto(preguntaIndex: number, accionistaId: string, valor: VoteValue) {
    const key = `${preguntaIndex}-${accionistaId}`;
    votos.value.set(key, valor);
    console.log("[DEBUG][VotacionNombramientoApoderadosController] Voto establecido:", {
      preguntaIndex,
      accionistaId,
      valor,
      key,
    });
  }

  /**
   * Cambiar tipo de aprobación (unanimidad/mayoría)
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    tipoAprobacion.value = tipo;
    console.log(
      "[DEBUG][VotacionNombramientoApoderadosController] Tipo de aprobación cambiado:",
      tipo
    );
  }

  /**
   * Guardar votación (función vacía - solo visual, no guarda en backend)
   */
  async function guardarVotacion() {
    console.log(
      "[DEBUG][VotacionNombramientoApoderadosController] guardarVotacion() ejecutado - Solo visual, no se guarda en backend"
    );
    console.log("[DEBUG][VotacionNombramientoApoderadosController] Estado actual:", {
      tipoAprobacion: tipoAprobacion.value,
      preguntasCount: preguntas.value.length,
      votosCount: votos.value.size,
      votos: Array.from(votos.value.entries()),
    });
    // No hace nada, solo para cumplir con useJuntasFlowNext
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    if (!snapshotStore.snapshot) {
      loadData();
    }
  });

  return {
    // Estado
    votantes,
    preguntas,
    mensajeAprobacion,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Métodos
    getVoto,
    setVoto,
    cambiarTipoAprobacion,
    guardarVotacion,
    loadData,
  };
}
