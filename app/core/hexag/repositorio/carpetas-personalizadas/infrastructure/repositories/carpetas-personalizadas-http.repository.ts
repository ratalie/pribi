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

  async asignarPermisos(
    carpetaId: string,
    usuarioId: string,
    expireAt?: Date
  ): Promise<void> {
    await $fetch(
      `/api/v2/repository/virtual-nodes/${carpetaId}/users/${usuarioId}`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: expireAt ? { expireAt: expireAt.toISOString() } : {},
      }
    );
  }

  async removerPermisos(carpetaId: string, usuarioId: string): Promise<void> {
    await $fetch(
      `/api/v2/repository/virtual-nodes/${carpetaId}/users/${usuarioId}`,
      {
        ...withAuthHeaders(),
        method: 'DELETE' as const,
      }
    );
  }

  async listarUsuariosConPermisos(carpetaId: string): Promise<Array<{
    id: string;
    email: string;
    name: string;
    expireAt?: Date;
  }>> {
    const response = await $fetch<{ data: Array<{
      user: {
        id: number;
        email: string;
        name?: string;
      };
      expireAt?: string;
    }> }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}/users`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );

    return response.data.map((item) => ({
      id: String(item.user.id),
      email: item.user.email,
      name: item.user.name || item.user.email,
      expireAt: item.expireAt ? new Date(item.expireAt) : undefined,
    }));
  }

  async obtenerPesoCarpetaVirtual(carpetaId: string): Promise<{
    sizeInBytes: number;
    folderCount: number;
    fileCount: number;
  }> {
    const response = await $fetch<{ data: {
      sizeInBytes: number;
      folderCount: number;
      fileCount: number;
    } }>(
      `/api/v2/repository/virtual-nodes/${carpetaId}/weight`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );

    return response.data;
  }

  async crearArbolCarpetas(
    sociedadId: string,
    nodeId: number,
    nombre: string,
    descripcion?: string
  ): Promise<CarpetaPersonalizada> {
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/society-profile/${sociedadId}/virtual-nodes/tree`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: {
          nodeId,
          name: nombre,
          description: descripcion,
        },
      }
    );

    return CarpetasPersonalizadasMapper.dtoToEntity(response.data);
  }
}

