import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
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
      
      const response = await $fetch(url, {
        ...withAuthHeaders(),
        method: "POST" as const,
        body: formData,
        params: {
          name: nombreCarpeta,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
}

