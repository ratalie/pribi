import { ref, computed } from "vue";
import { useAplicacionResultadosStore } from "../stores/useAplicacionResultadosStore";
import { SaveApplicationOfResultsUseCase } from "~/core/hexag/juntas/application/use-cases/save-application-of-results.use-case";
import { GetApplicationOfResultsUseCase } from "~/core/hexag/juntas/application/use-cases/get-application-of-results.use-case";
import { ApplicationOfResultsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/application-of-results-http.repository";
import { ApplicationOfResultsMapper } from "~/core/hexag/juntas/infrastructure/mappers/application-of-results.mapper";
import type { ApplicationOfResultsDTO } from "~/core/hexag/juntas/application/dtos/application-of-results.dto";
import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";

/**
 * Controller para Aplicación de Resultados
 * 
 * Gestiona:
 * - Carga de datos desde backend
 * - Guardado de datos al backend
 * - Sincronización entre store y backend
 */
export function useAplicacionResultadosController() {
  const store = useAplicacionResultadosStore();

  // Obtener IDs de la ruta (compartido)
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Repositorio y casos de uso
  const repository = new ApplicationOfResultsHttpRepository();
  const guardarUseCase = new SaveApplicationOfResultsUseCase(repository);
  const obtenerUseCase = new GetApplicationOfResultsUseCase(repository);

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Mapear DTO del backend a Entity y cargar en store
   */
  const mapDTOToStore = (dto: ApplicationOfResultsDTO) => {
    const entity = ApplicationOfResultsMapper.toEntity(dto);
    store.loadFromEntity(entity);
  };

  /**
   * Mapear store a DTO para enviar al backend
   */
  const mapStoreToDTO = (): ApplicationOfResultsDTO => {
    const entity = store.toEntity();
    return ApplicationOfResultsMapper.toDTO(entity);
  };

  /**
   * Cargar datos desde el backend
   */
  async function cargarDatos() {
    if (!societyId.value || !flowIdNumber.value) {
      console.warn("[Controller][AplicacionResultados] No hay societyId o flowId");
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = await obtenerUseCase.execute(societyId.value, flowIdNumber.value);

      if (dto) {
        mapDTOToStore(dto);
        console.log("[Controller][AplicacionResultados] Datos cargados exitosamente");
      } else {
        console.log("[Controller][AplicacionResultados] No hay datos existentes");
        // No hay datos, mantener valores por defecto del store
      }
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      
      // Si es 404, no existe (es normal)
      if (statusCode === 404) {
        console.log("[Controller][AplicacionResultados] No hay datos existentes (404)");
        error.value = null; // No es un error, simplemente no hay datos
      } else {
        const errorMessage = error?.data?.message ?? error?.response?._data?.message ?? error?.message ?? "Error desconocido";
        console.error("[Controller][AplicacionResultados] Error al cargar:", errorMessage);
        error.value = errorMessage;
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Guardar datos al backend
   */
  async function guardarDatos() {
    if (!societyId.value || !flowIdNumber.value) {
      throw new Error("No hay societyId o flowId");
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = mapStoreToDTO();
      await guardarUseCase.execute(societyId.value, flowIdNumber.value, dto);

      console.log("[Controller][AplicacionResultados] Datos guardados exitosamente");
    } catch (error: any) {
      const errorMessage = error?.data?.message ?? error?.response?._data?.message ?? error?.message ?? "Error desconocido";
      console.error("[Controller][AplicacionResultados] Error al guardar:", errorMessage);
      error.value = errorMessage;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Handler completo para el botón "Siguiente"
   * Incluye validación de IDs y guardado
   */
  const handleNext = async (societyIdValue: number | null, flowIdValue: number | null): Promise<void> => {
    // Validar IDs
    if (!societyIdValue || !flowIdValue) {
      throw new Error("No se pudo identificar la sociedad o la junta. Por favor, recarga la página.");
    }

    // Guardar
    await guardarDatos();
  };

  return {
    // Estados
    isLoading,
    error,

    // Store
    store,

    // Métodos
    cargarDatos,
    guardarDatos,
    handleNext,
  };
}


