import type { AsistenciaRepository } from '../../../domain/ports/asistencia.repository';
import type { RegistroAsistenciaDto } from '../../dtos/asistencia.dto';

/**
 * Caso de uso: Actualizar un registro de asistencia
 */
export class UpdateAsistenciaUseCase {
  constructor(private readonly repository: AsistenciaRepository) {}
  
  async execute(
    societyId: number,
    flowId: number,
    registroId: string,
    asistio: boolean,
    representadoPorId?: string
  ): Promise<void> {
    const dto: RegistroAsistenciaDto = {
      id: registroId,
      attended: asistio,
      representedById: representadoPorId,
      isRepresentative: false,
    };
    
    return await this.repository.update(societyId, flowId, dto);
  }
}


