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
   * ENDPOINT V2: 
   * - Si parentId es null: GET /api/v2/repository/society-profile/:structureId/nodes/core
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
        // Si estamos en la raíz, obtener nodos core
        nodes = await this.repositorioHttp.obtenerNodosCore(sociedadId);
        
        // Si la sociedad está vacía, retornar array vacío
        if (nodes.length === 0) {
          console.log("🔵 [AlmacenamientoHttp] Sociedad vacía, no hay documentos");
          return [];
        }

        // Filtrar solo los hijos directos de /core/ (no incluir /core/ mismo)
        // Según la respuesta del backend, los nodos con parentId: 1 son hijos directos de /core/
        nodes = nodes.filter(node => {
          // Incluir solo nodos que son hijos directos de /core/
          // parentId debe ser 1 (hijo directo de /core/)
          return node.parentId === "1";
        });

        // IMPORTANTE: Filtrar carpetas de "documentos generados"
        // Estas carpetas NO deben aparecer en el Almacén porque son del sistema
        // y pertenecen a "Documentos Generados", no al Almacén del usuario
        nodes = nodes.filter(node => {
          const path = node.path.toLowerCase();
          const name = node.name.toLowerCase();
          
          // Lista de nombres de carpetas del sistema (documentos generados)
          const carpetasSistema = [
            'directorio',
            'sociedades',
            'juntas',
            'historial de registro',
            'ficha de la sociedad',
            'registro sociedades',
            'estados financieros y reparto de dividendos',
            'aumento capital',
            'designación y/o remoción',
            'accionistas',
            'datos principales',
            'capital social y acciones',
            'asignación de acciones',
            'registro de apoderados',
            'quorums y mayoría',
            'régimen de facultades',
            'estatutos',
            'gerentes y/o apoderados',
            'directores',
            'aporte dinerario',
            'capitalización de créditos',
          ];
          
          // Excluir si el nombre coincide con carpetas del sistema
          if (carpetasSistema.includes(name)) {
            console.log("🔵 [AlmacenamientoHttp] Filtrando carpeta del sistema:", name);
            return false;
          }
          
          // Excluir si el path contiene rutas de documentos generados
          if (path.includes('/core/sociedades/') || 
              path.includes('/core/juntas/') || 
              path.includes('/core/directorio/')) {
            console.log("🔵 [AlmacenamientoHttp] Filtrando por path:", path);
            return false;
          }
          
          // Excluir carpetas que son IDs numéricos (carpetas de juntas por ID, no por fecha)
          // Estas deberían ser por fecha (ej: "junta 12/12/2023"), no por ID (ej: "4", "8")
          if (/^\d+$/.test(name)) {
            console.log("🔵 [AlmacenamientoHttp] Filtrando carpeta numérica (ID):", name);
            return false;
          }
          
          return true;
        });
        
        console.log("🔵 [AlmacenamientoHttp] Nodos después de filtrar:", nodes.length);
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

    try {
      const response = await $fetch<{
        success: boolean;
        data: any;
      }>(url, {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: {
          name: nombre,
          description: null,
        },
      });

      if (response.success && response.data) {
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

        console.log("🟢 [AlmacenamientoHttp] Carpeta creada exitosamente:", node.id);
        console.log("🔵 [AlmacenamientoHttp] ========================================");

        return DocumentoSocietarioMapper.toCarpetaSistema(node);
      }

      throw new Error("La respuesta del servidor no contiene los datos esperados");
    } catch (error: any) {
      console.error("🔴 [AlmacenamientoHttp] Error al crear carpeta:", error);
      throw new Error(
        `No se pudo crear la carpeta: ${error?.message || "Error desconocido"}`
      );
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

