import { PrevisualizarDocumentoUseCase } from "~/core/hexag/repositorio/application/use-cases/previsualizar-documento.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

/**
 * Composable para previsualizar documentos
 */
export function usePrevisualizarDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new PrevisualizarDocumentoUseCase(repository);

  const previsualizar = async (
    versionCode: string,
    mimeType: string
  ) => {
    console.log("🟡 [usePrevisualizarDocumento] ========================================");
    console.log("🟡 [usePrevisualizarDocumento] PREVISUALIZAR DOCUMENTO");
    console.log("🟡 [usePrevisualizarDocumento] ========================================");
    console.log("🟡 [usePrevisualizarDocumento] versionCode:", versionCode);
    console.log("🟡 [usePrevisualizarDocumento] mimeType:", mimeType);
    
    try {
      const preview = await useCase.execute(versionCode, mimeType);
      console.log("🟢 [usePrevisualizarDocumento] Preview obtenido:", {
        type: preview.type,
        hasContent: Boolean(preview.content),
      });
      return preview;
    } catch (error: any) {
      console.error("❌ [usePrevisualizarDocumento] Error al previsualizar documento:", error);
      console.error("❌ [usePrevisualizarDocumento] Error message:", error?.message);
      console.error("❌ [usePrevisualizarDocumento] Error stack:", error?.stack);
      throw error;
    }
  };

  return { previsualizar };
}

