import { computed, onMounted } from 'vue';
import { useCarpetasPersonalizadasStore } from '../stores/carpetas-personalizadas.store';
import { useRepositorioDashboardStore } from '../stores/repositorio-dashboard.store';
import type { CreateCarpetaDTO } from '~/core/hexag/repositorio/carpetas-personalizadas/application/dtos/carpeta-personalizada.dto';
import type { CreateEnlaceDTO } from '~/core/hexag/repositorio/carpetas-personalizadas/application/dtos/enlace-documento.dto';

/**
 * Composable para Carpetas Personalizadas
 * Gestiona el ciclo de vida y expone la lógica del store
 */
export function useCarpetasPersonalizadas() {
  const store = useCarpetasPersonalizadasStore();
  const dashboardStore = useRepositorioDashboardStore();

  // Obtener sociedadId del dashboard store
  const sociedadId = computed(() => dashboardStore.sociedadSeleccionada?.id || null);

  // Cargar carpetas al montar si hay sociedad seleccionada
  onMounted(async () => {
    if (sociedadId.value && store.carpetas.length === 0) {
      await store.cargarCarpetas(sociedadId.value);
    }
  });

  // Computed para facilitar el acceso
  const carpetas = computed(() => store.carpetas);
  const carpetaActual = computed(() => store.carpetaActual);
  const enlacesActuales = computed(() => store.enlacesActuales);

  // Estados
  const isLoading = computed(() => store.isLoading);
  const isSaving = computed(() => store.isSaving);
  const hasError = computed(() => store.hasError);
  const errorMessage = computed(() => store.errorMessage);
  const totalCarpetas = computed(() => store.totalCarpetas);

  // Métodos
  const cargarCarpetas = async () => {
    if (sociedadId.value) {
      await store.cargarCarpetas(sociedadId.value);
    }
  };

  const cargarDetalleCarpeta = async (carpetaId: string) => {
    if (sociedadId.value) {
      await store.cargarDetalleCarpeta(carpetaId, sociedadId.value);
    }
  };

  const crearCarpeta = async (dto: CreateCarpetaDTO) => {
    if (sociedadId.value) {
      return await store.crearCarpeta(dto, sociedadId.value);
    }
    return null;
  };

  const actualizarCarpeta = async (carpetaId: string, dto: CreateCarpetaDTO) => {
    if (sociedadId.value) {
      return await store.actualizarCarpeta(carpetaId, dto, sociedadId.value);
    }
    return null;
  };

  const eliminarCarpeta = async (carpetaId: string) => {
    if (sociedadId.value) {
      await store.eliminarCarpeta(carpetaId, sociedadId.value);
    }
  };

  const agregarEnlace = async (dto: CreateEnlaceDTO) => {
    if (sociedadId.value) {
      return await store.agregarEnlace(dto, sociedadId.value);
    }
    return null;
  };

  const eliminarEnlace = async (enlaceId: string) => {
    if (sociedadId.value) {
      await store.eliminarEnlace(enlaceId, sociedadId.value);
    }
  };

  const limpiarCarpetaActual = () => {
    store.limpiarCarpetaActual();
  };

  return {
    // Estado
    carpetas,
    carpetaActual,
    enlacesActuales,
    isLoading,
    isSaving,
    hasError,
    errorMessage,
    totalCarpetas,

    // Métodos
    cargarCarpetas,
    cargarDetalleCarpeta,
    crearCarpeta,
    actualizarCarpeta,
    eliminarCarpeta,
    agregarEnlace,
    eliminarEnlace,
    limpiarCarpetaActual,
  };
}

