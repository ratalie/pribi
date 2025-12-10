import { SubirMultiplesArchivosUseCase } from "~/core/hexag/repositorio/application/use-cases/subir-multiples-archivos.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

/**
 * Composable para subir múltiples archivos al repositorio
 */
export function useSubirMultiplesArchivos() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new SubirMultiplesArchivosUseCase(repository);

  const subirMultiplesArchivos = async (
    structureId: string,
    parentNodeId: string,
    files: File[]
  ): Promise<RepositorioNode[]> => {
    try {
      console.log("🟡 [useSubirMultiplesArchivos] Subiendo archivos...");
      const nodos = await useCase.execute(structureId, parentNodeId, files);
      console.log("🟢 [useSubirMultiplesArchivos] Archivos subidos exitosamente:", nodos.length);
      return nodos;
    } catch (error: any) {
      console.error("❌ [useSubirMultiplesArchivos] Error al subir archivos:", error);
      throw error;
    }
  };

  return {
    subirMultiplesArchivos,
  };
}

