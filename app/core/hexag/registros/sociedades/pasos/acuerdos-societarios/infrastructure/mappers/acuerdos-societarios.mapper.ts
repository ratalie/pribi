import type {
  AcuerdoSocietarioDataDTO,
  ArchivoMetadataDTO,
} from "../../application/dtos/acuerdo-societario-response.dto";
import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";
import type {
  AcuerdoSocietario,
  ArchivoMetadata,
} from "../../domain/entities/acuerdo-societario.entity";

/**
 * Mapper para transformar entre DTO y Entidad de acuerdos societarios.
 */
export class AcuerdosSocietariosMapper {
  /**
   * Convierte metadata de archivo DTO a entidad.
   */
  private static toArchivoMetadata(dto: ArchivoMetadataDTO | null): ArchivoMetadata | null {
    if (!dto) return null;
    return {
      id: dto.id,
      nombre: dto.nombre,
      url: dto.url,
    };
  }

  /**
   * Convierte DTO de respuesta (GET) a Entidad de dominio.
   */
  static toDomainFromResponse(dto: AcuerdoSocietarioDataDTO): AcuerdoSocietario {
    return {
      id: dto.id,
      derechoPreferencia: dto.derechoPreferencia,
      archivoEstatutos: dto.archivoEstatutos,
      archivoAccionistas: dto.archivoAccionistas,
      archivoTerceros: dto.archivoTerceros,
      estatutos: this.toArchivoMetadata(dto.estatutos),
      accionistas: this.toArchivoMetadata(dto.accionistas),
      terceros: this.toArchivoMetadata(dto.terceros),
    };
  }

  /**
   * Convierte DTO (payload) a Entidad de dominio.
   * Versión simplificada para CREATE/UPDATE que no incluye metadata de archivos.
   */
  static toDomain(dto: AcuerdoSocietarioDTO): AcuerdoSocietario {
    return {
      derechoPreferencia: dto.derechoPreferencia ?? false,
      archivoEstatutos: dto.archivoEstatutos ?? null,
      archivoAccionistas: dto.archivoAccionistas ?? null,
      archivoTerceros: dto.archivoTerceros ?? null,
      estatutos: null,
      accionistas: null,
      terceros: null,
    };
  }

  /**
   * Convierte DTO a payload para backend (POST/PUT).
   * Solo incluye campos definidos (no undefined).
   */
  static toPayload(dto: AcuerdoSocietarioDTO): AcuerdoSocietarioDTO {
    const payload: AcuerdoSocietarioDTO = {};

    if (dto.derechoPreferencia !== undefined) {
      payload.derechoPreferencia = dto.derechoPreferencia;
    }
    if (dto.archivoEstatutos !== undefined) {
      payload.archivoEstatutos = dto.archivoEstatutos ?? null;
    }
    if (dto.archivoAccionistas !== undefined) {
      payload.archivoAccionistas = dto.archivoAccionistas ?? null;
    }
    if (dto.archivoTerceros !== undefined) {
      payload.archivoTerceros = dto.archivoTerceros ?? null;
    }

    return payload;
  }
}
