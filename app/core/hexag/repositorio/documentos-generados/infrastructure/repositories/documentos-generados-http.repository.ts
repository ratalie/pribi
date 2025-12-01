import type { DocumentosGeneradosRepository } from '../../domain/ports/documentos-generados.repository';
import type { DocumentosGenerados } from '../../domain/entities/categoria-documentos.entity';
import type { DocumentoGenerado } from '../../domain/entities/documento-generado.entity';
import { withAuthHeaders } from '~/lib/api-client';

/**
 * Repositorio HTTP para Documentos Generados
 */
export class DocumentosGeneradosHttpRepository implements DocumentosGeneradosRepository {
  async getDocumentosGenerados(sociedadId: string): Promise<DocumentosGenerados> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/documentos-generados`,
      {
        ...withAuthHeaders(),
      }
    );
    // TODO: Agregar mapper cuando esté definido
    return response.data as DocumentosGenerados;
  }

  async getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoGenerado | null> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/documentos-generados/${documentoId}`,
      {
        ...withAuthHeaders(),
      }
    );
    return response.data ? (response.data as DocumentoGenerado) : null;
  }
}

