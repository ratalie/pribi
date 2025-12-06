import type { AsistenciaRepository } from '../../../domain/ports/asistencia.repository';
import type { RegistroAsistenciaDto } from '../../dtos/asistencia.dto';

/**
 * Caso de uso: Asignar representante a un accionista
 * SOLO usa campo "representante" (objeto completo)
 */
export class AssignRepresentanteUseCase {
  constructor(private readonly repository: AsistenciaRepository) {}
  
  async execute(
    societyId: number,
    flowId: number,
    registroId: string,
    asistio: boolean,
    representante: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno?: string;
      tipoDocumento: string;
      numeroDocumento: string;
      paisEmision?: string;
    }
  ): Promise<void> {
    const dto: RegistroAsistenciaDto = {
      id: registroId,
      attended: asistio,
      representante: representante,
      isRepresentative: false,
    };
    
    return await this.repository.update(societyId, flowId, dto);
  }
}



