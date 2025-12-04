import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';
import type { Convocatoria } from '../../domain/entities/convocatoria.entity';
import type {
  DetallesJuntaDto,
  GeneralMeetingConfigDto,
  ConvocatoriaDto,
  MeetingCallDto,
} from '../../application/dtos/meeting-details.dto';
import { TipoJunta } from '../../domain/enums/tipo-junta.enum';
import { ModoReunion } from '../../domain/enums/modo-reunion.enum';
import { OrdenConvocatoria } from '../../domain/enums/orden-convocatoria.enum';

/**
 * Mapper para convertir entre DTOs y Entidades de dominio
 */
export class MeetingDetailsMapper {
  /**
   * Convierte DTO de entrada (PUT) a Entidad de dominio
   */
  static toDomain(dto: DetallesJuntaDto, id?: string): MeetingDetails {
    return {
      id,
      tipoJunta: dto.tipoJunta as TipoJunta,
      esAnualObligatoria: dto.esAnualObligatoria,
      primeraConvocatoria: dto.primeraConvocatoria
        ? this.convocatoriaDtoToEntity(dto.primeraConvocatoria)
        : undefined,
      segundaConvocatoria: dto.segundaConvocatoria
        ? this.convocatoriaDtoToEntity(dto.segundaConvocatoria)
        : undefined,
      instaladaEnConvocatoria: dto.instaladaEnConvocatoria as OrdenConvocatoria,
      presidenteId: dto.presidenteId,
      secretarioId: dto.secretarioId,
      presidenteAsistio: dto.presidenteAsistio,
      secretarioAsistio: dto.secretarioAsistio,
      nombreOtroPresidente: dto.nombreOtroPresidente,
      nombreOtroSecretario: dto.nombreOtroSecretario,
    };
  }

  /**
   * Convierte Entidad de dominio a DTO de entrada (PUT)
   * 
   * ⚠️ IMPORTANTE: Para JUNTA_UNIVERSAL:
   * - NO debe enviar `segundaConvocatoria` (el backend lo rechaza)
   * - Solo debe enviar `primeraConvocatoria` como "detalle" de la junta
   * - NO debe enviar `instaladaEnConvocatoria` (solo aplica para General)
   */
  static toDto(entity: MeetingDetails): DetallesJuntaDto {
    const dto: DetallesJuntaDto = {
      tipoJunta: entity.tipoJunta,
      esAnualObligatoria: entity.esAnualObligatoria,
      instaladaEnConvocatoria: entity.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA,
      presidenteId: entity.presidenteId,
      secretarioId: entity.secretarioId,
      presidenteAsistio: entity.presidenteAsistio,
      secretarioAsistio: entity.secretarioAsistio,
      nombreOtroPresidente: entity.nombreOtroPresidente,
      nombreOtroSecretario: entity.nombreOtroSecretario,
    };

    // Para JUNTA_UNIVERSAL: Solo enviar primeraConvocatoria (como "detalle")
    // NO enviar segundaConvocatoria
    if (entity.tipoJunta === TipoJunta.UNIVERSAL) {
      if (entity.primeraConvocatoria) {
        dto.primeraConvocatoria = this.convocatoriaEntityToDto(entity.primeraConvocatoria);
      }
      // ⚠️ NO incluir segundaConvocatoria para Universal
      // El backend rechaza si se envía segundaConvocatoria en Universal
    } else {
      // Para JUNTA_GENERAL: Enviar ambas convocatorias si existen
      if (entity.primeraConvocatoria) {
        dto.primeraConvocatoria = this.convocatoriaEntityToDto(entity.primeraConvocatoria);
      }
      if (entity.segundaConvocatoria) {
        dto.segundaConvocatoria = this.convocatoriaEntityToDto(entity.segundaConvocatoria);
      }
    }

    return dto;
  }

  /**
   * Convierte DTO de salida (GET) a Entidad de dominio
   */
  static fromResponseDto(dto: GeneralMeetingConfigDto): MeetingDetails {
    // Convertir heldAtCall de formato backend a OrdenConvocatoria
    let instaladaEnConvocatoria: OrdenConvocatoria | undefined;
    if (dto.heldAtCall === 'FIRST') {
      instaladaEnConvocatoria = OrdenConvocatoria.PRIMERA;
    } else if (dto.heldAtCall === 'SECOND') {
      instaladaEnConvocatoria = OrdenConvocatoria.SEGUNDA;
    }

    return {
      id: dto.id,
      tipoJunta: dto.meetingType as TipoJunta,
      esAnualObligatoria: dto.isAnnualMandatory,
      primeraConvocatoria: dto.firstCall
        ? this.meetingCallDtoToEntity(dto.firstCall)
        : undefined,
      segundaConvocatoria: dto.secondCall
        ? this.meetingCallDtoToEntity(dto.secondCall)
        : undefined,
      instaladaEnConvocatoria,
      presidenteId: dto.presidentId,
      secretarioId: dto.secretaryId,
      // ⚠️ IMPORTANTE: Backend NO envía estos campos en GET, usar default TRUE
      presidenteAsistio: dto.presidentAttended ?? true,
      secretarioAsistio: dto.secretaryAttended ?? true,
      nombreOtroPresidente: dto.otherPresidentName,
      nombreOtroSecretario: dto.otherSecretaryName,
    };
  }

  // ============================================
  // HELPERS PRIVADOS
  // ============================================

  /**
   * Convierte ConvocatoriaDto a Convocatoria (Entity)
   */
  private static convocatoriaDtoToEntity(dto: ConvocatoriaDto): Convocatoria {
    return {
      direccion: dto.direccion,
      modo: dto.modo as ModoReunion,
      fecha: new Date(dto.fecha),
      hora: new Date(dto.hora),
    };
  }

  /**
   * Convierte Convocatoria (Entity) a ConvocatoriaDto
   */
  private static convocatoriaEntityToDto(entity: Convocatoria): ConvocatoriaDto {
    return {
      direccion: entity.direccion,
      modo: entity.modo,
      fecha: entity.fecha.toISOString(),
      hora: entity.hora.toISOString(),
    };
  }

  /**
   * Convierte MeetingCallDto (Response) a Convocatoria (Entity)
   * 
   * ⚠️ WORKAROUND: El backend devuelve propiedades en PascalCase (Address, Mode, etc.)
   * pero nuestro DTO espera camelCase. Este método maneja ambos casos.
   */
  private static meetingCallDtoToEntity(dto: MeetingCallDto | any): Convocatoria {
    // Manejar PascalCase del backend
    const address = dto.address || dto.Address || '';
    const mode = dto.mode || dto.Mode || 'IN_PERSON';
    const date = dto.date || dto.Date;
    const time = dto.time || dto.Time;

    // ⚠️ Ahora NO convertimos: usamos IN_PERSON/VIRTUAL directo del backend
    const modoFinal = mode as ModoReunion;

    console.log('[Mapper] meetingCallDtoToEntity', {
      dto,
      address,
      mode,
      modoFinal,
      date,
      time,
    });

    return {
      direccion: address,
      modo: modoFinal,
      fecha: date ? new Date(date) : new Date(),
      hora: time ? new Date(time) : new Date(),
    };
  }
}

