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
   * Obtiene los nodos raíz de una sociedad (core y common)
   * @param structureId ID de la estructura de la sociedad
   * @returns Lista de nodos raíz (carpetas core y common)
   */
  obtenerNodosRaiz(structureId: string): Promise<RepositorioNode[]>;

  /**
   * Obtiene un nodo específico por su ID (incluye hijos si es carpeta)
   * @param nodeId ID del nodo a obtener
   * @returns Nodo con sus hijos (si es carpeta)
   */
  obtenerNodoPorId(nodeId: number): Promise<RepositorioNode>;

  /**
   * Descarga una versión de documento
   * @param versionCode Código de la versión del documento
   * @returns Blob del archivo
   */
  descargarVersion(versionCode: string): Promise<Blob>;

  /**
   * Elimina un nodo (documento o carpeta)
   * @param nodeId ID del nodo a eliminar
   */
  eliminarNodo(nodeId: number): Promise<void>;

  /**
   * Descarga una carpeta completa como ZIP
   * @param nodeId ID de la carpeta
   * @returns Blob del archivo ZIP
   */
  descargarCarpetaZip(nodeId: number): Promise<Blob>;

  /**
   * Sube un archivo a una carpeta
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param file Archivo a subir
   * @returns Nodo creado del documento subido
   */
  subirArchivo(
    structureId: string,
    parentNodeId: string,
    file: File
  ): Promise<RepositorioNode>;

  /**
   * Sube múltiples archivos a una carpeta
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param files Lista de archivos a subir
   * @returns Lista de nodos creados
   */
  subirMultiplesArchivos(
    structureId: string,
    parentNodeId: string,
    files: File[]
  ): Promise<RepositorioNode[]>;
}

