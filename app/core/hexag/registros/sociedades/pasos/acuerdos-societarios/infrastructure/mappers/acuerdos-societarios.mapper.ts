import type { AcuerdoSocietario } from "../../domain/entities/acuerdo-societario.entity";
import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";

/**
 * Mapper para transformar entre DTO y Entidad de acuerdos societarios.
 */
export class AcuerdosSocietariosMapper {
  /**
   * Convierte DTO a Entidad de dominio.
   */
  static toDomain(dto: AcuerdoSocietarioDTO, metadata?: { createdAt?: string; updatedAt?: string }): AcuerdoSocietario {
    return {
      derechoPreferencia: dto.derechoPreferencia,
      archivoEstatutos: dto.archivoEstatutos,
      archivoAccionistas: dto.archivoAccionistas,
      archivoTerceros: dto.archivoTerceros,
      createdAt: metadata?.createdAt,
      updatedAt: metadata?.updatedAt,
    };
  }

  /**
   * Convierte Entidad de dominio a DTO (payload para backend).
   */
  static toPayload(entity: AcuerdoSocietario): AcuerdoSocietarioDTO {
    return {
      derechoPreferencia: entity.derechoPreferencia,
      archivoEstatutos: entity.archivoEstatutos,
      archivoAccionistas: entity.archivoAccionistas,
      archivoTerceros: entity.archivoTerceros,
    };
  }
}

