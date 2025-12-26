import type { Documento } from "../../domain/entities/documento.entity";
import { TipoDocumento } from "../../domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "../../domain/enums/categoria-documento.enum";
import { ConvocatoriaDataMapper } from "../../infrastructure/mappers/convocatoria-data.mapper";
import { TemplateHttpRepository } from "../../infrastructure/repositories/template.http.repository";
import { DocxtemplaterProcessor } from "../../infrastructure/processors/docxtemplater-processor";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Generar Convocatoria
 */
export class GenerateConvocatoriaUseCase {
  async execute(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): Promise<Documento> {
    // 1. Mapear datos
    const convocatoriaData = ConvocatoriaDataMapper.map(downloadData, razonSocial, ruc);

    // 2. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate("no-punto/convocatoria.docx");

    // 3. Procesar template
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, convocatoriaData);

    // 4. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: `convocatoria-${downloadData.meetingDetails.meetingTypeFormatted.toLowerCase().replace(/\s+/g, "-")}.docx`,
      tipo: TipoDocumento.CONVOCATORIA,
      categoria: CategoriaDocumento.DETALLES_JUNTA,
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



