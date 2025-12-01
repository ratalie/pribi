import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';

/**
 * Caso de uso: Descargar un documento
 */
export class DownloadDocumentoUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, documentoId: string): Promise<Blob> {
    return this.repository.downloadDocumento(sociedadId, documentoId);
  }
}

