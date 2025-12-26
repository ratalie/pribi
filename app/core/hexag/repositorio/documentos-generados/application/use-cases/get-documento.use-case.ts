import type { DocumentosGeneradosRepository } from '../../domain/ports/documentos-generados.repository';
import type { DocumentoGenerado } from '../../domain/entities/documento-generado.entity';

/**
 * Caso de uso: Obtener un documento generado por ID
 */
export class GetDocumentoUseCase {
  constructor(private readonly repository: DocumentosGeneradosRepository) {}

  async execute(sociedadId: string, documentoId: string): Promise<DocumentoGenerado | null> {
    return this.repository.getDocumento(sociedadId, documentoId);
  }
}

