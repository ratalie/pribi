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
   * @param folderName Nombre opcional de la carpeta (ej: "20 de diciembre del 2025"). Si no se proporciona, usa flowId.toString()
   * @returns ID de la carpeta creada o existente
   */
  obtenerFolderIdJunta(
    structureId: string,
    flowId: string,
    folderName?: string
  ): Promise<number>;

  /**
   * Envía documentos al repositorio
   * @param structureId ID de la estructura de la sociedad
   * @param folderId ID de la carpeta donde se subirán los documentos (carpeta de la junta)
   * @param documentos Lista de documentos a subir
   */
  enviarDocumentos(
    structureId: string,
    folderId: number,
    documentos: Documento[]
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
   * Actualiza un nodo (renombrar carpeta, cambiar metadata)
   * @param nodeId ID del nodo a actualizar
   * @param updates Objeto con los campos a actualizar (name, description, parentId)
   */
  actualizarNodo(
    nodeId: number,
    updates: {
      name?: string;
      description?: string;
      parentId?: number;
    }
  ): Promise<void>;

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

  /**
   * Crea una carpeta en el repositorio
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre donde se creará la carpeta
   * @param nombre Nombre de la carpeta
   * @param description Descripción opcional de la carpeta
   * @returns Nodo creado de la carpeta
   */
  crearCarpeta(
    structureId: string,
    parentNodeId: number,
    nombre: string,
    description?: string
  ): Promise<RepositorioNode>;

  /**
   * Verifica si un documento con un nombre específico ya existe en una carpeta
   * @param structureId ID de la estructura de la sociedad
   * @param folderId ID de la carpeta donde buscar
   * @param fileName Nombre exacto del archivo a verificar (case-sensitive)
   * @returns Información sobre si el documento existe y sus datos si existe
   */
  verificarDocumentoDuplicado(
    structureId: string,
    folderId: number,
    fileName: string
  ): Promise<{
    exists: boolean;
    document: {
      versionCode: string;
      documentCode: string;
      title: string;
      latestVersion: {
        versionCode: string;
        versionNumber: number;
        createdAt: string;
        sizeInBytes: number;
      };
      node: {
        id: number;
        code: string;
        name: string;
        path: string;
      };
    } | null;
  }>;

  /**
   * Sube una nueva versión de un documento existente
   * @param documentCode Código del documento (UUID)
   * @param file Archivo de la nueva versión
   * @returns Información de la nueva versión creada
   */
  subirNuevaVersion(
    documentCode: string,
    file: File
  ): Promise<{
    versionCode: string;
    documentCode: string;
    versionNumber: number;
    title: string;
    sizeInBytes: number;
    createdAt: string;
  }>;

  /**
   * Obtiene el peso (tamaño y conteo) de una carpeta
   * @param nodeId ID del nodo carpeta
   * @returns Información del peso de la carpeta
   */
  obtenerPesoCarpeta(nodeId: number): Promise<{
    sizeInBytes: number;
    folderCount: number;
    fileCount: number;
  }>;

  /**
   * Restaura una versión anterior de un documento como versión actual
   * @param documentCode Código del documento (UUID)
   * @param versionCode Código de la versión a restaurar (UUID)
   * @returns Información de la nueva versión creada (restaurada)
   */
  restaurarVersion(
    documentCode: string,
    versionCode: string
  ): Promise<{
    versionCode: string;
    documentCode: string;
    versionNumber: number;
    title: string;
    sizeInBytes: number;
    createdAt: string;
  }>;

  /**
   * Búsqueda semántica de documentos usando embeddings de IA
   * @param structureId ID de la estructura de la sociedad
   * @param params Parámetros de búsqueda semántica
   * @returns Resultados de búsqueda con paginación
   */
  busquedaSemantica(
    structureId: string,
    params: {
      semanticInput?: string;
      searchID?: string;
      filters?: {
        page?: number;
        limit?: number;
        scopedFolderNodeID?: number;
        mimeType?: string;
      };
    }
  ): Promise<{
    searchId: string;
    documents: Array<{
      versionCode: string;
      documentCode: string;
      title: string;
      sizeInBytes: number;
      createdAt: string;
      proximity: number;
      node?: {
        id: number;
        code: string;
        name: string;
        path: string;
        type: number;
      };
    }>;
    pagination: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }>;

  /**
   * Búsqueda por coincidencia de texto en el título del documento
   * @param structureId ID de la estructura de la sociedad
   * @param params Parámetros de búsqueda por coincidencia
   * @returns Resultados de búsqueda con paginación
   */
  busquedaPorCoincidencia(
    structureId: string,
    params: {
      search?: string;
      page?: number;
      limit?: number;
      order?: "name" | "createdAt";
      sort?: "asc" | "desc";
      mimeType?: string;
      updatedFrom?: string;
      updatedTo?: string;
    }
  ): Promise<{
    documents: Array<{
      versionCode: string;
      documentCode: string;
      title: string;
      sizeInBytes: number;
      createdAt: string;
      node?: {
        id: number;
        code: string;
        name: string;
        path: string;
        type: number;
      };
    }>;
    pagination: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }>;
}
