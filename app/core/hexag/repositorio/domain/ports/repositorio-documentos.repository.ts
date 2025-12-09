import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import type { RepositorioNode } from "../entities/repositorio-node.entity";

/**
 * Puerto (contrato) para operaciones con el repositorio
 */
export interface RepositorioDocumentosRepository {
  /**
   * Obtiene o crea la carpeta de junta en el repositorio
   * @param structureId ID de la estructura de la sociedad (structureId = societyId)
   * @param flowId ID del flujo de la junta
   * @returns ID de la carpeta creada o existente
   */
  obtenerFolderIdJunta(structureId: string, flowId: string): Promise<number>;

  /**
   * Envía documentos al repositorio
   * @param structureId ID de la estructura de la sociedad
   * @param folderId ID de la carpeta donde se subirán los documentos
   * @param documentos Lista de documentos a subir
   * @param nombreCarpeta Nombre de la carpeta (ej: "Documentos Juntas: 8 de diciembre de 2025")
   */
  enviarDocumentos(
    structureId: string,
    folderId: number,
    documentos: Documento[],
    nombreCarpeta: string
  ): Promise<void>;

  /**
   * Obtiene todos los nodos core de una sociedad
   * @param structureId ID de la estructura de la sociedad
   * @returns Lista de nodos core (carpetas y documentos dentro de /core/)
   */
  obtenerNodosCore(structureId: string): Promise<RepositorioNode[]>;

  /**
   * Obtiene un nodo específico por su ID (incluye hijos si es carpeta)
   * @param nodeId ID del nodo a obtener
   * @returns Nodo con sus hijos (si es carpeta)
   */
  obtenerNodoPorId(nodeId: number): Promise<RepositorioNode>;
}

