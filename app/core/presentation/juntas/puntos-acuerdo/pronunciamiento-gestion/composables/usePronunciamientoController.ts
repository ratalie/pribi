import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { usePronunciamientoStore } from "../stores/usePronunciamientoStore";
import type { FileMetadata } from "../stores/usePronunciamientoStore";
import { GuardarFinancialReportDocumentUseCase } from "~/core/hexag/juntas/application/use-cases/guardar-financial-report-document.use-case";
import { ObtenerFinancialReportDocumentUseCase } from "~/core/hexag/juntas/application/use-cases/obtener-financial-report-document.use-case";
import { FinancialReportDocumentHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/financial-report-document-http.repository";
import type {
  CreateFinancialReportDocumentRequestDTO,
  UpdateFinancialReportDocumentRequestDTO,
  FinancialReportDocumentResponseDTO,
} from "~/core/hexag/juntas/application/dtos/financial-report-document.dto";

/**
 * Helper para generar UUID (compatible con navegador y Node.js)
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para entornos sin crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Controller para Pronunciamiento y Gestión Social
 * 
 * Gestiona:
 * - Carga de datos desde backend
 * - Guardado de datos al backend
 * - Sincronización entre store y backend
 */
export function usePronunciamientoController() {
  const route = useRoute();
  const store = usePronunciamientoStore();

  // Repositorio y casos de uso
  const repository = new FinancialReportDocumentHttpRepository();
  const guardarUseCase = new GuardarFinancialReportDocumentUseCase(repository);
  const obtenerUseCase = new ObtenerFinancialReportDocumentUseCase(repository);

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
   * Mapear FileMetadata del store a archivoId (string)
   */
  const mapFileMetadataToArchivoId = (metadata: FileMetadata[]): string[] => {
    return metadata.map((m) => m.archivoId);
  };

  /**
   * Mapear respuesta del backend al store
   */
  const mapResponseToStore = (response: FinancialReportDocumentResponseDTO) => {
    // Memoria Anual
    if (response.reporteAnualArchivoIds && response.reporteAnualArchivoIds.length > 0) {
      store.memoriaAnual.enabled = true;
      store.memoriaAnual.archivos = response.reporteAnualArchivoIds.map((archivo) => ({
        archivoId: archivo.archivoId,
        tipoMino: archivo.tipoMime,
        nombreOriginal: archivo.nombreOriginal,
        tamaño: archivo.tamaño,
        version: archivo.version,
      }));
    }

    // Estados Financieros
    if (response.estadosFinancieros && response.estadosFinancieros.length > 0) {
      // Mapear estados financieros del backend
      response.estadosFinancieros.forEach((estadoBackend) => {
        // Buscar si ya existe en el store (por nombre o ID)
        let estadoStore = store.estadosFinancieros.find(
          (e) => e.nombre === estadoBackend.label || e.id === estadoBackend.id
        );

        if (!estadoStore) {
          // Si no existe, crear uno nuevo
          store.addEstadoFinanciero(estadoBackend.label);
          estadoStore = store.estadosFinancieros[store.estadosFinancieros.length - 1];
          // Asignar el ID del backend
          estadoStore.id = estadoBackend.id;
        }

        // Actualizar estado
        estadoStore.enabled = true;
        estadoStore.archivos = estadoBackend.archivoIds.map((archivo) => ({
          archivoId: archivo.archivoId,
          tipoMino: archivo.tipoMime,
          nombreOriginal: archivo.nombreOriginal,
          tamaño: archivo.tamaño,
          version: archivo.version,
        }));
      });
    }
  };

  /**
   * Mapear store a DTO para guardar
   * Genera el DTO correcto según si es CREATE o UPDATE
   */
  const mapStoreToDTO = async (): Promise<CreateFinancialReportDocumentRequestDTO | UpdateFinancialReportDocumentRequestDTO> => {
    // Memoria Anual
    const reporteAnualArchivoIds = store.memoriaAnual.enabled
      ? mapFileMetadataToArchivoId(store.memoriaAnual.archivos)
      : undefined;

    // Verificar si ya existe un reporte financiero
    let existente: FinancialReportDocumentResponseDTO | null = null;
    try {
      if (societyId.value && flowId.value) {
        existente = await obtenerUseCase.ejecutar(societyId.value, flowId.value);
      }
    } catch (error) {
      // Si no existe (404), existente será null
      console.debug("ℹ️ [PronunciamientoController] No hay reporte existente, se creará uno nuevo");
    }

    // Si existe, generar DTO de UPDATE con acciones
    if (existente) {
      const estadosFinancierosUpdate: UpdateFinancialReportDocumentRequestDTO["estadosFinancieros"] = [];

      // Obtener estados existentes del backend (con sus IDs)
      const estadosExistentesBackend = existente.estadosFinancieros || [];
      
      // Estados del store que están habilitados y tienen archivos
      const estadosStoreHabilitados = store.estadosFinancieros.filter(
        (estado) => estado.enabled && estado.archivos.length > 0
      );

      // Comparar estados del store con los del backend
      for (const estadoStore of estadosStoreHabilitados) {
        // Buscar si existe en el backend (por ID o por nombre)
        const estadoBackend = estadosExistentesBackend.find(
          (eb) => eb.id === estadoStore.id || eb.label === estadoStore.nombre
        );

        if (estadoBackend) {
          // Existe en el backend: UPDATE
          estadosFinancierosUpdate.push({
            id: estadoBackend.id, // Usar el ID del backend
            accion: "update",
            label: estadoStore.nombre,
            archivoIds: mapFileMetadataToArchivoId(estadoStore.archivos),
          });
        } else {
          // No existe en el backend: ADD (generar nuevo UUID)
          const nuevoId = generateUUID();
          estadosFinancierosUpdate.push({
            id: nuevoId,
            accion: "add",
            label: estadoStore.nombre,
            archivoIds: mapFileMetadataToArchivoId(estadoStore.archivos),
          });
        }
      }

      // Estados que existen en el backend pero no están en el store (habilitados): DELETE
      for (const estadoBackend of estadosExistentesBackend) {
        const existeEnStore = estadosStoreHabilitados.some(
          (es) => es.id === estadoBackend.id || es.nombre === estadoBackend.label
        );
        
        if (!existeEnStore) {
          // Existe en backend pero no en store: DELETE
          estadosFinancierosUpdate.push({
            id: estadoBackend.id,
            accion: "delete",
            label: estadoBackend.label, // Puede ser opcional, pero lo incluimos por seguridad
            archivoIds: [], // No necesario para delete, pero lo incluimos vacío
          });
        }
      }

      return {
        reporteAnualArchivoIds,
        estadosFinancieros: estadosFinancierosUpdate,
      } as UpdateFinancialReportDocumentRequestDTO;
    } else {
      // No existe: generar DTO de CREATE (sin acciones)
      const estadosFinancieros = store.estadosFinancieros
        .filter((estado) => estado.enabled && estado.archivos.length > 0)
        .map((estado) => ({
          label: estado.nombre,
          archivoIds: mapFileMetadataToArchivoId(estado.archivos),
        }));

      return {
        reporteAnualArchivoIds,
        estadosFinancieros,
      } as CreateFinancialReportDocumentRequestDTO;
    }
  };

  /**
   * Cargar datos desde el backend
   */
  const cargarDatos = async () => {
    if (!societyId.value || !flowId.value) {
      console.warn("⚠️ [PronunciamientoController] societyId o flowId no disponible");
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await obtenerUseCase.ejecutar(societyId.value, flowId.value);

      if (response) {
        mapResponseToStore(response);
      }
    } catch (err: any) {
      console.error("🔴 [PronunciamientoController] Error al cargar datos:", err);
      error.value = err?.message || "Error al cargar los datos";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Guardar datos al backend
   */
  const guardarDatos = async () => {
    if (!societyId.value || !flowId.value) {
      console.warn("⚠️ [PronunciamientoController] societyId o flowId no disponible");
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const dto = await mapStoreToDTO();
      console.log("📤 [PronunciamientoController] DTO generado:", JSON.stringify(dto, null, 2));
      await guardarUseCase.ejecutar(societyId.value, flowId.value, dto);
    } catch (err: any) {
      console.error("🔴 [PronunciamientoController] Error al guardar datos:", err);
      error.value = err?.message || "Error al guardar los datos";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Estados
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Métodos
    cargarDatos,
    guardarDatos,
  };
}

