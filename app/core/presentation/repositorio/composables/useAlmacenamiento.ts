import { computed, onMounted } from 'vue';
import { useAlmacenamientoStore } from '../stores/almacenamiento.store';
import { useRepositorioDashboardStore } from '../stores/repositorio-dashboard.store';
import type { CreateCarpetaDTO, UploadDocumentoDTO } from '~/core/hexag/repositorio/almacenamiento/application/dtos/documento-societario.dto';

/**
 * Composable para Almacenamiento
 * Gestiona el ciclo de vida y expone la lógica del store
 */
export function useAlmacenamiento() {
  const store = useAlmacenamientoStore();
  const dashboardStore = useRepositorioDashboardStore();

  // Obtener sociedadId del dashboard store
  const sociedadId = computed(() => dashboardStore.sociedadSeleccionada?.id || null);

  // Cargar documentos al montar si hay sociedad seleccionada
  onMounted(async () => {
    if (sociedadId.value && store.documentos.length === 0) {
      await store.cargarDocumentos(null, sociedadId.value);
    }
  });

  // Computed para facilitar el acceso
  const documentos = computed(() => store.documentos);
  const documentoActual = computed(() => store.documentoActual);
  const carpetaActual = computed(() => store.carpetaActual);
  const breadcrumb = computed(() => store.breadcrumb);
  const vista = computed({
    get: () => store.vista,
    set: (value: 'grid' | 'list') => store.setVista(value),
  });

  // Estados
  const isLoading = computed(() => store.isLoading);
  const isUploading = computed(() => store.isUploading);
  const hasError = computed(() => store.hasError);
  const errorMessage = computed(() => store.errorMessage);

  // Getters
  const carpetas = computed(() => store.carpetas);
  const archivos = computed(() => store.archivos);

  // Métodos
  const cargarDocumentos = async (parentId: string | null = null) => {
    if (sociedadId.value) {
      await store.cargarDocumentos(parentId, sociedadId.value);
    }
  };

  const navegarACarpeta = async (carpetaId: string) => {
    if (sociedadId.value) {
      await store.navegarACarpeta(carpetaId, sociedadId.value);
    }
  };

  const navegarAtras = async () => {
    if (sociedadId.value) {
      await store.navegarAtras(sociedadId.value);
    }
  };

  const obtenerDocumento = async (documentoId: string) => {
    if (sociedadId.value) {
      return await store.obtenerDocumento(documentoId, sociedadId.value);
    }
    return null;
  };

  const crearCarpeta = async (dto: CreateCarpetaDTO) => {
    if (sociedadId.value) {
      return await store.crearCarpeta(dto, sociedadId.value);
    }
    return null;
  };

  const subirDocumento = async (dto: UploadDocumentoDTO) => {
    if (sociedadId.value) {
      return await store.subirDocumento(dto, sociedadId.value);
    }
    return null;
  };

  const descargarDocumento = async (documentoId: string) => {
    if (sociedadId.value) {
      await store.descargarDocumento(documentoId, sociedadId.value);
    }
  };

  const eliminarDocumento = async (documentoId: string) => {
    if (sociedadId.value) {
      await store.eliminarDocumento(documentoId, sociedadId.value);
    }
  };

  const limpiarDocumentoActual = () => {
    store.limpiarDocumentoActual();
  };

  return {
    // Estado
    documentos,
    documentoActual,
    carpetaActual,
    breadcrumb,
    vista,
    isLoading,
    isUploading,
    hasError,
    errorMessage,
    carpetas,
    archivos,

    // Métodos
    cargarDocumentos,
    navegarACarpeta,
    navegarAtras,
    obtenerDocumento,
    crearCarpeta,
    subirDocumento,
    descargarDocumento,
    eliminarDocumento,
    limpiarDocumentoActual,
  };
}

