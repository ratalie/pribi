/**
 * Servicio para manejar el cache de previews en el servidor
 * 
 * Este servicio permite:
 * - Verificar si existe un preview en el servidor (HEAD request)
 * - Descargar un preview existente (GET request)
 * - Subir un preview al servidor (PUT request)
 * 
 * Endpoints V2:
 * - HEAD /api/v2/repository/nodes/{nodeCode}/preview
 * - GET /api/v2/repository/nodes/{nodeCode}/preview
 * - PUT /api/v2/repository/society-profile/nodes/{nodeCode}/preview
 */

import { withAuthHeaders } from "~/lib/api-client";

export class PreviewCacheService {
  /**
   * Resuelve la URL base del API
   */
  private static resolveBaseUrl(): string {
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
   * Verifica si existe un preview para un nodo
   * 
   * @param nodeCode UUID del nodo
   * @returns true si existe preview, false si no existe
   */
  static async hasPreview(nodeCode: string): Promise<boolean> {
    try {
      const baseUrl = this.resolveBaseUrl();
      const endpoint = `${baseUrl}/api/v2/repository/nodes/${nodeCode}/preview`;

      console.log("🔵 [PreviewCacheService] Verificando preview:", {
        nodeCode,
        endpoint,
        timestamp: new Date().toISOString(),
      });

      const authConfig = withAuthHeaders();
      console.log("🔵 [PreviewCacheService] Headers de autenticación:", {
        hasAuth: !!authConfig.headers,
        headerKeys: authConfig.headers ? Object.keys(authConfig.headers) : [],
        authHeaders: authConfig.headers,
      });

      const response = await fetch(endpoint, {
        method: "HEAD",
        headers: authConfig.headers,
      });

      console.log("🔵 [PreviewCacheService] Respuesta HEAD:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const hasPreview = response.status === 200;
      
      console.log("🔵 [PreviewCacheService] Preview existe:", hasPreview, "para nodeCode:", nodeCode);

      return hasPreview;
    } catch (error: any) {
      console.error("🔴 [PreviewCacheService] Error al verificar preview:", {
        error,
        message: error?.message,
        stack: error?.stack,
        nodeCode,
      });
      // Si hay error de red o 404, retornar false
      if (error.response?.status === 404 || error.status === 404) {
        console.log("🔵 [PreviewCacheService] Error 404 - preview no existe");
        return false;
      }
      return false;
    }
  }

  /**
   * Descarga un preview existente
   * 
   * @param nodeCode UUID del nodo
   * @returns Data URL del preview o null si no existe
   */
  static async downloadPreview(nodeCode: string): Promise<string | null> {
    try {
      const baseUrl = this.resolveBaseUrl();
      const endpoint = `${baseUrl}/api/v2/repository/nodes/${nodeCode}/preview`;

      console.log("🔵 [PreviewCacheService] Descargando preview:", {
        nodeCode,
        endpoint,
      });

      const authConfig = withAuthHeaders();
      console.log("🔵 [PreviewCacheService] Headers de autenticación para GET:", {
        hasAuth: !!authConfig.headers,
        headerKeys: authConfig.headers ? Object.keys(authConfig.headers) : [],
      });

      const response = await fetch(endpoint, {
        method: "GET",
        headers: authConfig.headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("🔵 [PreviewCacheService] Preview no existe (404)");
          return null;
        }
        throw new Error(`Error al descargar preview: ${response.statusText}`);
      }

      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => {
          console.error("🔴 [PreviewCacheService] Error al leer blob");
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error("🔴 [PreviewCacheService] Error al descargar preview:", error);
      if (error.response?.status === 404 || error.status === 404) {
        return null;
      }
      return null;
    }
  }

  /**
   * Sube un preview al servidor
   * 
   * @param nodeCode UUID del nodo
   * @param thumbnailDataUrl Data URL del thumbnail a subir
   * @returns true si se subió correctamente, false si hubo error
   */
  static async uploadPreview(nodeCode: string, thumbnailDataUrl: string): Promise<boolean> {
    try {
      // Convertir data URL a blob
      const response = await fetch(thumbnailDataUrl);
      const blob = await response.blob();

      // Optimizar tamaño si es necesario
      const optimizedBlob = await this.optimizeBlob(blob);

      const formData = new FormData();
      formData.append("file", optimizedBlob);

      const baseUrl = this.resolveBaseUrl();
      const endpoint = `${baseUrl}/api/v2/repository/society-profile/nodes/${nodeCode}/preview`;

      console.log("🔵 [PreviewCacheService] Subiendo preview:", {
        nodeCode,
        endpoint,
        size: optimizedBlob.size,
      });

      const authConfig = withAuthHeaders();
      console.log("🔵 [PreviewCacheService] Headers de autenticación para PUT:", {
        hasAuth: !!authConfig.headers,
        headerKeys: authConfig.headers ? Object.keys(authConfig.headers) : [],
      });

      const uploadResponse = await fetch(endpoint, {
        method: "PUT",
        headers: {
          ...authConfig.headers,
          "x-file-size": optimizedBlob.size.toString(),
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error("🔴 [PreviewCacheService] Error al subir preview:", uploadResponse.statusText);
        return false;
      }

      console.log("🟢 [PreviewCacheService] Preview subido exitosamente");
      return true;
    } catch (error) {
      console.error("🔴 [PreviewCacheService] Error al subir preview:", error);
      return false;
    }
  }

  /**
   * Optimiza un blob para cumplir con el límite de 256KB
   * 
   * @param blob Blob a optimizar
   * @returns Blob optimizado
   */
  private static async optimizeBlob(blob: Blob): Promise<Blob> {
    const maxSize = 256 * 1024; // 256 KB

    if (blob.size <= maxSize) {
      return blob;
    }

    // Crear canvas para redimensionar
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        if (!ctx) {
          reject(new Error("No se pudo obtener contexto del canvas"));
          return;
        }

        // Calcular nuevas dimensiones
        let { width, height } = img;
        const maxDimension = 400;

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Intentar diferentes calidades
        let quality = 0.8;
        canvas.toBlob(
          (result) => {
            if (result && result.size <= maxSize) {
              resolve(result);
            } else if (quality > 0.1) {
              quality -= 0.1;
              canvas.toBlob(
                (newResult) => {
                  resolve(newResult || blob);
                },
                "image/jpeg",
                quality
              );
            } else {
              resolve(blob);
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Error cargando imagen"));
      img.src = URL.createObjectURL(blob);
    });
  }
}


