import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';

/**
 * Caso de uso: Obtener un documento societario
 */
export class GetDocumentoSocietarioUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null> {
    return this.repository.getDocumento(sociedadId, documentoId);
  }
}

