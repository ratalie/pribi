import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";

/**
 * Use case para descargar un documento
 */
export class DescargarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Descarga un documento y lo guarda en el sistema de archivos del navegador
   * @param versionCode Código de la versión del documento
   * @param fileName Nombre del archivo para la descarga
   */
  async execute(versionCode: string, fileName: string): Promise<void> {
    // 1. Descargar el blob del documento
    const blob = await this.documentoRepository.descargarVersion(versionCode);

    // 2. Crear URL temporal y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // 3. Simular clic para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Limpiar URL temporal
    window.URL.revokeObjectURL(url);
  }
}


