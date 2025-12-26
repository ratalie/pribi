import type { Documento } from "../../domain/entities/documento.entity";
import { TipoDocumento } from "../../domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "../../domain/enums/categoria-documento.enum";
import { CertificadoDataMapper } from "../../infrastructure/mappers/certificado-data.mapper";
import { TemplateHttpRepository } from "../../infrastructure/repositories/template.http.repository";
import { DocxtemplaterProcessor } from "../../infrastructure/processors/docxtemplater-processor";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Generar Certificados (Aporte Dinerario)
 * Genera un certificado por cada aportante
 */
export class GenerateCertificadoUseCase {
  async execute(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): Promise<Documento[]> {
    // 1. Mapear datos (retorna array de certificados, uno por aportante)
    const certificadosData = CertificadoDataMapper.map(downloadData, razonSocial, ruc);
    if (certificadosData.length === 0) return [];

    // 2. Obtener template
    const templateBlob = await TemplateHttpRepository.getTemplate("punto/aporte-dinerario/certificado.docx");

    // 3. Generar certificado por cada aportante
    const certificados: Documento[] = [];

    for (const certificadoData of certificadosData) {
      // Procesar template con datos del aportante
      const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, certificadoData);

      // Crear entidad Documento
      const documento: Documento = {
        id: crypto.randomUUID(),
        nombre: `certificado-aporte-${certificadoData.aportante.dni}.docx`,
        tipo: TipoDocumento.CERTIFICADO_APORTE_DINERARIO,
        categoria: CategoriaDocumento.CERTIFICADOS,
        blob: documentoBlob,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        tamano: documentoBlob.size,
        tamanoLegible: this.formatFileSize(documentoBlob.size),
        puntoAcuerdoId: "aporte-dinerario",
        puntoAcuerdoTipo: "aporte-dinerario",
      };

      certificados.push(documento);
    }

    return certificados;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }
}



