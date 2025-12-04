import type { AsistenciaRepository } from '../../../domain/ports/asistencia.repository';
import type { Asistencia } from '../../../domain/entities/asistencia.entity';

/**
 * Caso de uso: Obtener asistencias
 */
export class GetAsistenciaUseCase {
  constructor(private readonly repository: AsistenciaRepository) {}
  
  async execute(societyId: number, flowId: number): Promise<Asistencia[]> {
    return await this.repository.get(societyId, flowId);
  }
}



