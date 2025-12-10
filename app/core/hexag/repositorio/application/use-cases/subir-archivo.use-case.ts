import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";

/**
 * Use case para subir un archivo al repositorio
 * 
 * Responsabilidad: Orquestar la subida de un archivo
 * Ubicación: Application (según arquitectura hexagonal)
 */
export class SubirArchivoUseCase {
  constructor(
    private readonly repositorioDocumentosRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Sube un archivo a una carpeta específica
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param file Archivo a subir
   * @returns Nodo creado del documento subido
   */
  async execute(
    structureId: string,
    parentNodeId: string,
    file: File
  ): Promise<RepositorioNode> {
    console.log("🟡 [SubirArchivoUseCase] ========================================");
    console.log("🟡 [SubirArchivoUseCase] SUBIR ARCHIVO");
    console.log("🟡 [SubirArchivoUseCase] ========================================");
    console.log("🟡 [SubirArchivoUseCase] structureId:", structureId);
    console.log("🟡 [SubirArchivoUseCase] parentNodeId:", parentNodeId);
    console.log("🟡 [SubirArchivoUseCase] fileName:", file.name);
    console.log("🟡 [SubirArchivoUseCase] fileSize:", file.size, "bytes");
    console.log("🟡 [SubirArchivoUseCase] fileType:", file.type);

    // Validaciones
    if (!file || file.size === 0) {
      throw new Error("El archivo está vacío");
    }

    if (!structureId || !parentNodeId) {
      throw new Error("structureId y parentNodeId son requeridos");
    }

    try {
      const nodo = await this.repositorioDocumentosRepository.subirArchivo(
        structureId,
        parentNodeId,
        file
      );

      console.log("🟢 [SubirArchivoUseCase] Archivo subido exitosamente:", {
        id: nodo.id,
        name: nodo.name,
      });
      console.log("🟢 [SubirArchivoUseCase] ========================================");

      return nodo;
    } catch (error: any) {
      console.error("🔴 [SubirArchivoUseCase] Error al subir archivo:", error);
      throw new Error(
        `Error al subir archivo: ${error?.message || "Error desconocido"}`
      );
    }
  }
}

