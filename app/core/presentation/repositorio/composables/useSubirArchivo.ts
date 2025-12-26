import { SubirArchivoUseCase } from "~/core/hexag/repositorio/application/use-cases/subir-archivo.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

/**
 * Composable para subir un archivo al repositorio
 */
export function useSubirArchivo() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new SubirArchivoUseCase(repository);

  const subirArchivo = async (
    structureId: string,
    parentNodeId: string,
    file: File
  ): Promise<RepositorioNode> => {
    try {
      console.log("🟡 [useSubirArchivo] Subiendo archivo...");
      const nodo = await useCase.execute(structureId, parentNodeId, file);
      console.log("🟢 [useSubirArchivo] Archivo subido exitosamente:", nodo);
      return nodo;
    } catch (error: any) {
      console.error("❌ [useSubirArchivo] Error al subir archivo:", error);
      throw error;
    }
  };

  return {
    subirArchivo,
  };
}

