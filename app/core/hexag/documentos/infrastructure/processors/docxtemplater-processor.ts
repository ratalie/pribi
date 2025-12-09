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
    console.log("🔧 [DocxtemplaterProcessor] Iniciando procesamiento...", {
      templateSize: templateBlob.size,
      dataKeys: Object.keys(data),
      hasEncabezado: !!data.encabezado,
      hasInstalacion: !!data.instalacion,
    });

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
    console.log("📝 [DocxtemplaterProcessor] Datos a inyectar:", {
      encabezado: data.encabezado,
      instalacion: {
        asistenciaCount: data.instalacion?.asistencia?.length || 0,
        presidente: data.instalacion?.presidente,
        secretario: data.instalacion?.secretario,
      },
    });
    
    // Log completo de los datos para debug
    console.log("📋 [DocxtemplaterProcessor] Datos completos (JSON):", JSON.stringify(data, null, 2));

    doc.setData(data);
    
    try {
      doc.render();
      console.log("✅ [DocxtemplaterProcessor] Template renderizado exitosamente");
    } catch (error: any) {
      console.error("❌ [DocxtemplaterProcessor] Error al renderizar template:", error);
      if (error.properties) {
        console.error("❌ [DocxtemplaterProcessor] Propiedades del error:", error.properties);
      }
      throw error;
    }

    // 5. Generar documento final
    const buffer = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    console.log("✅ [DocxtemplaterProcessor] Documento generado:", {
      blobSize: buffer.size,
    });

    return buffer as Blob;
  }
}

