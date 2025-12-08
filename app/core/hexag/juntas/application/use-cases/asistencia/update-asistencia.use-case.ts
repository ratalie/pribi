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
    representadoPorId?: string,
    representante?: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno?: string;
      tipoDocumento: string;
      numeroDocumento: string;
      paisEmision?: string;
    }
  ): Promise<void> {
    // Construir DTO base
    const dto: RegistroAsistenciaDto = {
      id: registroId,
      attended: asistio,
      isRepresentative: false,
    };

    // ✅ PRIORIDAD: Si viene representante (objeto completo), SOLO usarlo
    if (representante) {
      dto.representante = representante;
      console.log('✅ [UseCase] Enviando con campo REPRESENTANTE:', dto);
    } 
    // ✅ FALLBACK: Si viene representadoPorId (UUID), usarlo
    else if (representadoPorId) {
      dto.representedById = representadoPorId;
      console.log('✅ [UseCase] Enviando con campo REPRESENTED_BY_ID:', dto);
    }
    // ⚠️ Si NO viene ninguno, solo enviar attended
    else {
      console.log('⚠️ [UseCase] Enviando sin representante:', dto);
    }
    
    console.log('📤 [UseCase] DTO FINAL a enviar al repository:', JSON.stringify(dto, null, 2));
    
    return await this.repository.update(societyId, flowId, dto);
  }
}











