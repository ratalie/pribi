/**
 * Servicio para generar thumbnails de documentos
 * 
 * Soporta:
 * - PDF (usando PDF.js)
 * - Imágenes (JPEG, PNG, etc.)
 * - Office (Word, Excel, PowerPoint) - usando DocumentPreviewService
 * 
 * Integra con PreviewCacheService para subir thumbnails al servidor
 */

import * as pdfjsLib from "pdfjs-dist";
import { PreviewCacheService } from "./preview-cache.service";
import { DocumentPreviewService } from "./document-preview.service";

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  page?: number; // Para PDFs, qué página renderizar (default: 1)
}

export class ThumbnailService {
  /**
   * Configurar el worker de PDF.js
   */
  private static configurePdfWorker() {
    // Usar el servicio centralizado
    import("~/core/hexag/repositorio/infrastructure/services/pdf-worker.service").then(({ PdfWorkerService }) => {
      PdfWorkerService.configure();
    });
  }

  /**
   * Genera una miniatura de un archivo PDF
   * 
   * @param file Archivo PDF
   * @param options Opciones de thumbnail
   * @returns Data URL del thumbnail
   */
  static async generatePDFThumbnail(
    file: File | Blob,
    options: ThumbnailOptions = {}
  ): Promise<string> {
    const { width = 200, height = 280, quality = 0.8, page = 1 } = options;

    try {
      this.configurePdfWorker();

      // Cargar el PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      // Obtener la página especificada
      const pdfPage = await pdf.getPage(page);

      // Crear canvas para renderizar
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("No se pudo obtener el contexto del canvas");
      }

      // Calcular escala para mantener proporción
      const viewport = pdfPage.getViewport({ scale: 1 });
      const scale = Math.min(width / viewport.width, height / viewport.height);
      const scaledViewport = pdfPage.getViewport({ scale });

      // Configurar canvas
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      // Renderizar página en canvas
      const renderTask = pdfPage.render({
        canvasContext: context,
        viewport: scaledViewport,
      });

      await renderTask.promise;

      // Convertir a base64
      return canvas.toDataURL("image/jpeg", quality);
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error generando miniatura PDF:", error);
      throw error;
    }
  }

  /**
   * Genera una miniatura de un archivo de imagen
   * 
   * @param file Archivo de imagen
   * @param options Opciones de thumbnail
   * @returns Data URL del thumbnail
   */
  static async generateImageThumbnail(
    file: File | Blob,
    options: ThumbnailOptions = {}
  ): Promise<string> {
    try {
      const { width = 200, height = 280, quality = 0.8 } = options;

      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          try {
            if (!context) {
              reject(new Error("No se pudo obtener el contexto del canvas"));
              return;
            }

            // Calcular escala para mantener proporción
            const scale = Math.min(width / img.width, height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            // Configurar canvas
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            // Dibujar imagen escalada
            context.drawImage(img, 0, 0, scaledWidth, scaledHeight);

            // Convertir a base64
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(dataUrl);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error("Error cargando imagen"));
        };

        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error generando miniatura de imagen:", error);
      throw error;
    }
  }

  /**
   * Genera una miniatura de un archivo de Office (Word, Excel, PowerPoint)
   * 
   * @param file Archivo de Office
   * @param options Opciones de thumbnail
   * @returns Data URL del thumbnail
   */
  static async generateOfficeThumbnail(
    file: File | Blob,
    options: ThumbnailOptions = {}
  ): Promise<string> {
    const { width = 200, height = 280, quality = 0.8 } = options;

    try {
      // Intentar usar DocumentPreviewService para obtener preview real
      const mimeType = file instanceof File ? file.type : "application/octet-stream";
      
      // Convertir Blob a File si es necesario
      const fileToProcess =
        file instanceof File
          ? file
          : new File([file], "document", { type: mimeType });

      // Generar preview usando DocumentPreviewService
      const preview = await DocumentPreviewService.previewDocument(
        fileToProcess,
        mimeType
      );

      // Si el preview es HTML o canvas, convertirlo a imagen
      if (preview.type === "html") {
        // Convertir HTML a imagen usando html2canvas
        const { default: html2canvas } = await import("html2canvas");
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = preview.content as string;
        tempDiv.style.width = `${width}px`;
        tempDiv.style.height = `${height}px`;
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, {
          width,
          height,
          scale: 1,
        });

        document.body.removeChild(tempDiv);

        return canvas.toDataURL("image/jpeg", quality);
      } else if (preview.type === "canvas") {
        // Si es canvas, convertir directamente
        const canvas = preview.content as HTMLCanvasElement;
        return canvas.toDataURL("image/jpeg", quality);
      } else {
        // Si es imagen, ya está lista
        return preview.content as string;
      }
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error generando miniatura de Office:", error);
      // Fallback: generar thumbnail genérico
      return this.generateGenericOfficeThumbnail(file, { width, height, quality });
    }
  }

  /**
   * Genera un thumbnail genérico para archivos de Office (fallback)
   */
  private static async generateGenericOfficeThumbnail(
    file: File | Blob,
    options: ThumbnailOptions
  ): Promise<string> {
    const { width = 200, height = 280, quality = 0.8 } = options;

    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("No se pudo obtener el contexto del canvas");
      }

      canvas.width = width;
      canvas.height = height;

      // Obtener información del archivo
      const fileName = file instanceof File ? file.name : "document";
      const fileType = file instanceof File ? file.type : "application/octet-stream";

      // Determinar el tipo de documento y color
      const docInfo = this.getOfficeDocumentInfo(fileName, fileType);

      // Dibujar fondo
      context.fillStyle = docInfo.backgroundColor;
      context.fillRect(0, 0, width, height);

      // Dibujar borde
      context.strokeStyle = docInfo.borderColor;
      context.lineWidth = 2;
      context.strokeRect(1, 1, width - 2, height - 2);

      // Dibujar icono
      const iconSize = Math.min(width, height) * 0.3;
      const iconX = (width - iconSize) / 2;
      const iconY = height * 0.2;

      context.fillStyle = docInfo.iconColor;
      context.fillRect(iconX, iconY, iconSize, iconSize * 0.8);

      // Dibujar texto del nombre del archivo
      context.fillStyle = "#333333";
      context.font = `bold ${Math.max(10, width * 0.08)}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const maxLength = Math.floor(width / 8);
      const displayName =
        fileName.length > maxLength ? fileName.substring(0, maxLength) + "..." : fileName;

      context.fillText(displayName, width / 2, height * 0.7);

      // Agregar extensión del archivo
      context.font = `${Math.max(8, width * 0.06)}px Arial`;
      context.fillStyle = "#666666";
      const extension = fileName.split(".").pop()?.toUpperCase() || "";
      context.fillText(extension, width / 2, height * 0.85);

      return canvas.toDataURL("image/jpeg", quality);
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error generando thumbnail genérico:", error);
      throw error;
    }
  }

  /**
   * Obtiene información específica del tipo de documento de Office
   */
  private static getOfficeDocumentInfo(fileName: string, fileType: string) {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    // Word documents
    if (extension === "doc" || extension === "docx" || fileType.includes("word")) {
      return {
        type: "word",
        backgroundColor: "#ffffff",
        borderColor: "#2b579a",
        iconColor: "#2b579a",
      };
    }

    // PowerPoint presentations
    if (extension === "ppt" || extension === "pptx" || fileType.includes("powerpoint")) {
      return {
        type: "powerpoint",
        backgroundColor: "#ffffff",
        borderColor: "#d24726",
        iconColor: "#d24726",
      };
    }

    // Excel spreadsheets
    if (
      extension === "xls" ||
      extension === "xlsx" ||
      fileType.includes("excel") ||
      fileType.includes("spreadsheet")
    ) {
      return {
        type: "excel",
        backgroundColor: "#ffffff",
        borderColor: "#217346",
        iconColor: "#217346",
      };
    }

    // Default
    return {
      type: "office",
      backgroundColor: "#ffffff",
      borderColor: "#666666",
      iconColor: "#666666",
    };
  }

  /**
   * Genera un thumbnail según el tipo de archivo
   * 
   * @param file Archivo a procesar
   * @param options Opciones de thumbnail
   * @returns Data URL del thumbnail
   */
  static async generateThumbnail(
    file: File | Blob,
    options: ThumbnailOptions = {}
  ): Promise<string | null> {
    try {
      const mimeType = file instanceof File ? file.type : "application/octet-stream";

      if (mimeType === "application/pdf") {
        return await this.generatePDFThumbnail(file, options);
      } else if (mimeType.startsWith("image/")) {
        return await this.generateImageThumbnail(file, options);
      } else if (
        mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("powerpoint") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("presentation")
      ) {
        return await this.generateOfficeThumbnail(file, options);
      } else {
        console.warn("⚠️ [ThumbnailService] Tipo de archivo no soportado:", mimeType);
        return null;
      }
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error generando thumbnail:", error);
      return null;
    }
  }

  /**
   * Genera un thumbnail y lo sube al servidor automáticamente
   * 
   * @param file Archivo a procesar
   * @param nodeCode UUID del nodo
   * @param options Opciones de thumbnail
   * @returns Data URL del thumbnail o null si falla
   */
  static async generateThumbnailWithCache(
    file: File | Blob,
    nodeCode: string,
    options: ThumbnailOptions = {}
  ): Promise<string | null> {
    try {
      // Generar thumbnail
      const thumbnailDataUrl = await this.generateThumbnail(file, options);

      if (!thumbnailDataUrl) {
        console.warn("⚠️ [ThumbnailService] No se pudo generar thumbnail");
        return null;
      }

      // Subir al servidor
      const uploaded = await PreviewCacheService.uploadPreview(nodeCode, thumbnailDataUrl);

      if (!uploaded) {
        console.warn("⚠️ [ThumbnailService] No se pudo subir thumbnail al servidor");
        // Retornar el thumbnail de todas formas (está en memoria)
      }

      return thumbnailDataUrl;
    } catch (error) {
      console.error("🔴 [ThumbnailService] Error en generateThumbnailWithCache:", error);
      return null;
    }
  }
}


