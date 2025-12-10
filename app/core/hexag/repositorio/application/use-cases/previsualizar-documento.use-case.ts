import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import { DocumentPreviewService } from "../../infrastructure/services/document-preview.service";

/**
 * Use case para previsualizar un documento
 */
export class PrevisualizarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Previsualiza un documento
   * @param versionCode Código de la versión del documento
   * @param mimeType Tipo MIME del documento
   * @returns Preview del documento (canvas, HTML o imagen)
   */
  async execute(
    versionCode: string,
    mimeType: string
  ): Promise<{ type: "image" | "html" | "canvas"; content: string | HTMLCanvasElement }> {
    // 1. Descargar el blob del documento
    const blob = await this.documentoRepository.descargarVersion(versionCode);

    // 2. Generar preview según el tipo
    return await DocumentPreviewService.previewDocument(blob, mimeType);
  }
}


