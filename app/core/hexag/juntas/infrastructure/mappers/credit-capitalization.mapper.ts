import type { CreditCapitalization } from "../../domain/entities/credit-capitalization.entity";
import type { CreditCapitalizationResponseDTO } from "../../application/dtos/credit-capitalization.dto";

/**
 * Mapper: CreditCapitalization
 *
 * Convierte entre DTO (formato del backend) y Entity (formato del dominio)
 */
export class CreditCapitalizationMapper {
  /**
   * Convertir DTO de respuesta (GET) a Entity
   */
  static fromResponseDto(dto: CreditCapitalizationResponseDTO): CreditCapitalization {
    return {
      id: String(dto.id),
      shareholderId: String(dto.shareholderId),
      actionId: String(dto.actionId),
      fileAccountingEntryId: String(dto.fileAccountingEntry.id),
      currency: dto.currency,
      amount: dto.amount,
      contributionDate: dto.contributionDate,
      exchangeRate: dto.exchangeRate,
      totalToCapitalize: dto.totalToCapitalize,
      sharesToReceive: dto.sharesToReceive,
      pricePerShare: dto.pricePerShare,
      sharePremium: dto.sharePremium,
      totalPremium: dto.totalPremium,
      socialCapital: dto.socialCapital,
    };
  }
}




