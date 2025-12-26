import type { CarpetasPersonalizadasRepository } from '../../domain/ports/carpetas-personalizadas.repository';
import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';
import { withAuthHeaders } from '~/lib/api-client';
import { CarpetasPersonalizadasMapper } from '../mappers/carpetas-personalizadas.mapper';

/**
 * Repositorio HTTP para Carpetas Personalizadas
 * 
 * NOTA: El backend espera `structureId` (número) en las rutas, no `societyProfileId` (UUID).
 * El `structureId` es el ID numérico de `SocietyProfileStructureV2`.
 * 
 * Si se recibe un UUID (societyProfileV2Id), se debe convertir a structureId primero.
 * Por ahora, asumimos que el `sociedadId` recibido es el `structureId` numérico.
 */
export class CarpetasPersonalizadasHttpRepository implements CarpetasPersonalizadasRepository {
  /**
   * Resuelve la URL base del backend
   * Usa el mismo patrón que otros repositorios en V3
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  /**
   * Convierte sociedadId a structureId (número)
   * 
   * El backend espera `structureId` (número) en las rutas `/v2/repository/society-profile/:structureId/virtual-nodes`
   * 
   * Si `sociedadId` es un número, lo retorna directamente.
   * Si es un UUID, intenta obtener el structureId desde el backend o lanza un error.
   * 
   * NOTA: Por ahora, asumimos que `sociedadId` es el `structureId` numérico.
   * Si se recibe un UUID, necesitaremos implementar la conversión.
   */
  private getStructureId(sociedadId: string): number {
    // Intentar convertir a número
    const numId = Number(sociedadId);
    
    // Si es un número válido y positivo, usarlo directamente
    if (!isNaN(numId) && numId > 0 && Number.isInteger(numId)) {
      return numId;
    }

    // Si es un UUID (formato con guiones), necesitamos obtener el structureId
    // Por ahora, lanzamos un error claro
    if (sociedadId.includes('-') && sociedadId.length > 10) {
      console.error('[CarpetasPersonalizadasHttpRepository] UUID recibido, se requiere structureId numérico:', sociedadId);
      throw new Error(
        `Se recibió un UUID (${sociedadId}) pero se requiere el structureId numérico. ` +
        `Por favor, asegúrate de usar el structureId correcto de la sociedad.`
      );
    }

    // Si no es ni número ni UUID reconocible, lanzar error
    throw new Error(
      `ID de sociedad inválido: ${sociedadId}. Se requiere un structureId numérico.`
    );
  }

  async list(sociedadId: string): Promise<CarpetaPersonalizada[]> {
    const structureId = this.getStructureId(sociedadId);
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/virtual-nodes`;
    
    const response = await $fetch<{ data: any[] }>(
      url,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.dtoToEntity(dto));
  }

  async getById(sociedadId: string, carpetaId: string): Promise<CarpetaPersonalizada | null> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/virtual-nodes/${carpetaId}`;
    
    const response = await $fetch<{ data: any }>(
      url,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data ? CarpetasPersonalizadasMapper.dtoToEntity(response.data) : null;
  }

  async create(sociedadId: string, nombre: string, descripcion?: string, isChatIA?: boolean): Promise<CarpetaPersonalizada> {
    const structureId = this.getStructureId(sociedadId);
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/virtual-nodes`;
    
    const response = await $fetch<{ data: any }>(
      url,
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
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/virtual-nodes/${carpetaId}`;
    
    const response = await $fetch<{ data: any }>(
      url,
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
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/virtual-nodes/${carpetaId}`;
    
    await $fetch(url, {
      ...withAuthHeaders(),
      method: 'DELETE' as const,
    });
  }

  async listEnlaces(sociedadId: string, carpetaId: string): Promise<EnlaceDocumento[]> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/virtual-nodes/${carpetaId}/nodes`;
    
    const response = await $fetch<{ data: any[] }>(
      url,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data.map((dto) => CarpetasPersonalizadasMapper.enlaceDtoToEntity(dto));
  }

  async addEnlace(sociedadId: string, carpetaId: string, documentoId: string, tipo: 'societario' | 'generado', origen: string): Promise<EnlaceDocumento> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/virtual-nodes/${carpetaId}/nodes/${documentoId}`;
    
    const response = await $fetch<{ data: any }>(
      url,
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
    const structureId = await this.getStructureId(sociedadId);
    const response = await $fetch<{ data: any }>(
      `/api/v2/repository/society-profile/${structureId}/virtual-nodes/tree`,
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

