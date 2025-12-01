import { computed, onMounted } from 'vue';
import { useDocumentosGeneradosStore } from '../stores/documentos-generados.store';
import { useRepositorioDashboardStore } from '../stores/repositorio-dashboard.store';

/**
 * Composable para Documentos Generados
 * Gestiona el ciclo de vida y expone la lógica del store
 */
export function useDocumentosGenerados() {
  const store = useDocumentosGeneradosStore();
  const dashboardStore = useRepositorioDashboardStore();

  // Obtener sociedadId del dashboard store
  const sociedadId = computed(() => dashboardStore.sociedadSeleccionada?.id || null);

  // Cargar documentos al montar si hay sociedad seleccionada
  onMounted(async () => {
    if (sociedadId.value && !store.documentosGenerados) {
      await store.cargarDocumentosGenerados(sociedadId.value);
    }
  });

  // Computed para facilitar el acceso
  const documentosGenerados = computed(() => store.documentosGenerados);
  const documentoActual = computed(() => store.documentoActual);

  // Estados
  const isLoading = computed(() => store.isLoading);
  const hasError = computed(() => store.hasError);
  const errorMessage = computed(() => store.errorMessage);
  const hasData = computed(() => store.hasData);

  // Métodos
  const cargarDocumentosGenerados = async () => {
    if (sociedadId.value) {
      await store.cargarDocumentosGenerados(sociedadId.value);
    }
  };

  const obtenerDocumento = async (documentoId: string) => {
    if (sociedadId.value) {
      return await store.obtenerDocumento(documentoId, sociedadId.value);
    }
    return null;
  };

  const limpiarDocumentoActual = () => {
    store.limpiarDocumentoActual();
  };

  return {
    // Estado
    documentosGenerados,
    documentoActual,
    isLoading,
    hasError,
    errorMessage,
    hasData,

    // Métodos
    cargarDocumentosGenerados,
    obtenerDocumento,
    limpiarDocumentoActual,
  };
}

