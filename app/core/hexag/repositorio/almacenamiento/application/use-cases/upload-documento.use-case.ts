import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';
import type { UploadDocumentoDTO } from '../dtos/documento-societario.dto';

/**
 * Caso de uso: Subir un documento
 */
export class UploadDocumentoUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, dto: UploadDocumentoDTO): Promise<DocumentoSocietario> {
    return this.repository.uploadDocumento(sociedadId, dto.file, dto.parentId);
  }
}

