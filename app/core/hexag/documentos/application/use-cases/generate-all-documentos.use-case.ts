import type { Documento } from "../../domain/entities/documento.entity";
import { GenerateActaUseCase } from "./generate-acta.use-case";
import { GenerateConvocatoriaUseCase } from "./generate-convocatoria.use-case";
import { GenerateMinutaUseCase } from "./generate-minuta.use-case";
import { GenerateCertificadoUseCase } from "./generate-certificado.use-case";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Generar Todos los Documentos
 * 
 * Orquestador principal que genera todos los documentos de la junta:
 * - Acta principal
 * - Convocatoria
 * - Minuta (si hay aporte dinerario)
 * - Certificados (uno por cada aportante)
 */
export class GenerateAllDocumentosUseCase {
  async execute(
    downloadData: DownloadDataDTO,
    razonSocial: string,
    ruc: string
  ): Promise<Documento[]> {
    const documentos: Documento[] = [];

    // 1. Generar Acta Principal
    console.log("[GenerateAllDocumentos] Generando acta...");
    const generateActa = new GenerateActaUseCase();
    const acta = await generateActa.execute(downloadData, razonSocial, ruc);
    documentos.push(acta);

    // 2. Generar Convocatoria
    console.log("[GenerateAllDocumentos] Generando convocatoria...");
    const generateConvocatoria = new GenerateConvocatoriaUseCase();
    const convocatoria = await generateConvocatoria.execute(downloadData, razonSocial, ruc);
    documentos.push(convocatoria);

    // 3. Generar Minuta (si hay aporte dinerario)
    if (downloadData.agendaItems.aumentoCapital.aportesDinerarios) {
      console.log("[GenerateAllDocumentos] Generando minuta...");
      const generateMinuta = new GenerateMinutaUseCase();
      const minuta = await generateMinuta.execute(downloadData);
      if (minuta) {
        documentos.push(minuta);
      }

      // 4. Generar Certificados (uno por cada aportante)
      console.log("[GenerateAllDocumentos] Generando certificados...");
      const generateCertificado = new GenerateCertificadoUseCase();
      const certificados = await generateCertificado.execute(downloadData, razonSocial, ruc);
      documentos.push(...certificados);
    }

    console.log(`[GenerateAllDocumentos] ✅ Generados ${documentos.length} documentos`);
    return documentos;
  }
}



