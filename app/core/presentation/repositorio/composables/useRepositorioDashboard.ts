import { computed, onMounted } from 'vue';
import { useRepositorioDashboardStore } from '../stores/repositorio-dashboard.store';

/**
 * Composable para el Dashboard del Repositorio
 * Gestiona el ciclo de vida y expone la lógica del store
 */
export function useRepositorioDashboard() {
  const store = useRepositorioDashboardStore();

  // Cargar datos al montar
  onMounted(async () => {
    if (store.sociedades.length === 0) {
      await store.cargarSociedades();
    }
  });

  // Computed para facilitar el acceso
  const stats = computed(() => store.stats);
  const sociedades = computed(() => store.sociedades);
  const sociedadSeleccionada = computed(() => store.sociedadSeleccionada);
  const resultadosBusqueda = computed(() => store.resultadosBusqueda);
  const queryBusqueda = computed({
    get: () => store.queryBusqueda,
    set: (value: string) => {
      store.queryBusqueda = value;
    },
  });

  // Estados
  const isLoading = computed(() => store.isLoading);
  const hasError = computed(() => store.hasError);
  const errorMessage = computed(() => store.errorMessage);

  // Métricas calculadas
  const totalDocumentos = computed(() => store.totalDocumentos);
  const espacioUsado = computed(() => store.espacioUsado);
  const espacioTotal = computed(() => store.espacioTotal);
  const porcentajeEspacio = computed(() => store.porcentajeEspacio);

  // Métodos
  const seleccionarSociedad = async (sociedad: typeof store.sociedadSeleccionada) => {
    if (sociedad) {
      await store.seleccionarSociedad(sociedad);
    }
  };

  const buscar = async (query: string) => {
    await store.buscar(query);
  };

  const limpiarBusqueda = () => {
    store.limpiarBusqueda();
  };

  const recargar = async () => {
    await store.cargarSociedades();
  };

  return {
    // Estado
    stats,
    sociedades,
    sociedadSeleccionada,
    resultadosBusqueda,
    queryBusqueda,
    isLoading,
    hasError,
    errorMessage,

    // Métricas
    totalDocumentos,
    espacioUsado,
    espacioTotal,
    porcentajeEspacio,

    // Métodos
    seleccionarSociedad,
    buscar,
    limpiarBusqueda,
    recargar,
  };
}

