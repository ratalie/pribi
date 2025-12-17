import { computed, onActivated, onMounted } from "vue";
import { useRoute } from "vue-router";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";
import { useAcreedoresStore } from "../../acreedores/stores/useAcreedoresStore";
import { useCapitalizacionesStore } from "../../creditos/stores/useCapitalizacionesStore";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";

/**
 * Controller para la vista de Votación de Capitalización de Créditos
 *
 * Orquesta:
 * - Carga de datos (asistentes, acreedores, capitalizaciones)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionCapitalizacionController() {
  const route = useRoute();
  const votacionStore = useVotacionStore();
  const acreedoresStore = useAcreedoresStore();
  const capitalizacionesStore = useCapitalizacionesStore();
  const asistenciaStore = useAsistenciaStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const isLoading = computed(() => votacionStore.status === "loading");
  const error = computed(() => votacionStore.errorMessage);
  const sesionVotacion = computed(() => votacionStore.sesionVotacion);

  /**
   * Cargar datos necesarios para la votación
   */
  async function loadData() {
    try {
      console.log("[VotacionCapitalizacionController] Cargando datos...");

      // Cargar asistentes
      await asistenciaStore.get(societyId.value, flowId.value);

      // Cargar acreedores
      await acreedoresStore.loadAcreedores(societyId.value, flowId.value);

      // Cargar capitalizaciones
      await capitalizacionesStore.loadCapitalizaciones(societyId.value, flowId.value);

      // Cargar sesión de votación
      await votacionStore.loadVotacion(
        societyId.value,
        flowId.value,
        VoteContext.CAPITALIZACION_DE_CREDITOS
      );

      console.log("[VotacionCapitalizacionController] Datos cargados exitosamente");
    } catch (error: any) {
      console.error("[VotacionCapitalizacionController] Error al cargar datos:", error);
      throw error;
    }
  }

  /**
   * Generar texto de la pregunta de votación
   */
  const preguntaVotacion = computed(() => {
    const capitalizaciones = capitalizacionesStore.capitalizaciones;
    const acreedores = acreedoresStore.acreedores;

    if (capitalizaciones.length === 0) {
      return "¿Se aprueba la capitalización de créditos propuesta?";
    }

    // Construir texto descriptivo basado en las capitalizaciones
    const totalCapitalizar = capitalizaciones.reduce(
      (sum, c) => sum + c.totalToCapitalize,
      0
    );
    const primeraCapitalizacion = capitalizaciones[0];
    const moneda = primeraCapitalizacion.currency;

    return `¿Se aprueba la capitalización de créditos por ${moneda} ${totalCapitalizar.toLocaleString()}, mediante la emisión de ${capitalizaciones.reduce((sum, c) => sum + c.sharesToReceive, 0)} acciones nuevas?`;
  });

  /**
   * Guardar votación
   */
  async function guardarVotacion() {
    try {
      console.log("[VotacionCapitalizacionController] Guardando votación...");

      if (!sesionVotacion.value) {
        throw new Error("No hay sesión de votación para guardar");
      }

      await votacionStore.saveVotacion(
        societyId.value,
        flowId.value,
        VoteContext.CAPITALIZACION_DE_CREDITOS
      );

      console.log("[VotacionCapitalizacionController] Votación guardada exitosamente");
    } catch (error: any) {
      console.error("[VotacionCapitalizacionController] Error al guardar votación:", error);
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
    sesionVotacion,
    preguntaVotacion,
    guardarVotacion,
    loadData,
  };
}

