import type { FetchOptions } from 'ofetch';
import type { AsistenciaRepository } from '../../domain/ports/asistencia.repository';
import type { Asistencia } from '../../domain/entities/asistencia.entity';
import type { RegistroAsistenciaDto, AsistenciaJuntaQueryDto } from '../../application/dtos/asistencia.dto';
import { AsistenciaMapper } from '../mappers/asistencia.mapper';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';

/**
 * Implementación HTTP del repositorio de Asistencia
 */
export class AsistenciaHttpRepository implements AsistenciaRepository {
  private readonly basePath = '/api/v2/society-profile';
  
  /**
   * Resuelve la URL para attendance (COPIADO DE junta.http.repository.ts)
   */
  private resolveAttendanceUrl(societyId: number, flowId: number | string): string {
    const flowIdStr = typeof flowId === 'string' ? flowId : String(flowId);
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        // /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
        const fullPath = `${basePath}/${societyId}/register-assembly/${flowIdStr}/attendance`;
        return new URL(fullPath, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    // Fallback: construir URL relativa
    return `${this.basePath}/${societyId}/register-assembly/${flowIdStr}/attendance`;
  }
  
  /**
   * GET - Obtener todos los registros de asistencia
   */
  async get(societyId: number, flowId: number): Promise<Asistencia[]> {
    const url = this.resolveAttendanceUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: 'GET' as const,
    };
    
    console.debug('[Repository][AsistenciaHttp] get() request', {
      url,
      societyId,
      flowId,
    });
    
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: AsistenciaJuntaQueryDto[];
      }>(url, requestConfig);
      
      console.debug('[Repository][AsistenciaHttp] get() response', {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
        fullResponse: response,
      });
      
      // Validar que la respuesta tenga data
      if (!response?.data) {
        console.warn('⚠️ [Repository][AsistenciaHttp] Backend NO devolvió data');
        return [];
      }
      
      // Validar que data sea un array
      if (!Array.isArray(response.data)) {
        console.error('⚠️ [Repository][AsistenciaHttp] data NO es un array:', response.data);
        return [];
      }
      
      // 🐛 DEBUG: Si está vacío, mostrar info
      if (response.data.length === 0) {
        console.warn('⚠️ [Repository][AsistenciaHttp] Backend devolvió array VACÍO');
        console.warn('  Esto significa que el backend NO tiene registros de asistencia');
        console.warn('  Los registros se crean automáticamente al crear la junta');
      }
      
      // Mapear todos los DTOs a entidades
      return response.data.map((dto) => AsistenciaMapper.fromResponseDto(dto));
    } catch (error: any) {
      console.error('[Repository][AsistenciaHttp] get() error', {
        url,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
  
  /**
   * PUT - Actualizar un registro de asistencia
   */
  async update(
    societyId: number,
    flowId: number,
    dto: RegistroAsistenciaDto
  ): Promise<void> {
    const url = this.resolveAttendanceUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: 'PUT' as const,
      body: dto,
    };
    
    console.log('📤 [Repository] DTO recibido del Use Case:', JSON.stringify(dto, null, 2));
    console.log('📤 [Repository] URL:', url);
    console.log('📤 [Repository] Body que se enviará:', JSON.stringify(dto, null, 2));
    
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(url, requestConfig);
      
      console.debug('[Repository][AsistenciaHttp] update() response', {
        success: response.success,
        message: response.message,
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('[Repository][AsistenciaHttp] update() error', {
        url,
        dto,
        error: error.message,
      });
      throw error;
    }
  }
}

