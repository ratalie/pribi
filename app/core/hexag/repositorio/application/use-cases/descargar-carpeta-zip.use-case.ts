import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";

/**
 * Use case para descargar una carpeta completa como ZIP
 */
export class DescargarCarpetaZipUseCase {
  constructor(
    private readonly documentoRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Descarga una carpeta completa como archivo ZIP
   * @param nodeId ID de la carpeta a descargar
   * @param folderName Nombre del archivo ZIP
   */
  async execute(nodeId: number, folderName: string): Promise<void> {
    // 1. Descargar el blob ZIP
    const blob = await this.documentoRepository.descargarCarpetaZip(nodeId);

    // 2. Crear URL temporal y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`;

    // 3. Simular clic para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Limpiar URL temporal
    window.URL.revokeObjectURL(url);
  }
}


