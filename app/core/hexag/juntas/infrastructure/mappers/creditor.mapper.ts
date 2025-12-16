import type { Creditor } from "../../domain/entities/creditor.entity";
import type { CreditorResponseDTO } from "../../application/dtos/creditor.dto";

/**
 * Mapper: Creditor
 *
 * Convierte entre DTO (formato del backend) y Entity (formato del dominio)
 */
export class CreditorMapper {
  /**
   * Convertir DTO de respuesta (GET) a Entity
   */
  static fromResponseDto(dto: CreditorResponseDTO): Creditor {
    // Inferir el tipo de persona basado en los campos disponibles
    const tipoPersona = dto.contributor.razonSocial
      ? "JURIDICA"
      : dto.contributor.nombre && dto.contributor.apellidoPaterno
        ? "NATURAL"
        : "NATURAL"; // Por defecto NATURAL si no se puede determinar

    return {
      id: String(dto.id),
      contributorType: dto.contributorType,
      isContributor: dto.isContributor,
      isPresent: dto.isPresent,
      contributor: {
        id: String(dto.contributor.id),
        tipo: tipoPersona,
        nombre: dto.contributor.nombre,
        apellidoPaterno: dto.contributor.apellidoPaterno,
        apellidoMaterno: dto.contributor.apellidoMaterno,
        razonSocial: dto.contributor.razonSocial,
        tipoDocumento: dto.contributor.tipoDocumento,
        numeroDocumento: dto.contributor.numeroDocumento,
        paisEmision: dto.contributor.paisEmision,
      },
    };
  }
}


