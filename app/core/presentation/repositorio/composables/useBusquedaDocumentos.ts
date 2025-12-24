import { ref, computed } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { useToast } from "~/components/ui/toast/use-toast";

/**
 * Interfaz para un resultado de búsqueda
 */
export interface SearchResult {
  versionCode: string;
  documentCode: string;
  title: string;
  sizeInBytes: number;
  createdAt: string;
  proximity?: number; // Solo en búsqueda semántica
  node?: {
    id: number;
    code: string;
    name: string;
    path: string;
    type: number; // 0 = Document, 1 = Folder
  };
}

/**
 * Interfaz para paginación
 */
export interface SearchPagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Composable para realizar búsquedas de documentos
 */
export function useBusquedaDocumentos() {
  const repository = new RepositorioDocumentosHttpRepository();
  const { toast } = useToast();

  const resultados = ref<SearchResult[]>([]);
  const pagination = ref<SearchPagination | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchId = ref<string | null>(null); // Para búsqueda semántica

  /**
   * Búsqueda semántica usando embeddings de IA
   */
  const buscarSemantica = async (
    structureId: string,
    query: string,
    filters?: {
      page?: number;
      limit?: number;
      scopedFolderNodeID?: number;
      mimeType?: string;
    }
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("🔍 [useBusquedaDocumentos] Búsqueda semántica:", {
        structureId,
        query,
        filters,
      });

      const result = await repository.busquedaSemantica(structureId, {
        semanticInput: query,
        searchID: searchId.value || undefined,
        filters: {
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          scopedFolderNodeID: filters?.scopedFolderNodeID,
          mimeType: filters?.mimeType,
        },
      });

      resultados.value = result.documents;
      pagination.value = result.pagination;
      searchId.value = result.searchId;

      console.log("✅ [useBusquedaDocumentos] Búsqueda semántica completada:", {
        resultados: resultados.value.length,
        pagination: pagination.value,
      });
    } catch (err: any) {
      console.error("❌ [useBusquedaDocumentos] Error en búsqueda semántica:", err);
      error.value = err.message || "No se pudo realizar la búsqueda semántica";
      resultados.value = [];
      pagination.value = null;

      toast({
        title: "Error en búsqueda semántica",
        description: error.value,
        variant: "destructive",
      });

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Búsqueda por coincidencia de texto en el título
   */
  const buscarPorCoincidencia = async (
    structureId: string,
    query: string,
    filters?: {
      page?: number;
      limit?: number;
      order?: "name" | "createdAt";
      sort?: "asc" | "desc";
      mimeType?: string;
      updatedFrom?: string;
      updatedTo?: string;
    }
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("🔍 [useBusquedaDocumentos] Búsqueda por coincidencia:", {
        structureId,
        query,
        filters,
      });

      const result = await repository.busquedaPorCoincidencia(structureId, {
        search: query,
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        order: filters?.order || "createdAt",
        sort: filters?.sort || "desc",
        mimeType: filters?.mimeType,
        updatedFrom: filters?.updatedFrom,
        updatedTo: filters?.updatedTo,
      });

      resultados.value = result.documents;
      pagination.value = result.pagination;

      console.log("✅ [useBusquedaDocumentos] Búsqueda por coincidencia completada:", {
        resultados: resultados.value.length,
        pagination: pagination.value,
      });
    } catch (err: any) {
      console.error("❌ [useBusquedaDocumentos] Error en búsqueda por coincidencia:", err);
      error.value = err.message || "No se pudo realizar la búsqueda por coincidencia";
      resultados.value = [];
      pagination.value = null;

      toast({
        title: "Error en búsqueda",
        description: error.value,
        variant: "destructive",
      });

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Limpia los resultados de búsqueda
   */
  const limpiar = () => {
    resultados.value = [];
    pagination.value = null;
    error.value = null;
    searchId.value = null;
  };

  return {
    // Estado
    resultados: computed(() => resultados.value),
    pagination: computed(() => pagination.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    searchId: computed(() => searchId.value),

    // Métodos
    buscarSemantica,
    buscarPorCoincidencia,
    limpiar,
  };
}

