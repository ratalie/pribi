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
      `/api/v2/repository/society-profile/${sociedadId}/virtual-nodes`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.dtoToEntity(dto));
  }

  async getById(sociedadId: string, carpetaId: string): Promise<CarpetaPersonalizada | null> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data ? CarpetasPersonalizadasMapper.dtoToEntity(response.data) : null;
  }

  async create(sociedadId: string, nombre: string, descripcion?: string, isChatIA?: boolean): Promise<CarpetaPersonalizada> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/society-profile/${sociedadId}/virtual-nodes`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: { 
          name: nombre,  // Backend espera 'name' no 'nombre'
          description: descripcion,
          isChatIA: isChatIA ?? false,
        },
      }
    );
    return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
  }

  async update(sociedadId: string, carpetaId: string, nombre: string, descripcion?: string, isChatIA?: boolean): Promise<CarpetaPersonalizada> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}`,
      {
        ...withAuthHeaders(),
        method: 'PUT' as const,
        body: { 
          name: nombre,  // Backend espera 'name' no 'nombre'
          description: descripcion,
          isChatIA: isChatIA !== undefined ? isChatIA : undefined,
        },
      }
    );
    return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
  }

  async delete(sociedadId: string, carpetaId: string): Promise<void> {
    await $fetch(`/api/v2/repository/virtual-nodes/${carpetaId}`, {
      ...withAuthHeaders(),
      method: 'DELETE' as const,
    });
  }

  async listEnlaces(sociedadId: string, carpetaId: string): Promise<EnlaceDocumento[]> {
    const response = await $fetch<{ data: any[] }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}/nodes`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.enlaceDtoToEntity(dto));
  }

  async addEnlace(sociedadId: string, carpetaId: string, documentoId: string, tipo: 'societario' | 'generado', origen: string): Promise<EnlaceDocumento> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}/nodes/${documentoId}`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
      }
    );
    return CarpetasPersonalizadasMapper.enlaceDtoToEntity(response.data);
  }

  async removeEnlace(sociedadId: string, carpetaId: string, enlaceId: string): Promise<void> {
    await $fetch(
      `/api/v2/repository/virtual-nodes/${carpetaId}/nodes/${enlaceId}`,
      {
        ...withAuthHeaders(),
        method: 'DELETE' as const,
      }
    );
  }
}

