import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';
import type { CarpetaSistema } from '../../domain/entities/carpeta-sistema.entity';
import { withAuthHeaders } from '~/lib/api-client';
import { RepositorioDocumentosHttpRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository';
import { DocumentoSocietarioMapper } from '../mappers/documento-societario.mapper';
import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';

/**
 * Repositorio HTTP para Almacenamiento
 * 
 * Usa los endpoints V2.5 del backend:
 * - GET /api/v2/repository/society-profile/:structureId/nodes/core (para raíz)
 * - GET /api/v2/repository/society-profile/nodes/:nodeId (para carpeta específica)
 * - POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder (crear carpeta)
 * - POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents (subir archivo)
 * - GET /api/v2/repository/documents/versions/:versionCode/download (descargar)
 * - DELETE /api/v2/repository/nodes/:nodeId (eliminar)
 */
export class AlmacenamientoHttpRepository implements AlmacenamientoRepository {
  private repositorioHttp: RepositorioDocumentosHttpRepository;

  constructor() {
    this.repositorioHttp = new RepositorioDocumentosHttpRepository();
  }

  /**
   * Resuelve la URL base (igual que otros repositorios)
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  /**
   * Lista documentos de una carpeta (o raíz si parentId es null)
   * 
   * IMPORTANTE: Cuando parentId es null, cargamos el contenido de la carpeta
   * "Documentos Societarios" (ID 32 o la carpeta con código SOCIETARIO_ROOT).
   * Esta es la carpeta raíz del almacén.
   * 
   * ENDPOINT V2: 
   * - Si parentId es null: Buscar carpeta "Documentos Societarios" y cargar su contenido
   * - Si parentId existe: GET /api/v2/repository/society-profile/nodes/:parentId
   */
  async listDocumentos(sociedadId: string, parentId: string | null): Promise<DocumentoSocietario[]> {
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] LIST DOCUMENTOS");
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] sociedadId:", sociedadId);
    console.log("🔵 [AlmacenamientoHttp] parentId:", parentId);

    try {
      let nodes: RepositorioNode[] = [];

      if (parentId === null) {
        // Si estamos en la raíz, cargar el contenido de /core/ directamente
        // Según la nueva estructura V2, /core/ es la raíz del almacén (Google Drive clone)
        console.log("🔵 [AlmacenamientoHttp] Cargando contenido de /core/ (raíz del almacén)");
        
        // 1. Obtener carpetas raíz para encontrar /core/
        const nodosRaiz = await this.repositorioHttp.obtenerNodosRaiz(sociedadId);
        
        if (nodosRaiz.length === 0) {
          console.log("🔵 [AlmacenamientoHttp] Sociedad vacía, no hay carpetas raíz");
          return [];
        }

        // 2. Buscar la carpeta "core"
        const carpetaCore = nodosRaiz.find(node => 
          node.type === 'folder' && node.name.toLowerCase() === 'core'
        );

        if (!carpetaCore) {
          console.log("🔵 [AlmacenamientoHttp] No se encontró la carpeta 'core'");
          return [];
        }

        console.log("🔵 [AlmacenamientoHttp] Carpeta 'core' encontrada:", {
          id: carpetaCore.id,
          name: carpetaCore.name,
          path: carpetaCore.path,
        });

        // 3. Obtener el contenido de /core/
        const nodeIdNumber = parseInt(carpetaCore.id, 10);
        if (isNaN(nodeIdNumber)) {
          throw new Error(`ID de carpeta inválido: ${carpetaCore.id}`);
        }
        
        const node = await this.repositorioHttp.obtenerNodoPorId(nodeIdNumber);
        if (node && node.children) {
          // Filtrar solo archivos y carpetas que NO sean "documentos-generados"
          // porque "documentos-generados" es una carpeta visual que redirige a otra vista
          nodes = node.children.filter(child => {
            // Excluir la carpeta "documentos-generados" (es visual, redirige a otra vista)
            return child.name.toLowerCase() !== 'documentos-generados';
          });
          
          console.log("🔵 [AlmacenamientoHttp] Contenido de /core/ (filtrado):", nodes.length, "elementos");
        } else {
          console.log("🔵 [AlmacenamientoHttp] Carpeta /core/ está vacía");
          nodes = [];
        }
      } else {
        // Si hay parentId, obtener el nodo con sus hijos
        const nodeIdNumber = parseInt(parentId, 10);
        if (isNaN(nodeIdNumber)) {
          throw new Error(`parentId inválido: ${parentId}`);
        }
        const node = await this.repositorioHttp.obtenerNodoPorId(nodeIdNumber);
        if (node && node.children) {
          nodes = node.children;
        }
      }

      console.log("🔵 [AlmacenamientoHttp] Nodos obtenidos:", nodes.length);
      console.log("🔵 [AlmacenamientoHttp] ========================================");

      return DocumentoSocietarioMapper.toDocumentosSocietarios(nodes);
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al listar documentos:", error);
      throw new Error(
        `No se pudieron listar los documentos: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene un documento por ID
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/nodes/:nodeId
   */
  async getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null> {
    console.log("🔵 [AlmacenamientoHttp] GET DOCUMENTO:", documentoId);

    try {
      const nodeIdNumber = parseInt(documentoId, 10);
      if (isNaN(nodeIdNumber)) {
        throw new Error(`documentoId inválido: ${documentoId}`);
      }
      const node = await this.repositorioHttp.obtenerNodoPorId(nodeIdNumber);
      if (!node) {
        return null;
      }

      return DocumentoSocietarioMapper.toDocumentoSocietario(node);
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al obtener documento:", error);
      return null;
    }
  }

  /**
   * Crea una nueva carpeta
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder
   */
  async createCarpeta(sociedadId: string, nombre: string, parentId: string | null): Promise<CarpetaSistema> {
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] CREATE CARPETA");
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] sociedadId:", sociedadId);
    console.log("🔵 [AlmacenamientoHttp] nombre:", nombre);
    console.log("🔵 [AlmacenamientoHttp] parentId:", parentId);

    if (!parentId) {
      throw new Error("parentId es requerido para crear una carpeta");
    }

    const parentIdNumber = parseInt(parentId, 10);
    if (isNaN(parentIdNumber)) {
      throw new Error(`parentId inválido: ${parentId}`);
    }

    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${sociedadId}/nodes/${parentIdNumber}/folder`;

    console.log("🔵 [AlmacenamientoHttp] URL:", url);
    console.log("🔵 [AlmacenamientoHttp] Body:", {
      name: nombre,
      description: null,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        data: any;
        message?: string;
        code?: number;
      }>(url, {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: {
          name: nombre,
          description: null,
        },
      });

      console.log("🔵 [AlmacenamientoHttp] ========================================");
      console.log("🔵 [AlmacenamientoHttp] RESPUESTA:");
      console.log("🔵 [AlmacenamientoHttp] response:", JSON.stringify(response, null, 2));
      console.log("🔵 [AlmacenamientoHttp] ========================================");

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (!response.success) {
        throw new Error(response.message || "Error al crear la carpeta");
      }

      if (!response.data) {
        throw new Error("La respuesta del servidor no contiene los datos esperados");
      }

      // Mapear la respuesta a RepositorioNode y luego a CarpetaSistema
      const node: RepositorioNode = {
        id: String(response.data.id),
        code: response.data.code || '',
        societyId: String(response.data.societyId || sociedadId),
        parentId: response.data.parentId ? String(response.data.parentId) : null,
        name: response.data.name,
        type: response.data.type === 1 ? 'folder' : 'document',
        path: response.data.path || '',
        description: response.data.description || null,
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString(),
        isCore: response.data.isCore || false,
      };

      console.log("🟢 [AlmacenamientoHttp] Carpeta creada exitosamente:", {
        id: node.id,
        name: node.name,
        path: node.path,
      });
      console.log("🔵 [AlmacenamientoHttp] ========================================");

      return DocumentoSocietarioMapper.toCarpetaSistema(node);
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] ========================================");
      console.error("🔴 [AlmacenamientoHttp] ERROR AL CREAR CARPETA:");
      console.error("🔴 [AlmacenamientoHttp] URL:", url);
      console.error("🔴 [AlmacenamientoHttp] Body:", { name: nombre, description: null });
      console.error("🔴 [AlmacenamientoHttp] Error completo:", error);
      console.error("🔴 [AlmacenamientoHttp] Error message:", error?.message);
      console.error("🔴 [AlmacenamientoHttp] Error statusCode:", error?.statusCode);
      console.error("🔴 [AlmacenamientoHttp] Error data:", error?.data);
      console.error("🔴 [AlmacenamientoHttp] ========================================");
      
      const errorMessage = error?.data?.message || error?.message || "Error desconocido";
      throw new Error(`No se pudo crear la carpeta: ${errorMessage}`);
    }
  }

  /**
   * Sube un documento
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
   */
  async uploadDocumento(sociedadId: string, file: File, parentId: string | null): Promise<DocumentoSocietario> {
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] UPLOAD DOCUMENTO");
    console.log("🔵 [AlmacenamientoHttp] ========================================");
    console.log("🔵 [AlmacenamientoHttp] sociedadId:", sociedadId);
    console.log("🔵 [AlmacenamientoHttp] fileName:", file.name);
    console.log("🔵 [AlmacenamientoHttp] parentId:", parentId);

    if (!parentId) {
      throw new Error("parentId es requerido para subir un documento");
    }

    try {
      const node = await this.repositorioHttp.subirArchivo(sociedadId, parentId, file);
      console.log("🟢 [AlmacenamientoHttp] Documento subido exitosamente:", node.id);
      console.log("🔵 [AlmacenamientoHttp] ========================================");

      return DocumentoSocietarioMapper.toDocumentoSocietario(node);
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al subir documento:", error);
      throw new Error(
        `No se pudo subir el documento: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Descarga un documento
   * 
   * ENDPOINT V2: GET /api/v2/repository/documents/versions/:versionCode/download
   * Primero necesitamos obtener el documento para obtener su versionCode
   */
  async downloadDocumento(sociedadId: string, documentoId: string): Promise<Blob> {
    console.log("🔵 [AlmacenamientoHttp] DOWNLOAD DOCUMENTO:", documentoId);

    try {
      // 1. Obtener el documento para obtener su versionCode
      const nodeIdNumber = parseInt(documentoId, 10);
      if (isNaN(nodeIdNumber)) {
        throw new Error(`documentoId inválido: ${documentoId}`);
      }
      const node = await this.repositorioHttp.obtenerNodoPorId(nodeIdNumber);
      
      if (!node || node.type !== 'document') {
        throw new Error("El nodo no es un documento");
      }

      if (!node.versions || node.versions.length === 0) {
        throw new Error("El documento no tiene versiones disponibles");
      }

      // 2. Obtener la última versión
      const versionCode = node.versions[0].versionCode;

      // 3. Descargar usando el repositorio HTTP
      const blob = await this.repositorioHttp.descargarVersion(versionCode);
      
      console.log("🟢 [AlmacenamientoHttp] Documento descargado exitosamente");
      return blob;
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al descargar documento:", error);
      throw new Error(
        `No se pudo descargar el documento: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Elimina un documento o carpeta
   * 
   * ENDPOINT V2: DELETE /api/v2/repository/nodes/:nodeId
   */
  async deleteDocumento(sociedadId: string, documentoId: string): Promise<void> {
    console.log("🔵 [AlmacenamientoHttp] DELETE DOCUMENTO:", documentoId);

    try {
      const nodeIdNumber = parseInt(documentoId, 10);
      if (isNaN(nodeIdNumber)) {
        throw new Error(`documentoId inválido: ${documentoId}`);
      }
      await this.repositorioHttp.eliminarNodo(nodeIdNumber);
      console.log("🟢 [AlmacenamientoHttp] Documento eliminado exitosamente");
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al eliminar documento:", error);
      throw new Error(
        `No se pudo eliminar el documento: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Navega a una carpeta (obtiene su contenido)
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/nodes/:nodeId
   */
  async navigateCarpeta(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]> {
    return this.listDocumentos(sociedadId, carpetaId);
  }
}

