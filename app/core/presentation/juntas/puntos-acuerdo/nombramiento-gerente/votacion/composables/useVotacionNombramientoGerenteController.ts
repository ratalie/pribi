import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type {
  PersonaJuridica,
  PersonaNatural,
  Shareholder,
} from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import type { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
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
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado local para votos (solo visual, no se guarda en backend)
  const votos = ref<Map<string, VoteValue>>(new Map()); // accionistaId -> voto
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
      console.log("[DEBUG][VotacionNombramientoGerenteController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionNombramientoGerenteController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );
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
   * Obtener voto de un accionista
   */
  function getVoto(accionistaId: string): VoteValue | null {
    return votos.value.get(accionistaId) || null;
  }

  /**
   * Establecer voto de un accionista
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    votos.value.set(accionistaId, valor);
    console.log("[DEBUG][VotacionNombramientoGerenteController] Voto establecido:", {
      accionistaId,
      valor,
    });
  }

  /**
   * Cambiar tipo de aprobación (unanimidad/mayoría)
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    tipoAprobacion.value = tipo;
    console.log(
      "[DEBUG][VotacionNombramientoGerenteController] Tipo de aprobación cambiado:",
      tipo
    );
  }

  /**
   * Guardar votación (función vacía - solo visual, no guarda en backend)
   */
  async function guardarVotacion() {
    console.log(
      "[DEBUG][VotacionNombramientoGerenteController] guardarVotacion() ejecutado - Solo visual, no se guarda en backend"
    );
    console.log("[DEBUG][VotacionNombramientoGerenteController] Estado actual:", {
      tipoAprobacion: tipoAprobacion.value,
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
    pregunta,
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
