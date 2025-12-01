import type { AlmacenamientoRepository } from '../../domain/ports/almacenamiento.repository';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';
import type { CarpetaSistema } from '../../domain/entities/carpeta-sistema.entity';
import { withAuthHeaders } from '~/lib/api-client';

/**
 * Repositorio HTTP para Almacenamiento
 */
export class AlmacenamientoHttpRepository implements AlmacenamientoRepository {
  async listDocumentos(sociedadId: string, parentId: string | null): Promise<DocumentoSocietario[]> {
    const params = parentId ? { parentId } : {};
    const response = await $fetch<{ data: any[] }>(
      `/api/v2/repositorio/${sociedadId}/almacenamiento/documentos`,
      {
        ...withAuthHeaders(),
        params,
      }
    );
    // TODO: Agregar mapper cuando esté definido
    return response.data as DocumentoSocietario[];
  }

  async getDocumento(sociedadId: string, documentoId: string): Promise<DocumentoSocietario | null> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/almacenamiento/documentos/${documentoId}`,
      {
        ...withAuthHeaders(),
      }
    );
    return response.data ? (response.data as DocumentoSocietario) : null;
  }

  async createCarpeta(sociedadId: string, nombre: string, parentId: string | null): Promise<CarpetaSistema> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/almacenamiento/carpetas`,
      {
        ...withAuthHeaders(),
        method: 'POST',
        body: { nombre, parentId },
      }
    );
    return response.data as CarpetaSistema;
  }

  async uploadDocumento(sociedadId: string, file: File, parentId: string | null): Promise<DocumentoSocietario> {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) {
      formData.append('parentId', parentId);
    }

    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/almacenamiento/documentos/upload`,
      {
        ...withAuthHeaders(),
        method: 'POST',
        body: formData,
      }
    );
    return response.data as DocumentoSocietario;
  }

  async downloadDocumento(sociedadId: string, documentoId: string): Promise<Blob> {
    const response = await fetch(
      `/api/v2/repositorio/${sociedadId}/almacenamiento/documentos/${documentoId}/download`,
      {
        headers: withAuthHeaders().headers as HeadersInit,
      }
    );
    return response.blob();
  }

  async deleteDocumento(sociedadId: string, documentoId: string): Promise<void> {
    await $fetch(`/api/v2/repositorio/${sociedadId}/almacenamiento/documentos/${documentoId}`, {
      ...withAuthHeaders(),
      method: 'DELETE',
    });
  }

  async navigateCarpeta(sociedadId: string, carpetaId: string): Promise<DocumentoSocietario[]> {
    return this.listDocumentos(sociedadId, carpetaId);
  }
}

