import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';
import { withAuthHeaders } from '~/lib/api-client';
import { CarpetasPersonalizadasMapper } from '../mappers/carpetas-personalizadas.mapper';

/**
 * Repositorio HTTP para Carpetas Personalizadas
 */
export class CarpetasPersonalizadasHttpRepository implements CarpetasPersonalizadasRepository {
  async list(sociedadId: string): Promise<CarpetaPersonalizada[]> {
    const response = await $fetch<{ data: any[] }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.dtoToEntity(dto));
  }

  async getById(sociedadId: string, carpetaId: string): Promise<CarpetaPersonalizada | null> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data ? CarpetasPersonalizadasMapper.dtoToEntity(response.data) : null;
  }

  async create(sociedadId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: { nombre, descripcion },
      }
    );
    return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
  }

  async update(sociedadId: string, carpetaId: string, nombre: string, descripcion?: string): Promise<CarpetaPersonalizada> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}`,
      {
        ...withAuthHeaders(),
        method: 'PUT' as const,
        body: { nombre, descripcion },
      }
    );
    return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
  }

  async delete(sociedadId: string, carpetaId: string): Promise<void> {
    await $fetch(`/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}`, {
      ...withAuthHeaders(),
      method: 'DELETE' as const,
    });
  }

  async listEnlaces(sociedadId: string, carpetaId: string): Promise<EnlaceDocumento[]> {
    const response = await $fetch<{ data: any[] }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}/enlaces`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.enlaceDtoToEntity(dto));
  }

  async addEnlace(sociedadId: string, carpetaId: string, documentoId: string, tipo: 'societario' | 'generado', origen: string): Promise<EnlaceDocumento> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}/enlaces`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: { documentoId, tipo, origen },
      }
    );
    return CarpetasPersonalizadasMapper.enlaceDtoToEntity(response.data);
  }

  async removeEnlace(sociedadId: string, carpetaId: string, enlaceId: string): Promise<void> {
    await $fetch(
      `/api/v2/repositorio/${sociedadId}/carpetas-personalizadas/${carpetaId}/enlaces/${enlaceId}`,
      {
        ...withAuthHeaders(),
        method: 'DELETE' as const,
      }
    );
  }
}

