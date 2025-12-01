import type { DocumentosGenerados } from '../entities/categoria-documentos.entity';
import type { DocumentoGenerado } from '../entities/documento-generado.entity';

/**
 * Puerto (contrato) para el repositorio de Documentos Generados
 */
export interface DocumentosGeneradosRepository {
  /**
   * Obtiene la estructura completa de documentos generados para una sociedad
   */
  getDocumentosGenerados(sociedadId: string): Promise<DocumentosGenerados>;

  /**
   * Obtiene un documento generado por ID
   */
  getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoGenerado | null>;
}

