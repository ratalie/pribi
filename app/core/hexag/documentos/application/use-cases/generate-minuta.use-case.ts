import type { Documento } from "../../domain/entities/documento.entity";
import { TipoDocumento } from "../../domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "../../domain/enums/categoria-documento.enum";
import { MinutaDataMapper } from "../../infrastructure/mappers/minuta-data.mapper";
import { TemplateHttpRepository } from "../../infrastructure/repositories/template.http.repository";
import { DocxtemplaterProcessor } from "../../infrastructure/processors/docxtemplater-processor";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Generar Minuta (Aporte Dinerario)
 */
export class GenerateMinutaUseCase {
  async execute(downloadData: DownloadDataDTO): Promise<Documento | null> {
    // 1. Mapear datos (retorna null si no hay aporte dinerario)
    const minutaData = MinutaDataMapper.map(downloadData);
    if (!minutaData) return null;

    // 2. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate("punto/aporte-dinerario/minuta.docx");

    // 3. Procesar template
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, minutaData);

    // 4. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: "minuta-aumento-capital-aporte-dinerario.docx",
      tipo: TipoDocumento.MINUTA_APORTE_DINERARIO,
      categoria: CategoriaDocumento.POR_PUNTO,
      blob: documentoBlob,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tamano: documentoBlob.size,
      tamanoLegible: this.formatFileSize(documentoBlob.size),
      puntoAcuerdoId: "aporte-dinerario",
      puntoAcuerdoTipo: "aporte-dinerario",
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



