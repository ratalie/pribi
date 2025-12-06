import type { Asistencia } from '../../domain/entities/asistencia.entity';
import type {
  AsistenciaJuntaQueryDto,
  RegistroAsistenciaDto,
} from '../../application/dtos/asistencia.dto';

/**
 * Mapper para Asistencia
 * Convierte entre DTOs del backend y entidades del dominio
 */
export class AsistenciaMapper {
  /**
   * DTO Response → Entidad
   */
  static fromResponseDto(dto: AsistenciaJuntaQueryDto): Asistencia {
    return {
      id: dto.id,
      configJuntaId: dto.configJuntaId,
      accionista: dto.accionista,
      accionesConDerechoVoto: dto.accionesConDerechoVoto,
      porcentajeParticipacion: dto.porcentajeParticipacion,
      asistio: dto.asistio,
      representadoPorId: dto.representadoPorId,
      esRepresentante: dto.esRepresentante,
    };
  }
  
  /**
   * Crea un DTO para actualizar asistencia
   */
  static toUpdateDto(
    id: string,
    asistio: boolean,
    representadoPorId?: string
  ): RegistroAsistenciaDto {
    return {
      id,
      attended: asistio,
      representedById: representadoPorId,
      isRepresentative: false, // Por ahora siempre false
    };
  }
}













