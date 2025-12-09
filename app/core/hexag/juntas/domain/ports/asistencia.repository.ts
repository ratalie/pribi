import type { Asistencia } from '../entities/asistencia.entity';
import type { RegistroAsistenciaDto } from '../../application/dtos/asistencia.dto';

/**
 * Puerto (Interface) para el repositorio de Asistencia
 */
export interface AsistenciaRepository {
  /**
   * Obtiene todos los registros de asistencia de una junta
   */
  get(societyId: number, flowId: number): Promise<Asistencia[]>;
  
  /**
   * Actualiza un registro de asistencia individual
   */
  update(
    societyId: number,
    flowId: number,
    dto: RegistroAsistenciaDto
  ): Promise<void>;
}
























