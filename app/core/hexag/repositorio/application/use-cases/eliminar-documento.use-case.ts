import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";

/**
 * Use case para eliminar un documento o carpeta
 */
export class EliminarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Elimina un nodo (documento o carpeta) del repositorio
   * @param nodeId ID del nodo a eliminar
   */
  async execute(nodeId: number): Promise<void> {
    await this.documentoRepository.eliminarNodo(nodeId);
  }
}


