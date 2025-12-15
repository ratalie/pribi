import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAplicacionResultadosStore } from "../stores/useAplicacionResultadosStore";
import { SaveApplicationOfResultsUseCase } from "~/core/hexag/juntas/application/use-cases/save-application-of-results.use-case";
import { GetApplicationOfResultsUseCase } from "~/core/hexag/juntas/application/use-cases/get-application-of-results.use-case";
import { ApplicationOfResultsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/application-of-results-http.repository";
import { ApplicationOfResultsMapper } from "~/core/hexag/juntas/infrastructure/mappers/application-of-results.mapper";
import type { ApplicationOfResultsDTO } from "~/core/hexag/juntas/application/dtos/application-of-results.dto";

/**
 * Controller para Aplicación de Resultados
 * 
 * Gestiona:
 * - Carga de datos desde backend
 * - Guardado de datos al backend
 * - Sincronización entre store y backend
 */
export function useAplicacionResultadosController() {
  const route = useRoute();
  const store = useAplicacionResultadosStore();

  // Repositorio y casos de uso
  const repository = new ApplicationOfResultsHttpRepository();
  const guardarUseCase = new SaveApplicationOfResultsUseCase(repository);
  const obtenerUseCase = new GetApplicationOfResultsUseCase(repository);

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Obtener IDs de la ruta
  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return parseInt(param, 10);
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return parseInt(param[0], 10);
    }
    return null;
  });

  const flowId = computed(() => {
    const param = route.params.flowId;
    if (typeof param === "string") return parseInt(param, 10);
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return parseInt(param[0], 10);
    }
    return null;
  });

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
    if (!societyId.value || !flowId.value) {
      console.warn("[Controller][AplicacionResultados] No hay societyId o flowId");
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = await obtenerUseCase.execute(societyId.value, flowId.value);

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
    if (!societyId.value || !flowId.value) {
      throw new Error("No hay societyId o flowId");
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = mapStoreToDTO();
      await guardarUseCase.execute(societyId.value, flowId.value, dto);

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

  return {
    // Estados
    isLoading,
    error,

    // Store
    store,

    // Métodos
    cargarDatos,
    guardarDatos,
  };
}

