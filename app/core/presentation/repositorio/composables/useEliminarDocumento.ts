import { EliminarDocumentoUseCase } from "~/core/hexag/repositorio/application/use-cases/eliminar-documento.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

/**
 * Composable para eliminar documentos
 */
export function useEliminarDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new EliminarDocumentoUseCase(repository);

  const eliminar = async (nodeId: number) => {
    try {
      await useCase.execute(nodeId);
      // TODO: Agregar toast de éxito cuando tengamos el sistema de toasts
      console.log("✅ Documento eliminado correctamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar documento:", error);
      // TODO: Agregar toast de error cuando tengamos el sistema de toasts
      throw error;
    }
  };

  return { eliminar };
}


