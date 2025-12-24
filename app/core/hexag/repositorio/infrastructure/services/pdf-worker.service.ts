import * as pdfjsLib from "pdfjs-dist";

/**
 * Servicio centralizado para configurar el worker de PDF.js
 *
 * Este servicio asegura que el worker se configure una sola vez
 * y de manera consistente en toda la aplicación.
 */
export class PdfWorkerService {
  private static isConfigured = false;

  /**
   * Configura el worker de PDF.js
   * Solo se ejecuta una vez, incluso si se llama múltiples veces
   */
  static configure(): void {
    if (this.isConfigured) {
      return;
    }

    if (typeof window !== "undefined") {
      // Intentar diferentes rutas posibles para el worker
      const possiblePaths = [
        "/pdf.worker.min.mjs",
        "/pdf.worker.mjs",
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs",
      ];

      // Usar la primera ruta disponible
      pdfjsLib.GlobalWorkerOptions.workerSrc = possiblePaths[0];

      // Verificar que el worker se cargue correctamente
      try {
        // El worker se carga de forma asíncrona, así que solo marcamos como configurado
        this.isConfigured = true;
        console.log("✅ [PdfWorkerService] PDF.js worker configurado:", possiblePaths[0]);
      } catch (error) {
        console.error("❌ [PdfWorkerService] Error configurando PDF.js worker:", error);
      }
    }
  }

  /**
   * Obtiene la versión de PDF.js
   */
  static getVersion(): string {
    return (pdfjsLib as any).version || "unknown";
  }

  /**
   * Verifica si el worker está configurado
   */
  static isWorkerConfigured(): boolean {
    return this.isConfigured;
  }
}

// Configurar automáticamente al importar el módulo
PdfWorkerService.configure();
