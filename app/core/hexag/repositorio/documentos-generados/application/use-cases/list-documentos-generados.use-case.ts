import type { DocumentosGeneradosRepository } from '../../domain/ports/documentos-generados.repository';
import type { DocumentosGenerados } from '../../domain/entities/categoria-documentos.entity';

/**
 * Caso de uso: Listar documentos generados
 */
export class ListDocumentosGeneradosUseCase {
  constructor(private readonly repository: DocumentosGeneradosRepository) {}

  async execute(sociedadId: string): Promise<DocumentosGenerados> {
    return this.repository.getDocumentosGenerados(sociedadId);
  }
}

