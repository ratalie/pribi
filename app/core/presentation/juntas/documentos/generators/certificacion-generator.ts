import { useCertificacion } from "../composables/useCertificacion";
import { DocxtemplaterProcessor } from "~/core/hexag/documentos/infrastructure/processors/docxtemplater-processor";
import { TemplateHttpRepository } from "~/core/hexag/documentos/infrastructure/repositories/template.http.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { TipoDocumento } from "~/core/hexag/documentos/domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "~/core/hexag/documentos/domain/enums/categoria-documento.enum";

/**
 * Generador de Certificación
 * 
 * Genera el documento de certificación de la junta
 */
export class CertificacionGenerator {
  /**
   * Genera la certificación
   * @returns Blob del documento generado
   */
  static async generate(): Promise<Documento> {
    const { variablesTemplate } = useCertificacion();

    const vars = variablesTemplate.value;
    if (!vars) {
      throw new Error("No hay datos suficientes para generar la certificación");
    }

    console.log("📋 [CertificacionGenerator] Variables:", {
      nombre_empresa: vars.nombre_empresa,
      tipo_junta: vars.tipo_junta,
      fecha_junta: vars.fecha_junta,
    });

    // 1. Obtener template
    let templateBlob: Blob;
    try {
      templateBlob = await TemplateHttpRepository.getTemplate("no-punto/certificacion.docx");
    } catch (error: any) {
      // Si no existe certificacion.docx, intentar con certificado.docx como fallback
      console.warn("⚠️ [CertificacionGenerator] Template certificacion.docx no encontrado, intentando certificado.docx...");
      try {
        templateBlob = await TemplateHttpRepository.getTemplate("no-punto/certificado.docx");
      } catch (fallbackError: any) {
        throw new Error(`No se pudo cargar el template de certificación. Verifica que exista 'certificacion.docx' o 'certificado.docx' en /public/templates/juntas/no-punto/. Error: ${fallbackError.message}`);
      }
    }

    // 2. Procesar template con datos
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, vars);

    // 3. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: `certificacion-${vars.tipo_junta?.toLowerCase().replace(/\s+/g, "-") || "junta"}.docx`,
      tipo: TipoDocumento.CERTIFICACION,
      categoria: CategoriaDocumento.DETALLES_JUNTA,
      blob: documentoBlob,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tamano: documentoBlob.size,
      tamanoLegible: this.formatFileSize(documentoBlob.size),
    };

    return documento;
  }

  /**
   * Formatea el tamaño del archivo
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }
}


