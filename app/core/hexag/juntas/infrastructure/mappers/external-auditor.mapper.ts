import type { ExternalAuditorDTO } from "../../application/dtos/external-auditor.dto";
import type { ExternalAuditor } from "../../domain/entities/external-auditor.entity";

/**
 * Mapper: ExternalAuditor
 *
 * Convierte entre DTO (formato del backend) y Entity (formato del dominio)
 */
export class ExternalAuditorMapper {
  /**
   * Convertir DTO a Entity
   */
  static toEntity(dto: ExternalAuditorDTO): ExternalAuditor {
    return {
      responsableDesignacion: dto.responsableDesignacion,
      auditorExterno: dto.auditorExterno
        ? {
            nombreCompleto: dto.auditorExterno.nombreCompleto,
          }
        : undefined,
    };
  }

  /**
   * Convertir Entity a DTO
   */
  static toDTO(entity: ExternalAuditor): ExternalAuditorDTO {
    return {
      responsableDesignacion: entity.responsableDesignacion,
      auditorExterno: entity.auditorExterno
        ? {
            nombreCompleto: entity.auditorExterno.nombreCompleto,
          }
        : undefined,
    };
  }
}
