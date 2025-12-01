import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';

/**
 * Caso de uso: Eliminar un documento
 */
export class DeleteDocumentoUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, documentoId: string): Promise<void> {
    return this.repository.deleteDocumento(sociedadId, documentoId);
  }
}

