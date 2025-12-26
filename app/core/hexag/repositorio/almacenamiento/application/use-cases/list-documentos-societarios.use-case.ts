import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';

/**
 * Caso de uso: Listar documentos societarios
 */
export class ListDocumentosSocietariosUseCase {
  constructor(private readonly repository: AlmacenamientoRepository) {}

  async execute(sociedadId: string, parentId: string | null = null): Promise<DocumentoSocietario[]> {
    return this.repository.listDocumentos(sociedadId, parentId);
  }
}

