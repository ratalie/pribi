import type { AsistenciaRepository } from '../../domain/ports/asistencia.repository';
import type { Asistencia } from '../../domain/entities/asistencia.entity';
import type { RegistroAsistenciaDto, AsistenciaJuntaQueryDto } from '../../application/dtos/asistencia.dto';
import { AsistenciaMapper } from '../mappers/asistencia.mapper';

/**
 * Implementación MSW del repositorio de Asistencia
 * Usa los handlers MSW para simular el backend
 */
export class AsistenciaMswRepository implements AsistenciaRepository {
  private readonly basePath = '/api/v2/society-profile';
  
  /**
   * GET - Obtener asistencias (llama al handler MSW)
   */
  async get(societyId: number, flowId: number): Promise<Asistencia[]> {
    const url = `${this.basePath}/${societyId}/register-assembly/${flowId}/attendance`;
    
    console.debug('[Repository][AsistenciaMsw] get() request', {
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
      }>(url);
      
      console.debug('[Repository][AsistenciaMsw] get() response', {
        success: response.success,
        count: response.data.length,
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data.map((dto) => AsistenciaMapper.fromResponseDto(dto));
    } catch (error: any) {
      console.error('[Repository][AsistenciaMsw] get() error', {
        url,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * PUT - Actualizar asistencia (llama al handler MSW)
   */
  async update(
    societyId: number,
    flowId: number,
    dto: RegistroAsistenciaDto
  ): Promise<void> {
    const url = `${this.basePath}/${societyId}/register-assembly/${flowId}/attendance`;
    
    console.debug('[Repository][AsistenciaMsw] update() request', {
      url,
      societyId,
      flowId,
      dto,
    });
    
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
      }>(url, {
        method: 'PUT',
        body: dto,
      });
      
      console.debug('[Repository][AsistenciaMsw] update() response', {
        success: response.success,
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('[Repository][AsistenciaMsw] update() error', {
        url,
        dto,
        error: error.message,
      });
      throw error;
    }
  }
}




















