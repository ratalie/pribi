// @ts-ignore - Tipos no disponibles
import Docxtemplater from "docxtemplater";
// @ts-ignore - Tipos no disponibles
import PizZip from "pizzip";

/**
 * Procesador de templates Docxtemplater
 * Convierte templates .docx con datos a Blobs
 */
export class DocxtemplaterProcessor {
  /**
   * Procesa un template .docx con datos
   * @param templateBlob - Blob del template .docx
   * @param data - Datos para reemplazar en el template
   * @returns Blob del documento generado
   */
  static async process(templateBlob: Blob, data: any): Promise<Blob> {
    // 1. Convertir Blob a ArrayBuffer
    const arrayBuffer = await templateBlob.arrayBuffer();

    // 2. Cargar template con PizZip
    const zip = new PizZip(arrayBuffer);

    // 3. Crear instancia de Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 4. Reemplazar datos
    doc.setData(data);
    doc.render();

    // 5. Generar documento final
    const buffer = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return buffer as Blob;
  }
}

