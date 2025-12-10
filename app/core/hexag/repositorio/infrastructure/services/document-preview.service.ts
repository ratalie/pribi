import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import VueOfficePptx from "@vue-office/pptx";

/**
 * Servicio para previsualizar documentos
 * Soporta: PDF, DOCX, XLSX, PPTX
 */
export class DocumentPreviewService {
  /**
   * Configurar el worker de PDF.js
   */
  static configurePdfWorker() {
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
  }

  /**
   * Previsualizar un documento según su tipo MIME
   */
  static async previewDocument(
    blob: Blob,
    mimeType: string
  ): Promise<{ type: "image" | "html" | "canvas"; content: string | HTMLCanvasElement }> {
    console.log("🟡 [DocumentPreviewService] ========================================");
    console.log("🟡 [DocumentPreviewService] PREVIEW DOCUMENT");
    console.log("🟡 [DocumentPreviewService] ========================================");
    console.log("🟡 [DocumentPreviewService] mimeType:", mimeType);
    console.log("🟡 [DocumentPreviewService] blob size:", blob.size, "bytes");
    
    this.configurePdfWorker();

    if (mimeType === "application/pdf") {
      console.log("🟢 [DocumentPreviewService] Procesando como PDF...");
      return await this.previewPdf(blob);
    } else if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("🟢 [DocumentPreviewService] Procesando como Word (DOCX)...");
      return await this.previewWord(blob);
    } else if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      console.log("🟢 [DocumentPreviewService] Procesando como Excel (XLSX)...");
      return await this.previewExcel(blob);
    } else if (
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      console.log("🟢 [DocumentPreviewService] Procesando como PowerPoint (PPTX)...");
      return await this.previewPowerPoint(blob);
    } else if (mimeType.startsWith("image/")) {
      console.log("🟢 [DocumentPreviewService] Procesando como imagen...");
      return await this.previewImage(blob);
    } else {
      console.error("❌ [DocumentPreviewService] Tipo de archivo no soportado:", mimeType);
      throw new Error(`Tipo de archivo no soportado: ${mimeType}`);
    }
  }

  /**
   * Previsualizar PDF
   */
  private static async previewPdf(blob: Blob): Promise<{ type: "canvas"; content: HTMLCanvasElement }> {
    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    // Renderizar primera página
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No se pudo obtener el contexto del canvas");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return { type: "canvas", content: canvas };
  }

  /**
   * Previsualizar Word (DOCX)
   */
  private static async previewWord(
    blob: Blob
  ): Promise<{ type: "html"; content: string }> {
    console.log("🟡 [DocumentPreviewService] Iniciando conversión de Word a HTML...");
    try {
      const arrayBuffer = await blob.arrayBuffer();
      console.log("🟢 [DocumentPreviewService] ArrayBuffer obtenido, tamaño:", arrayBuffer.byteLength);
      
      const result = await mammoth.convertToHtml({ arrayBuffer });
      console.log("🟢 [DocumentPreviewService] Conversión completada, HTML length:", result.value.length);
      
      if (result.messages && result.messages.length > 0) {
        console.warn("⚠️ [DocumentPreviewService] Mensajes de conversión:", result.messages);
      }

      // Limpiar HTML
      let html = result.value;
      html = this.sanitizeHtml(html);
      console.log("🟢 [DocumentPreviewService] HTML sanitizado, length:", html.length);

      return { type: "html", content: html };
    } catch (error: any) {
      console.error("❌ [DocumentPreviewService] Error al convertir Word:", error);
      throw new Error(`Error al convertir Word a HTML: ${error?.message || "Error desconocido"}`);
    }
  }

  /**
   * Previsualizar Excel (XLSX)
   */
  private static async previewExcel(
    blob: Blob
  ): Promise<{ type: "html"; content: string }> {
    const arrayBuffer = await blob.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Convertir primera hoja a HTML
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const html = XLSX.utils.sheet_to_html(worksheet);

    return { type: "html", content: html };
  }

  /**
   * Previsualizar PowerPoint (PPTX)
   * Nota: @vue-office/pptx requiere un componente Vue, así que retornamos HTML básico
   */
  private static async previewPowerPoint(
    blob: Blob
  ): Promise<{ type: "html"; content: string }> {
    // Por ahora, mostrar mensaje de que se requiere componente Vue
    const html = `
      <div style="padding: 20px; text-align: center;">
        <p>La previsualización de PowerPoint requiere un componente especial.</p>
        <p>Por favor, descarga el archivo para verlo.</p>
      </div>
    `;
    return { type: "html", content: html };
  }

  /**
   * Previsualizar imagen
   */
  private static async previewImage(
    blob: Blob
  ): Promise<{ type: "image"; content: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ type: "image", content: reader.result as string });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Limpiar HTML para evitar problemas con html2canvas
   */
  private static sanitizeHtml(html: string): string {
    // Eliminar funciones de color no soportadas
    html = html.replace(/color:\s*var\([^)]+\)/gi, "");
    // Limpiar estilos problemáticos
    html = html.replace(/style="[^"]*"/gi, (match) => {
      return match.replace(/color:\s*var\([^)]+\)/gi, "");
    });
    return html;
  }
}

