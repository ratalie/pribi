import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";

/**
 * Use case para subir múltiples archivos al repositorio
 * 
 * Responsabilidad: Orquestar la subida de múltiples archivos
 * Ubicación: Application (según arquitectura hexagonal)
 */
export class SubirMultiplesArchivosUseCase {
  constructor(
    private readonly repositorioDocumentosRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Sube múltiples archivos a una carpeta específica
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param files Lista de archivos a subir
   * @returns Lista de nodos creados
   */
  async execute(
    structureId: string,
    parentNodeId: string,
    files: File[]
  ): Promise<RepositorioNode[]> {
    console.log("🟡 [SubirMultiplesArchivosUseCase] ========================================");
    console.log("🟡 [SubirMultiplesArchivosUseCase] SUBIR MÚLTIPLES ARCHIVOS");
    console.log("🟡 [SubirMultiplesArchivosUseCase] ========================================");
    console.log("🟡 [SubirMultiplesArchivosUseCase] structureId:", structureId);
    console.log("🟡 [SubirMultiplesArchivosUseCase] parentNodeId:", parentNodeId);
    console.log("🟡 [SubirMultiplesArchivosUseCase] filesCount:", files.length);

    // Validaciones
    if (!files || files.length === 0) {
      throw new Error("No se proporcionaron archivos para subir");
    }

    if (!structureId || !parentNodeId) {
      throw new Error("structureId y parentNodeId son requeridos");
    }

    // Validar que todos los archivos tengan tamaño > 0
    const archivosVacios = files.filter((f) => f.size === 0);
    if (archivosVacios.length > 0) {
      throw new Error(
        `Hay ${archivosVacios.length} archivo(s) vacío(s) en la selección`
      );
    }

    try {
      const nodos = await this.repositorioDocumentosRepository.subirMultiplesArchivos(
        structureId,
        parentNodeId,
        files
      );

      console.log("🟢 [SubirMultiplesArchivosUseCase] Archivos subidos exitosamente:", {
        count: nodos.length,
        nodos: nodos.map((n) => ({ id: n.id, name: n.name })),
      });
      console.log("🟢 [SubirMultiplesArchivosUseCase] ========================================");

      return nodos;
    } catch (error: any) {
      console.error("🔴 [SubirMultiplesArchivosUseCase] Error al subir archivos:", error);
      throw new Error(
        `Error al subir archivos: ${error?.message || "Error desconocido"}`
      );
    }
  }
}

