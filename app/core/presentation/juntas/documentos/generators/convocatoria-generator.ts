import { useConvocatoria } from "../composables/useConvocatoria";
import { DocxtemplaterProcessor } from "~/core/hexag/documentos/infrastructure/processors/docxtemplater-processor";
import { TemplateHttpRepository } from "~/core/hexag/documentos/infrastructure/repositories/template.http.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { TipoDocumento } from "~/core/hexag/documentos/domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "~/core/hexag/documentos/domain/enums/categoria-documento.enum";

/**
 * Generador de Convocatoria
 *
 * Genera la convocatoria para Junta General (no aplica para Junta Universal)
 */
export class ConvocatoriaGenerator {
  /**
   * Genera la convocatoria
   * @returns Blob del documento generado o null si no aplica
   */
  static async generate(): Promise<Documento | null> {
    const { variablesTemplate, necesitaConvocatoria } = useConvocatoria();

    // Solo generar si es Junta General
    if (!necesitaConvocatoria.value) {
      console.log("ℹ️ [ConvocatoriaGenerator] No se genera convocatoria para Junta Universal");
      return null;
    }

    const vars = variablesTemplate.value;
    if (!vars) {
      throw new Error("No hay datos suficientes para generar la convocatoria");
    }

    console.log("📋 [ConvocatoriaGenerator] Variables:", {
      registered_name: vars.registered_name,
      date_convocatoria: vars.date_convocatoria,
      hasSegundaConvocatoria: !!vars.newDate,
    });

    // 1. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate(
      "no-punto/convocatoria.docx"
    );

    // 2. Procesar template con datos
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, vars);

    // 3. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: `convocatoria-${
        vars.date_convocatoria?.replace(/\s+/g, "-") || "junta-general"
      }.docx`,
      tipo: TipoDocumento.CONVOCATORIA,
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
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}

