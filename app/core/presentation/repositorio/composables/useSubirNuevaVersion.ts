import { ref, computed } from "vue";
import { useToast } from "~/components/ui/toast/use-toast";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

/**
 * Composable para subir una nueva versión de un documento
 * 
 * Usa el método existente en RepositorioDocumentosHttpRepository
 */
export function useSubirNuevaVersion() {
  const { toast } = useToast();
  const repository = new RepositorioDocumentosHttpRepository();
  
  const selectedFile = ref<File | null>(null);
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const error = ref<string | null>(null);

  /**
   * Selecciona un archivo para subir
   */
  const selectFile = (file: File | null) => {
    selectedFile.value = file;
    error.value = null;
    uploadProgress.value = 0;
  };

  /**
   * Sube una nueva versión de un documento
   * @param documentCode UUID del documento
   * @returns Promise que se resuelve cuando la subida es exitosa
   */
  const subirNuevaVersion = async (documentCode: string): Promise<boolean> => {
    if (!documentCode) {
      throw new Error("documentCode es requerido");
    }

    if (!selectedFile.value) {
      throw new Error("No hay archivo seleccionado");
    }

    isUploading.value = true;
    error.value = null;
    uploadProgress.value = 0;

    try {
      console.log("🟡 [useSubirNuevaVersion] Subiendo nueva versión...", {
        documentCode,
        fileName: selectedFile.value.name,
        fileSize: selectedFile.value.size,
      });

      // Usar el método existente del repositorio
      const result = await repository.subirNuevaVersion(
        documentCode,
        selectedFile.value
      );

      console.log("🟢 [useSubirNuevaVersion] Versión subida exitosamente", result);
      uploadProgress.value = 100;

      toast({
        title: "Versión subida exitosamente",
        description: "La nueva versión del documento ha sido subida correctamente.",
        variant: "default",
      });

      // Limpiar archivo seleccionado después de subir exitosamente
      selectedFile.value = null;

      return true;
    } catch (err: any) {
      console.error("❌ [useSubirNuevaVersion] Error al subir versión:", err);
      error.value = err.message || "Error desconocido al subir la versión";

      toast({
        title: "Error al subir versión",
        description: error.value,
        variant: "destructive",
      });

      throw err;
    } finally {
      isUploading.value = false;
      // Resetear progreso después de un breve delay
      setTimeout(() => {
        uploadProgress.value = 0;
      }, 1000);
    }
  };

  /**
   * Cancela la subida
   */
  const cancelUpload = () => {
    if (isUploading.value) {
      // TODO: Implementar cancelación de upload si es necesario
      isUploading.value = false;
      uploadProgress.value = 0;
    }
  };

  /**
   * Elimina el archivo seleccionado
   */
  const deleteFile = () => {
    selectedFile.value = null;
    error.value = null;
    uploadProgress.value = 0;
  };

  /**
   * Limpia todo el estado
   */
  const clearState = () => {
    selectedFile.value = null;
    isUploading.value = false;
    uploadProgress.value = 0;
    error.value = null;
  };

  const canUpload = computed(() => {
    return selectedFile.value !== null && !isUploading.value;
  });

  return {
    selectedFile,
    isUploading,
    uploadProgress,
    error,
    canUpload,
    selectFile,
    subirNuevaVersion,
    cancelUpload,
    deleteFile,
    clearState,
  };
}

