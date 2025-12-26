import type { DocumentosGeneradosRepository } from '../../domain/ports/documentos-generados.repository';
import type { DocumentosGenerados } from '../../domain/entities/categoria-documentos.entity';
import type { DocumentoGenerado } from '../../domain/entities/documento-generado.entity';
import {
  getDocumentosGeneradosMock,
  findDocumentoGeneradoMock,
} from '../mocks/data/documentos-generados.state';

/**
 * Repositorio Mock para Documentos Generados
 */
export class DocumentosGeneradosMockRepository implements DocumentosGeneradosRepository {
  async getDocumentosGenerados(sociedadId: string): Promise<DocumentosGenerados> {
    return getDocumentosGeneradosMock(sociedadId);
  }

  async getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoGenerado | null> {
    return findDocumentoGeneradoMock(sociedadId, documentoId);
  }
}

