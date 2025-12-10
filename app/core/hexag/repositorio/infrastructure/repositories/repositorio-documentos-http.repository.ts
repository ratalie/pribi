import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";
import type { RepositorioNodeDTO } from "../../application/dtos/repositorio-node.dto";
import { RepositorioNodeMapper } from "../mappers/repositorio-node.mapper";
import { withAuthHeaders } from "~/lib/api-client";

/**
 * Repositorio HTTP para enviar documentos al repositorio
 * 
 * REPLICA EXACTA DEL CÓDIGO V2.5:
 * - getNodeBySociety: GET /repository/society/{societyId}/nodes/core
 * - postFilesToNode: POST /repository/society/nodes/{nodeId}/core?name={nombre}
 */
export class RepositorioDocumentosHttpRepository
  implements RepositorioDocumentosRepository
{
  /**
   * Resuelve la URL base (igual que otros repositorios en V3)
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
   * Obtiene el MIME type correcto (igual que V2.5)
   */
  private getCorrectMimeType(fileName: string, currentType: string): string {
    const extension = fileName.toLowerCase().split(".").pop();

    switch (extension) {
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "pdf":
        return "application/pdf";
      default:
        return currentType;
    }
  }

  /**
   * Obtiene el folderId de la carpeta de junta
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder
   * Este endpoint obtiene o crea automáticamente la carpeta
   */
  async obtenerFolderIdJunta(structureId: string, flowId: string): Promise<number> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`;
    
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] OBTENER FOLDER ID JUNTA (ENDPOINT V2)");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔵 [RepositorioDocumentosHttp] flowId:", flowId);
    
    try {
      console.log("🔵 [RepositorioDocumentosHttp] Obteniendo/creando carpeta de junta...");
      
      // ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder
      const response = await $fetch<{
        success?: boolean;
        data?: {
          id: number;
          name: string;
          path: string;
          parentId?: number | null;
          societyId?: number;
          type?: number;
        };
        message?: string;
        code?: number;
      }>(url, {
        ...withAuthHeaders(),
        method: "GET" as const,
      });

      console.log("🔵 [RepositorioDocumentosHttp] ========================================");
      console.log("🔵 [RepositorioDocumentosHttp] RESPUESTA:");
      console.log("🔵 [RepositorioDocumentosHttp] response:", JSON.stringify(response, null, 2));
      console.log("🔵 [RepositorioDocumentosHttp] response.data:", response?.data);
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");

      if (!response || !response.data) {
        console.error("🔴 [RepositorioDocumentosHttp] ERROR: response o response.data es undefined");
        throw new Error("No se pudo obtener o crear la carpeta de junta");
      }

      if (typeof response.data.id === "undefined" || response.data.id === null) {
        console.error("🔴 [RepositorioDocumentosHttp] ERROR: response.data.id es undefined o null");
        throw new Error("La respuesta no contiene el ID de la carpeta");
      }

      console.log("✅ [RepositorioDocumentosHttp] Carpeta obtenida/creada:", {
        id: response.data.id,
        name: response.data.name,
        path: response.data.path,
      });

      return response.data.id;
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL OBTENER FOLDER:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] flowId:", flowId);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] Error message:", error?.message);
      console.error("🔴 [RepositorioDocumentosHttp] Error statusCode:", error?.statusCode);
      console.error("🔴 [RepositorioDocumentosHttp] Error data:", error?.data);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      
      throw new Error(
        `No se pudo obtener la carpeta de junta: ${error?.message || error?.data?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Envía documentos al repositorio
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}
   * 
   * CÓDIGO EXACTO DE V2.5:
   * - FormData con key = file.size.toString()
   * - Usa getCorrectMimeType() para MIME types
   */
  async enviarDocumentos(
    structureId: string,
    folderId: number,
    documentos: Documento[],
    nombreCarpeta: string
  ): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/core`;
    
    console.log("🟢 [RepositorioDocumentosHttp] ========================================");
    console.log("🟢 [RepositorioDocumentosHttp] ENVIAR DOCUMENTOS (CÓDIGO V2.5)");
    console.log("🟢 [RepositorioDocumentosHttp] ========================================");
    console.log("🟢 [RepositorioDocumentosHttp] URL:", url);
    console.log("🟢 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🟢 [RepositorioDocumentosHttp] folderId:", folderId, typeof folderId);
    console.log("🟢 [RepositorioDocumentosHttp] nombreCarpeta:", nombreCarpeta);
    console.log("🟢 [RepositorioDocumentosHttp] cantidadDocumentos:", documentos.length);
    
    try {
      // CÓDIGO EXACTO V2.5: Convertir documentos a Files con getCorrectMimeType
      console.log("🟢 [RepositorioDocumentosHttp] Convirtiendo documentos a Files...");
      const files: File[] = documentos.map((doc, index) => {
        // CÓDIGO EXACTO V2.5: getCorrectMimeType
        const correctMimeType = this.getCorrectMimeType(doc.nombre, doc.mimeType || "");

        const file = new File([doc.blob], doc.nombre, {
          type: correctMimeType,
        });
        
        console.log(`🟢 [RepositorioDocumentosHttp] File ${index + 1}:`, {
          nombre: doc.nombre,
          size: file.size,
          type: file.type,
          correctMimeType: correctMimeType,
        });
        
        return file;
      });

      // CÓDIGO EXACTO V2.5: Crear FormData con key = file.size.toString()
      console.log("🟢 [RepositorioDocumentosHttp] Creando FormData...");
      const formData = new FormData();
      for (const file of files) {
        // CÓDIGO EXACTO V2.5: formData.append(file.size.toString(), file, file.name)
        const key = file.size.toString();
        formData.append(key, file, file.name);
        console.log(`🟢 [RepositorioDocumentosHttp] Agregado a FormData: key="${key}", name="${file.name}", size=${file.size}`);
      }
      
      console.log("🟢 [RepositorioDocumentosHttp] FormData creado con", files.length, "archivos");

      // CÓDIGO EXACTO V2.5: postFilesToNode
      console.log("🟢 [RepositorioDocumentosHttp] Enviando request...");
      console.log("🟢 [RepositorioDocumentosHttp] Params:", { name: nombreCarpeta });
      
      // IMPORTANTE: Con FormData, NO establecer Content-Type manualmente
      // El navegador lo establece automáticamente con el boundary correcto
      // Si lo establecemos manualmente, perdemos el token de Authorization
      const authConfig = withAuthHeaders();
      console.log("🟢 [RepositorioDocumentosHttp] Headers de autenticación:", {
        hasAuthorization: Boolean(authConfig.headers?.Authorization),
        authorizationPreview: authConfig.headers?.Authorization 
          ? `${authConfig.headers.Authorization.toString().slice(0, 20)}...` 
          : "NO HAY TOKEN",
      });
      
      const response = await $fetch(url, {
        ...authConfig,
        method: "POST" as const,
        body: formData,
        params: {
          name: nombreCarpeta,
        },
        // NO establecer Content-Type aquí - el navegador lo hace automáticamente con FormData
      });

      console.log("🟢 [RepositorioDocumentosHttp] ========================================");
      console.log("🟢 [RepositorioDocumentosHttp] RESPUESTA DE ENVÍO:");
      console.log("🟢 [RepositorioDocumentosHttp] response:", JSON.stringify(response, null, 2));
      console.log("🟢 [RepositorioDocumentosHttp] ========================================");
      console.log(`✅ [RepositorioDocumentosHttp] ${documentos.length} documentos enviados al repositorio`);
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL ENVIAR DOCUMENTOS:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] folderId:", folderId);
      console.error("🔴 [RepositorioDocumentosHttp] nombreCarpeta:", nombreCarpeta);
      console.error("🔴 [RepositorioDocumentosHttp] cantidadDocumentos:", documentos.length);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] Error message:", error?.message);
      console.error("🔴 [RepositorioDocumentosHttp] Error statusCode:", error?.statusCode);
      console.error("🔴 [RepositorioDocumentosHttp] Error status:", error?.status);
      console.error("🔴 [RepositorioDocumentosHttp] Error data:", error?.data);
      console.error("🔴 [RepositorioDocumentosHttp] Error response:", error?.response);
      console.error("🔴 [RepositorioDocumentosHttp] Error response._data:", error?.response?._data);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");

      // CÓDIGO EXACTO V2.5: Manejar error de límite de almacenamiento
      const errorMessage = error?.data?.message || error?.message || error?.response?._data?.message || "";
      if (errorMessage.includes("Upload would exceed society storage limit")) {
        throw new Error(
          "Se superó el límite de almacenamiento permitido para la sociedad."
        );
      }

      throw new Error(
        `No se pudieron enviar los documentos al repositorio: ${errorMessage || "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene todos los nodos core de una sociedad
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/nodes/core
   */
  async obtenerNodosCore(structureId: string): Promise<RepositorioNode[]> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/core`;

    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);

    try {
      const response = await $fetch<{
        success: boolean;
        data: RepositorioNodeDTO[];
      }>(url, {
        ...withAuthHeaders(),
        method: "GET" as const,
      });

      console.log("🔵 [RepositorioDocumentosHttp] Nodos obtenidos:", response.data.length);
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");

      return RepositorioNodeMapper.toEntities(response.data);
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL OBTENER NODOS CORE:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] Error message:", error?.message);
      console.error("🔴 [RepositorioDocumentosHttp] Error statusCode:", error?.statusCode);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");

      throw new Error(
        `No se pudieron obtener los nodos core: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene los nodos raíz de una sociedad (core y common)
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/nodes/root
   */
  async obtenerNodosRaiz(structureId: string): Promise<RepositorioNode[]> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/root`;

    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] OBTENER NODOS RAÍZ");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);

    try {
      const response = await $fetch<{
        success: boolean;
        data: RepositorioNodeDTO[];
      }>(url, {
        ...withAuthHeaders(),
        method: "GET" as const,
      });

      console.log("🔵 [RepositorioDocumentosHttp] Nodos raíz obtenidos:", response.data.length);
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");

      return RepositorioNodeMapper.toEntities(response.data);
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL OBTENER NODOS RAÍZ:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");

      throw new Error(
        `No se pudieron obtener los nodos raíz: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene un nodo específico por su ID (incluye hijos si es carpeta)
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/nodes/:nodeId
   */
  async obtenerNodoPorId(nodeId: string): Promise<RepositorioNode | null> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/nodes/${nodeId}`;

    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] OBTENER NODO POR ID");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] nodeId:", nodeId);

    try {
      const response = await $fetch<{
        success: boolean;
        data: RepositorioNodeDTO;
      }>(url, {
        ...withAuthHeaders(),
        method: "GET" as const,
      });

      console.log("🔵 [RepositorioDocumentosHttp] Nodo obtenido:", {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        childrenCount: response.data.children?.length || 0,
        hasDocumentVersions: Boolean(response.data.documentVersions),
        documentVersionsCount: response.data.documentVersions?.length || 0,
        hasVersions: Boolean(response.data.versions),
        versionsCount: response.data.versions?.length || 0,
        mimeType: response.data.mimeType,
        sizeInBytes: response.data.sizeInBytes,
      });
      
      // Log detallado de documentVersions si existe
      if (response.data.documentVersions && response.data.documentVersions.length > 0) {
        console.log("🔵 [RepositorioDocumentosHttp] documentVersions encontradas:", response.data.documentVersions);
      }
      
      // Log detallado de versions si existe
      if (response.data.versions && response.data.versions.length > 0) {
        console.log("🔵 [RepositorioDocumentosHttp] versions encontradas:", response.data.versions);
      }
      
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");

      return RepositorioNodeMapper.toEntity(response.data);
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL OBTENER NODO:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] nodeId:", nodeId);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] Error message:", error?.message);
      console.error("🔴 [RepositorioDocumentosHttp] Error statusCode:", error?.statusCode);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");

      throw new Error(
        `No se pudo obtener el nodo: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Descarga una versión de documento
   * 
   * ENDPOINT V2: GET /api/v2/repository/documents/versions/:versionCode/download
   */
  async descargarVersion(versionCode: string): Promise<Blob> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/documents/versions/${versionCode}/download`;

    console.log("🔵 [RepositorioDocumentosHttp] Descargando versión:", versionCode);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...withAuthHeaders().headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] Error al descargar versión:", error);
      throw new Error(
        `No se pudo descargar el documento: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Elimina un nodo (documento o carpeta)
   * 
   * ENDPOINT V2: DELETE /api/v2/repository/nodes/:nodeId
   */
  async eliminarNodo(nodeId: number): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/nodes/${nodeId}`;

    console.log("🔵 [RepositorioDocumentosHttp] Eliminando nodo:", nodeId);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          ...withAuthHeaders().headers,
        },
      });

      if (response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar nodo");
      }
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] Error al eliminar nodo:", error);
      throw new Error(
        `No se pudo eliminar el nodo: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Descarga una carpeta completa como ZIP
   * 
   * ENDPOINT V2: GET /api/v2/repository/nodes/:nodeId/download-zip
   */
  async descargarCarpetaZip(nodeId: number): Promise<Blob> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/nodes/${nodeId}/download-zip`;

    console.log("🔵 [RepositorioDocumentosHttp] Descargando carpeta ZIP:", nodeId);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...withAuthHeaders().headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al descargar ZIP: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] Error al descargar ZIP:", error);
      throw new Error(
        `No se pudo descargar la carpeta: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Sube un archivo a una carpeta
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents
   */
  async subirArchivo(
    structureId: string,
    parentNodeId: string,
    file: File
  ): Promise<RepositorioNode> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/documents`;

    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] SUBIR ARCHIVO");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔵 [RepositorioDocumentosHttp] parentNodeId:", parentNodeId);
    console.log("🔵 [RepositorioDocumentosHttp] fileName:", file.name);
    console.log("🔵 [RepositorioDocumentosHttp] fileSize:", file.size);

    try {
      // Crear FormData
      const formData = new FormData();
      // El backend espera el archivo con un UUID como nombre del campo
      const fileFieldUUID = window.crypto.randomUUID();
      formData.append(fileFieldUUID, file);

      // Headers con autenticación
      const authHeaders = withAuthHeaders();
      const headers: Record<string, string> = {
        ...authHeaders.headers,
        "x-file-size": file.size.toString(),
      };

      // No incluir Content-Type, el navegador lo establecerá automáticamente con el boundary
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 [RepositorioDocumentosHttp] Error response:", errorText);
        throw new Error(`Error al subir archivo: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("🔵 [RepositorioDocumentosHttp] Respuesta:", responseData);

      // El backend devuelve { success: true, data: RepositorioNodeDTO }
      if (responseData.success && responseData.data) {
        const nodo = RepositorioNodeMapper.toEntity(responseData.data);
        console.log("🟢 [RepositorioDocumentosHttp] Archivo subido exitosamente:", {
          id: nodo.id,
          name: nodo.name,
        });
        console.log("🔵 [RepositorioDocumentosHttp] ========================================");
        return nodo;
      }

      throw new Error("La respuesta del servidor no contiene los datos esperados");
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL SUBIR ARCHIVO:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      throw new Error(
        `No se pudo subir el archivo: ${error?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Sube múltiples archivos a una carpeta
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core
   */
  async subirMultiplesArchivos(
    structureId: string,
    parentNodeId: string,
    files: File[]
  ): Promise<RepositorioNode[]> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/core`;

    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] SUBIR MÚLTIPLES ARCHIVOS");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔵 [RepositorioDocumentosHttp] parentNodeId:", parentNodeId);
    console.log("🔵 [RepositorioDocumentosHttp] filesCount:", files.length);

    try {
      // Crear FormData
      const formData = new FormData();
      
      // Agregar todos los archivos con el mismo nombre de campo "file"
      files.forEach((file) => {
        formData.append("file", file);
      });

      // Headers con autenticación
      const authHeaders = withAuthHeaders();
      const headers: Record<string, string> = {
        ...authHeaders.headers,
      };

      // No incluir Content-Type, el navegador lo establecerá automáticamente con el boundary
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 [RepositorioDocumentosHttp] Error response:", errorText);
        throw new Error(`Error al subir archivos: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("🔵 [RepositorioDocumentosHttp] Respuesta:", responseData);

      // El backend puede devolver un array de nodos o un objeto con data
      let nodosDTO: RepositorioNodeDTO[] = [];
      
      if (Array.isArray(responseData.data)) {
        nodosDTO = responseData.data;
      } else if (responseData.data && Array.isArray(responseData.data.nodes)) {
        nodosDTO = responseData.data.nodes;
      } else if (responseData.success && responseData.data) {
        // Si solo hay un nodo, puede venir como objeto único
        nodosDTO = [responseData.data];
      }

      const nodos = nodosDTO.map((dto) => RepositorioNodeMapper.toEntity(dto));
      
      console.log("🟢 [RepositorioDocumentosHttp] Archivos subidos exitosamente:", {
        count: nodos.length,
        nodos: nodos.map((n) => ({ id: n.id, name: n.name })),
      });
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");
      
      return nodos;
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL SUBIR ARCHIVOS:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      throw new Error(
        `No se pudieron subir los archivos: ${error?.message || "Error desconocido"}`
      );
    }
  }
}

