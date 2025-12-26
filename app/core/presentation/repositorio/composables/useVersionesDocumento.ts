import { ref, computed } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { useToast } from "~/components/ui/toast/use-toast";

/**
 * Interfaz para una versión de documento
 */
export interface DocumentVersion {
  id: string; // versionCode
  versionNumber: number;
  title: string;
  mimeType?: string; // MIME type de esta versión específica
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  isCurrentVersion: boolean;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Composable para gestionar versiones de documentos
 */
export function useVersionesDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const { toast } = useToast();

  const versions = ref<DocumentVersion[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Carga las versiones de un documento desde un nodo
   */
  const cargarVersionesDesdeNodo = async (nodeId: number): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("📋 [useVersionesDocumento] Cargando versiones desde nodo:", nodeId);

      // Obtener el nodo completo
      const node = await repository.obtenerNodoPorId(nodeId);

      if (!node) {
        throw new Error("No se pudo obtener el nodo del servidor");
      }

      // Verificar que es un documento
      if (node.type !== "document") {
        throw new Error("El nodo seleccionado no es un documento");
      }

      // Extraer las versiones del nodo
      // El backend devuelve documentVersions en el DTO, pero el mapper lo convierte a versions
      const documentVersions = node.versions || [];

      if (documentVersions.length === 0) {
        versions.value = [];
        return;
      }

      // Obtener información del usuario logueado (temporal, hasta tener store de usuario)
      const userName = localStorage.getItem("nameUser") || "Usuario";
      const userEmail = localStorage.getItem("emailUser") || "usuario@probo.com";

      // Convertir las versiones al formato esperado
      const versionsList: DocumentVersion[] = documentVersions.map(
        (version: any, index: number) => {
          // Calcular el número de versión correcto
          // Las versiones vienen ordenadas de más reciente a más antigua
          // La versión actual (index 0) debe tener el número más alto
          const versionNumber = documentVersions.length - index;

          // Inferir mimeType desde el nombre si no viene del backend
          const inferMimeType = (fileName: string): string => {
            const ext = fileName.toLowerCase().split(".").pop() || "";
            switch (ext) {
              case "pdf": return "application/pdf";
              case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              case "doc": return "application/msword";
              case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
              case "xls": return "application/vnd.ms-excel";
              case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
              case "ppt": return "application/vnd.ms-powerpoint";
              default: return "application/octet-stream";
            }
          };

          const title = version.title || node.name;
          const mimeType = version.mimeType || inferMimeType(title);

          console.log("📋 [useVersionesDocumento] Mapeando versión:", {
            versionCode: version.versionCode,
            title,
            mimeTypeFromBackend: version.mimeType,
            mimeTypeInferido: !version.mimeType ? inferMimeType(title) : undefined,
            mimeTypeFinal: mimeType,
            index,
            isCurrentVersion: index === 0,
          });

          return {
            id: version.versionCode || `version-${versionNumber}`,
            versionNumber,
            title,
            mimeType, // Incluir mimeType
            sizeInBytes: version.sizeInBytes || 0,
            createdAt: version.createdAt || new Date().toISOString(),
            updatedAt: version.updatedAt || version.createdAt || new Date().toISOString(),
            isCurrentVersion: index === 0, // La primera versión es la más reciente
            uploadedBy: {
              id: version.userId?.toString() || version.userIdV2 || "user-1",
              name: version.userName || userName,
              email: userEmail,
            },
          };
        }
      );

      versions.value = versionsList;
      console.log("✅ [useVersionesDocumento] Versiones cargadas:", versionsList.length);
    } catch (err: any) {
      console.error("❌ [useVersionesDocumento] Error al cargar versiones:", err);
      error.value = err.message || "No se pudieron cargar las versiones del documento";
      versions.value = [];

      toast({
        title: "Error al cargar versiones",
        description: error.value || "Error desconocido",
        variant: "destructive",
      });

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Restaura una versión anterior como versión actual
   */
  const restaurarVersion = async (
    documentCode: string,
    versionCode: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("🔄 [useVersionesDocumento] Restaurando versión:", {
        documentCode,
        versionCode,
      });

      await repository.restaurarVersion(documentCode, versionCode);

      console.log("✅ [useVersionesDocumento] Versión restaurada exitosamente");

      toast({
        title: "Versión restaurada",
        description: "La versión se ha restaurado exitosamente",
        variant: "success",
      });

      // Recargar las versiones después de restaurar
      // Nota: Necesitamos el nodeId para recargar, pero no lo tenemos aquí
      // El componente que llama a esta función deberá recargar manualmente
    } catch (err: any) {
      console.error("❌ [useVersionesDocumento] Error al restaurar versión:", err);
      error.value = err.message || "No se pudo restaurar la versión";

      toast({
        title: "Error al restaurar versión",
        description: error.value || "Error desconocido",
        variant: "destructive",
      });

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Versiones ordenadas (versión actual primero, luego anteriores por fecha)
   */
  const sortedVersions = computed(() => {
    return [...versions.value].sort((a, b) => {
      // Si una es la versión actual, debe ir primero
      if (a.isCurrentVersion && !b.isCurrentVersion) return -1;
      if (!a.isCurrentVersion && b.isCurrentVersion) return 1;

      // Si ambas son versiones anteriores, ordenar por fecha (más recientes primero)
      if (!a.isCurrentVersion && !b.isCurrentVersion) {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Orden descendente (más recientes primero)
      }

      // Si ambas son la versión actual, mantener orden original
      return 0;
    });
  });

  /**
   * Limpia el estado del composable
   */
  const limpiar = () => {
    versions.value = [];
    error.value = null;
    isLoading.value = false;
  };

  return {
    // Estado
    versions: computed(() => versions.value),
    sortedVersions,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Métodos
    cargarVersionesDesdeNodo,
    restaurarVersion,
    limpiar,
  };
}
