import { ref, computed } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { useToast } from "~/components/ui/toast/use-toast";

/**
 * Composable para actualizar el nombre de un documento
 */
export function useActualizarNombreDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const { toast } = useToast();

  const isUpdating = ref(false);

  const actualizarNombre = async (
    nodeId: number,
    nuevoNombre: string
  ): Promise<void> => {
    isUpdating.value = true;

    try {
      console.log("📝 [useActualizarNombreDocumento] Actualizando nombre:", {
        nodeId,
        nuevoNombre,
      });

      await repository.actualizarNodo(nodeId, {
        name: nuevoNombre,
      });

      console.log("✅ [useActualizarNombreDocumento] Nombre actualizado exitosamente");

      toast({
        title: "Nombre actualizado",
        description: "El nombre del documento se ha actualizado correctamente",
        variant: "success",
      });
    } catch (error: any) {
      console.error("❌ [useActualizarNombreDocumento] Error al actualizar nombre:", error);

      toast({
        title: "Error al actualizar nombre",
        description: error?.message || "No se pudo actualizar el nombre del documento",
        variant: "destructive",
      });

      throw error;
    } finally {
      isUpdating.value = false;
    }
  };

  return {
    isUpdating: computed(() => isUpdating.value),
    actualizarNombre,
  };
}

