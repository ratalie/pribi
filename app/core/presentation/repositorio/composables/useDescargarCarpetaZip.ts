import { DescargarCarpetaZipUseCase } from "~/core/hexag/repositorio/application/use-cases/descargar-carpeta-zip.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

/**
 * Composable para descargar carpetas como ZIP
 */
export function useDescargarCarpetaZip() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new DescargarCarpetaZipUseCase(repository);

  const descargar = async (nodeId: number, folderName: string) => {
    try {
      await useCase.execute(nodeId, folderName);
      // TODO: Agregar toast de éxito cuando tengamos el sistema de toasts
      console.log("✅ Carpeta descargada correctamente");
    } catch (error: any) {
      console.error("❌ Error al descargar carpeta:", error);
      // TODO: Agregar toast de error cuando tengamos el sistema de toasts
      throw error;
    }
  };

  return { descargar };
}


