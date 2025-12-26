import { DescargarDocumentoUseCase } from "~/core/hexag/repositorio/application/use-cases/descargar-documento.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

/**
 * Composable para descargar documentos
 */
export function useDescargarDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new DescargarDocumentoUseCase(repository);

  const descargar = async (versionCode: string, fileName: string) => {
    try {
      await useCase.execute(versionCode, fileName);
      // TODO: Agregar toast de éxito cuando tengamos el sistema de toasts
      console.log("✅ Documento descargado correctamente");
    } catch (error: any) {
      console.error("❌ Error al descargar documento:", error);
      // TODO: Agregar toast de error cuando tengamos el sistema de toasts
      throw error;
    }
  };

  return { descargar };
}


