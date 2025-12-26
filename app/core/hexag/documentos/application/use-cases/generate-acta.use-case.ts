import type { Documento } from "../../domain/entities/documento.entity";
import { TipoDocumento } from "../../domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "../../domain/enums/categoria-documento.enum";
import { ActaDataMapper } from "../../infrastructure/mappers/acta-data.mapper";
import { TemplateHttpRepository } from "../../infrastructure/repositories/template.http.repository";
import { DocxtemplaterProcessor } from "../../infrastructure/processors/docxtemplater-processor";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Generar Acta
 * 
 * Genera el acta principal de la junta usando el template y los datos mapeados.
 */
export class GenerateActaUseCase {
  async execute(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): Promise<Documento> {
    // 1. Mapear datos a formato de template
    const actaData = ActaDataMapper.map(downloadData, razonSocial, ruc);

    console.log("📋 [GenerateActaUseCase] Datos mapeados para template:", {
      encabezado: actaData.encabezado,
      instalacion: {
        asistenciaCount: actaData.instalacion.asistencia.length,
        presidente: actaData.instalacion.presidente,
        secretario: actaData.instalacion.secretario,
      },
      puntosAcuerdoCount: actaData.puntos_acuerdo.length,
    });

    // 2. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate("acta/acta.docx");

      // 3. Procesar template con datos
      console.log("📝 [GenerateActaUseCase] Procesando template con datos...", {
        hasTemplate: !!templateBlob,
        templateSize: templateBlob.byteLength,
        hasData: !!actaData,
        actaDataKeys: Object.keys(actaData),
      });
      
      const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, actaData);
      
      console.log("✅ [GenerateActaUseCase] Documento generado", {
        blobSize: documentoBlob.size,
        blobType: documentoBlob.type,
      });

      // 4. Crear entidad Documento
      const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: `acta-${downloadData.meetingDetails.meetingTypeFormatted.toLowerCase().replace(/\s+/g, "-")}.docx`,
      tipo: TipoDocumento.ACTA,
      categoria: CategoriaDocumento.ACTA_PRINCIPAL,
      blob: documentoBlob,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tamano: documentoBlob.size,
      tamanoLegible: this.formatFileSize(documentoBlob.size),
    };

    return documento;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }
}

