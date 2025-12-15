import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import type { ExternalAuditorDTO } from "~/core/hexag/juntas/application/dtos/external-auditor.dto";
import { GetExternalAuditorUseCase } from "~/core/hexag/juntas/application/use-cases/get-external-auditor.use-case";
import { SaveExternalAuditorUseCase } from "~/core/hexag/juntas/application/use-cases/save-external-auditor.use-case";
import { ExternalAuditorMapper } from "~/core/hexag/juntas/infrastructure/mappers/external-auditor.mapper";
import { ExternalAuditorHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/external-auditor-http.repository";
import { useAuditoresExternosStore } from "../stores/useAuditoresExternosStore";

/**
 * Controller para Auditores Externos
 *
 * Gestiona:
 * - Carga de datos desde backend
 * - Guardado de datos al backend
 * - Sincronización entre store y backend
 */
export function useAuditoresExternosController() {
  const route = useRoute();
  const store = useAuditoresExternosStore();

  // Repositorio y casos de uso
  const repository = new ExternalAuditorHttpRepository();
  const guardarUseCase = new SaveExternalAuditorUseCase(repository);
  const obtenerUseCase = new GetExternalAuditorUseCase(repository);

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
  const mapDTOToStore = (dto: ExternalAuditorDTO) => {
    const entity = ExternalAuditorMapper.toEntity(dto);
    store.loadFromEntity(entity);
  };

  /**
   * Mapear store a DTO para enviar al backend
   */
  const mapStoreToDTO = (): ExternalAuditorDTO => {
    const entity = store.toEntity();
    return ExternalAuditorMapper.toDTO(entity);
  };

  /**
   * Cargar datos desde el backend
   */
  async function cargarDatos() {
    if (!societyId.value || !flowId.value) {
      console.warn("[Controller][AuditoresExternos] No hay societyId o flowId");
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = await obtenerUseCase.execute(societyId.value, flowId.value);

      if (dto) {
        mapDTOToStore(dto);
        console.log("[Controller][AuditoresExternos] Datos cargados exitosamente");
      } else {
        console.log("[Controller][AuditoresExternos] No hay datos existentes");
        // No hay datos, mantener valores por defecto del store
      }
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;

      // Si es 404, no existe (es normal)
      if (statusCode === 404) {
        console.log("[Controller][AuditoresExternos] No hay datos existentes (404)");
        error.value = null; // No es un error, simplemente no hay datos
      } else {
        const errorMessage =
          error?.data?.message ??
          error?.response?._data?.message ??
          error?.message ??
          "Error desconocido";
        console.error("[Controller][AuditoresExternos] Error al cargar:", errorMessage);
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

    // Validar que haya responsable seleccionado
    if (!store.responsableDesignacion) {
      throw new Error("Debe seleccionar un responsable de la designación");
    }

    // Validar que si es JUNTA_DE_ACCIONISTAS, haya nombre del auditor
    if (
      store.responsableDesignacion === "JUNTA_DE_ACCIONISTAS" &&
      !store.nombreCompletoAuditor.trim()
    ) {
      throw new Error("Debe ingresar el nombre completo del auditor externo");
    }

    try {
      isLoading.value = true;
      error.value = null;

      const dto = mapStoreToDTO();
      await guardarUseCase.execute(societyId.value, flowId.value, dto);

      console.log("[Controller][AuditoresExternos] Datos guardados exitosamente");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Controller][AuditoresExternos] Error al guardar:", errorMessage);
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

