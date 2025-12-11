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
   * ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}
   * Este endpoint obtiene o crea automáticamente la carpeta con el nombre especificado
   * 
   * @param folderName Nombre opcional de la carpeta. Si se proporciona, el backend crea/obtiene la carpeta con ese nombre.
   *                   Si no se proporciona, usa flowId.toString() como nombre.
   */
  async obtenerFolderIdJunta(structureId: string, flowId: string, folderName?: string): Promise<number> {
    const baseUrl = this.resolveBaseUrl();
    let url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder`;
    
    // Si se proporciona folderName, agregarlo como query parameter
    if (folderName) {
      url += `?folderName=${encodeURIComponent(folderName)}`;
    }
    
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] OBTENER FOLDER ID JUNTA (ENDPOINT V2)");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔵 [RepositorioDocumentosHttp] flowId:", flowId);
    console.log("🔵 [RepositorioDocumentosHttp] folderName:", folderName || "(usando flowId)");
    
    try {
      console.log("🔵 [RepositorioDocumentosHttp] Obteniendo/creando carpeta de junta...");
      
      // ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder?folderName={nombre}
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
        folderNameSolicitado: folderName || "flowId",
        folderNameObtenido: response.data.name,
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
   * Envía documentos al repositorio directamente a la carpeta de la junta
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
   * 
   * IMPORTANTE: Usamos `/documents` en lugar de `/core` porque:
   * - `/core` SIEMPRE crea una subcarpeta (incluso sin el parámetro `name`)
   * - `/documents` sube archivos DIRECTAMENTE a la carpeta sin crear subcarpetas
   * 
   * CÓDIGO EXACTO DE V2.5:
   * - FormData con key = "file" (no file.size.toString())
   * - Usa getCorrectMimeType() para MIME types
   */
  async enviarDocumentos(
    structureId: string,
    folderId: number,
    documentos: Documento[]
  ): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents`;
    
    console.log("🟢 [RepositorioDocumentosHttp] ========================================");
    console.log("🟢 [RepositorioDocumentosHttp] ENVIAR DOCUMENTOS (CÓDIGO V2.5)");
    console.log("🟢 [RepositorioDocumentosHttp] ========================================");
    console.log("🟢 [RepositorioDocumentosHttp] URL:", url);
    console.log("🟢 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🟢 [RepositorioDocumentosHttp] folderId:", folderId, typeof folderId);
    console.log("🟢 [RepositorioDocumentosHttp] cantidadDocumentos:", documentos.length);
    console.log("🟢 [RepositorioDocumentosHttp] NOTA: Subiendo directamente a la carpeta de la junta (sin crear subcarpeta)");
    
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

      // ENDPOINT /documents: Solo acepta UN archivo por request
      // Necesitamos hacer múltiples requests, uno por cada archivo
      console.log("🟢 [RepositorioDocumentosHttp] El endpoint /documents acepta un archivo por request");
      console.log("🟢 [RepositorioDocumentosHttp] Haciendo", files.length, "requests (uno por archivo)...");
      
      const authConfig = withAuthHeaders();
      const resultados: any[] = [];
      const errores: any[] = [];

      // Subir cada archivo individualmente
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`🟢 [RepositorioDocumentosHttp] Subiendo archivo ${i + 1}/${files.length}: ${file.name}`);
        
        try {
          // Crear FormData para un solo archivo
          const formData = new FormData();
          const fileFieldUUID = window.crypto.randomUUID();
          formData.append(fileFieldUUID, file);

          // Headers para /documents (similar a subirArchivo)
          const headers: Record<string, string> = {
            ...authConfig.headers,
            "x-file-size": file.size.toString(),
          };

          const response = await fetch(url, {
            method: "POST",
            headers,
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`🔴 [RepositorioDocumentosHttp] Error al subir ${file.name}:`, errorText);
            errores.push({ archivo: file.name, error: response.statusText });
            continue;
          }

          const responseData = await response.json();
          console.log(`✅ [RepositorioDocumentosHttp] Archivo ${i + 1}/${files.length} subido:`, file.name);
          resultados.push(responseData);
        } catch (error: any) {
          console.error(`🔴 [RepositorioDocumentosHttp] Error al subir ${file.name}:`, error);
          errores.push({ archivo: file.name, error: error.message });
        }
      }

      console.log("🟢 [RepositorioDocumentosHttp] ========================================");
      console.log("🟢 [RepositorioDocumentosHttp] RESUMEN DE SUBIDA:");
      console.log("🟢 [RepositorioDocumentosHttp] Exitosos:", resultados.length);
      console.log("🟢 [RepositorioDocumentosHttp] Errores:", errores.length);
      console.log("🟢 [RepositorioDocumentosHttp] ========================================");

      // Si hay errores, lanzar excepción
      if (errores.length > 0) {
        const mensajeErrores = errores.map(e => `${e.archivo}: ${e.error}`).join(", ");
        throw new Error(`Error al subir algunos documentos: ${mensajeErrores}`);
      }

      // Si no se subió ningún archivo, lanzar error
      if (resultados.length === 0) {
        throw new Error("No se pudo subir ningún documento");
      }

      console.log(`✅ [RepositorioDocumentosHttp] ${resultados.length} documentos enviados al repositorio`);
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL ENVIAR DOCUMENTOS:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] folderId:", folderId);
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
  /**
   * Actualiza un nodo (renombrar carpeta, cambiar metadata)
   * 
   * ENDPOINT V2: PATCH /api/v2/repository/nodes/:nodeId
   */
  async actualizarNodo(
    nodeId: number,
    updates: {
      name?: string;
      description?: string;
      parentId?: number;
    }
  ): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/nodes/${nodeId}`;
    
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] ACTUALIZAR NODO");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] nodeId:", nodeId);
    console.log("🔵 [RepositorioDocumentosHttp] updates:", updates);
    
    try {
      const response = await $fetch(url, {
        ...withAuthHeaders(),
        method: "PATCH" as const,
        body: updates,
      });

      console.log("✅ [RepositorioDocumentosHttp] Nodo actualizado exitosamente");
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL ACTUALIZAR NODO:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] nodeId:", nodeId);
      console.error("🔴 [RepositorioDocumentosHttp] updates:", updates);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      
      throw new Error(
        `No se pudo actualizar el nodo: ${error?.message || error?.data?.message || "Error desconocido"}`
      );
    }
  }

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
  /**
   * Crea una carpeta en el repositorio
   * 
   * ENDPOINT V2: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder
   */
  async crearCarpeta(
    structureId: string,
    parentNodeId: number,
    nombre: string,
    description?: string
  ): Promise<RepositorioNode> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/folder`;
    
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] CREAR CARPETA");
    console.log("🔵 [RepositorioDocumentosHttp] ========================================");
    console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔵 [RepositorioDocumentosHttp] parentNodeId:", parentNodeId);
    console.log("🔵 [RepositorioDocumentosHttp] nombre:", nombre);
    console.log("🔵 [RepositorioDocumentosHttp] description:", description);
    
    try {
      const response = await $fetch<{
        success: boolean;
        data: RepositorioNodeDTO;
        message?: string;
        code?: number;
      }>(url, {
        ...withAuthHeaders(),
        method: "POST" as const,
        body: {
          name: nombre,
          description: description || null,
        },
      });

      console.log("🔵 [RepositorioDocumentosHttp] ========================================");
      console.log("🔵 [RepositorioDocumentosHttp] RESPUESTA:");
      console.log("🔵 [RepositorioDocumentosHttp] response:", JSON.stringify(response, null, 2));
      console.log("🔵 [RepositorioDocumentosHttp] ========================================");

      if (!response || !response.data) {
        throw new Error("La respuesta del servidor no contiene los datos esperados");
      }

      const carpeta = RepositorioNodeMapper.toEntity(response.data);
      console.log("✅ [RepositorioDocumentosHttp] Carpeta creada exitosamente:", {
        id: carpeta.id,
        name: carpeta.name,
        path: carpeta.path,
      });

      return carpeta;
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL CREAR CARPETA:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] parentNodeId:", parentNodeId);
      console.error("🔴 [RepositorioDocumentosHttp] nombre:", nombre);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      
      throw new Error(
        `No se pudo crear la carpeta: ${error?.message || error?.data?.message || "Error desconocido"}`
      );
    }
  }

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

  /**
   * Verifica si un documento con un nombre específico ya existe en una carpeta
   * 
   * ENDPOINT V2: GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check?fileName={nombre}
   */
  async verificarDocumentoDuplicado(
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
  }> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/documents/check?fileName=${encodeURIComponent(fileName)}`;

    console.log("🔍 [RepositorioDocumentosHttp] ========================================");
    console.log("🔍 [RepositorioDocumentosHttp] VERIFICAR DOCUMENTO DUPLICADO");
    console.log("🔍 [RepositorioDocumentosHttp] ========================================");
    console.log("🔍 [RepositorioDocumentosHttp] URL:", url);
    console.log("🔍 [RepositorioDocumentosHttp] structureId:", structureId);
    console.log("🔍 [RepositorioDocumentosHttp] folderId:", folderId);
    console.log("🔍 [RepositorioDocumentosHttp] fileName:", fileName);

    try {
      const response = await $fetch<{
        success: boolean;
        code: number;
        message: string;
        data: {
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
        };
      }>(url, {
        ...withAuthHeaders(),
        method: "GET" as const,
      });

      console.log("🔍 [RepositorioDocumentosHttp] ========================================");
      console.log("🔍 [RepositorioDocumentosHttp] RESPUESTA:");
      console.log("🔍 [RepositorioDocumentosHttp] exists:", response.data.exists);
      console.log("🔍 [RepositorioDocumentosHttp] document:", response.data.document);
      console.log("🔍 [RepositorioDocumentosHttp] ========================================");

      return response.data;
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL VERIFICAR DUPLICADO:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] structureId:", structureId);
      console.error("🔴 [RepositorioDocumentosHttp] folderId:", folderId);
      console.error("🔴 [RepositorioDocumentosHttp] fileName:", fileName);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");

      throw new Error(
        `No se pudo verificar el documento duplicado: ${error?.message || error?.data?.message || "Error desconocido"}`
      );
    }
  }

  /**
   * Sube una nueva versión de un documento existente
   * 
   * ENDPOINT V2: POST /api/v2/repository/documents/:documentCode/versions
   */
  async subirNuevaVersion(
    documentCode: string,
    file: File
  ): Promise<{
    versionCode: string;
    documentCode: string;
    versionNumber: number;
    title: string;
    sizeInBytes: number;
    createdAt: string;
  }> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/documents/${documentCode}/versions`;

    console.log("🟡 [RepositorioDocumentosHttp] ========================================");
    console.log("🟡 [RepositorioDocumentosHttp] SUBIR NUEVA VERSIÓN");
    console.log("🟡 [RepositorioDocumentosHttp] ========================================");
    console.log("🟡 [RepositorioDocumentosHttp] URL:", url);
    console.log("🟡 [RepositorioDocumentosHttp] documentCode:", documentCode);
    console.log("🟡 [RepositorioDocumentosHttp] fileName:", file.name);
    console.log("🟡 [RepositorioDocumentosHttp] fileSize:", file.size);

    try {
      const formData = new FormData();
      const fileFieldUUID = window.crypto.randomUUID();
      formData.append(fileFieldUUID, file);

      const authConfig = withAuthHeaders();
      const headers: Record<string, string> = {
        ...authConfig.headers,
        "x-file-size": file.size.toString(),
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 [RepositorioDocumentosHttp] Error response:", errorText);
        throw new Error(`Error al subir nueva versión: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("🟡 [RepositorioDocumentosHttp] ========================================");
      console.log("🟡 [RepositorioDocumentosHttp] RESPUESTA:");
      console.log("🟡 [RepositorioDocumentosHttp] responseData:", responseData);
      console.log("🟡 [RepositorioDocumentosHttp] ========================================");

      if (responseData.success && responseData.data) {
        const version = responseData.data.documentVersion || responseData.data;
        return {
          versionCode: version.versionCode,
          documentCode: version.documentCode,
          versionNumber: version.versionNumber,
          title: version.title,
          sizeInBytes: version.sizeInBytes,
          createdAt: version.createdAt,
        };
      }

      throw new Error("La respuesta del servidor no contiene los datos esperados");
    } catch (error: any) {
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      console.error("🔴 [RepositorioDocumentosHttp] ERROR AL SUBIR NUEVA VERSIÓN:");
      console.error("🔴 [RepositorioDocumentosHttp] URL:", url);
      console.error("🔴 [RepositorioDocumentosHttp] documentCode:", documentCode);
      console.error("🔴 [RepositorioDocumentosHttp] Error completo:", error);
      console.error("🔴 [RepositorioDocumentosHttp] ========================================");
      throw new Error(
        `No se pudo subir la nueva versión: ${error?.message || "Error desconocido"}`
      );
    }
  }
}

