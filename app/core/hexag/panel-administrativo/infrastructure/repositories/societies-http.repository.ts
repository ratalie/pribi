import type { SocietyInfo } from '../../domain/entities/society-assignment.entity';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';

/**
 * Respuesta estándar de la API
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  code?: number;
}

/**
 * DTO de sociedad desde el backend
 */
interface SocietyDto {
  id: string;
  name: string;
  ruc?: string;
  status?: boolean;
  societyId?: string;
  societyProfileId?: string;
}

/**
 * Puerto para el repositorio de sociedades
 */
export interface SocietiesRepository {
  /**
   * Obtiene todas las sociedades disponibles para un estudio
   */
  getAllSocieties(studyId?: string): Promise<SocietyInfo[]>;
}

/**
 * Implementación HTTP del repositorio de sociedades
 */
export class SocietiesHttpRepository implements SocietiesRepository {
  private readonly basePath = '/api/v1/society-profile';

  /**
   * Resuelve la URL base para las peticiones
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const candidates = [apiBase, origin, 'http://localhost:3000'];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || 'http://localhost:3000');
        return baseUrl.origin;
      } catch {
        continue;
      }
    }

    return origin || 'http://localhost:3000';
  }

  /**
   * Construye la URL completa para un endpoint
   */
  private getUrl(path: string): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
    return new URL(fullPath, baseUrl.origin).toString();
  }

  /**
   * Mapea DTO de sociedad a entidad del dominio
   */
  private mapSocietyDtoToEntity(dto: SocietyDto): SocietyInfo {
    return {
      id: dto.id || dto.societyId || dto.societyProfileId || '',
      name: dto.name || 'Sociedad sin nombre',
      ruc: dto.ruc,
      status: dto.status ?? true,
    };
  }

  /**
   * Obtiene todas las sociedades disponibles para un estudio
   * Usa el endpoint /v1/society-profile/list que retorna las sociedades del usuario autenticado
   */
  async getAllSocieties(studyId?: string): Promise<SocietyInfo[]> {
    try {
      // El endpoint /list retorna las sociedades del usuario autenticado según su rol
      const url = this.getUrl('/list');

      const response = await $fetch<ApiResponse<SocietyDto[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener sociedades');
      }

      // Mapear DTOs a entidades
      return response.data.map((dto) => this.mapSocietyDtoToEntity(dto));
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al obtener sociedades';
      throw new Error(message);
    }
  }
}

