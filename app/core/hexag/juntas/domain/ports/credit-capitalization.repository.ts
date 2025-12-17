import type { CreditCapitalization } from "../entities/credit-capitalization.entity";

/**
 * DTOs para operaciones de Capitalizaciones
 */
export interface CreateCreditCapitalizationDTO {
  shareholderId: string; // ID del acreedor
  actionId: string; // ID de la clase de acción
  fileAccountingEntryId: string; // REQUERIDO
  currency: "PEN" | "USD";
  amount: number; // Monto original del crédito
  contributionDate?: string; // Opcional
  exchangeRate?: number;
  totalToCapitalize: number; // Monto a capitalizar
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}

export interface UpdateCreditCapitalizationDTO {
  id: string;
  shareholderId?: string;
  actionId?: string;
  fileAccountingEntryId?: string;
  currency?: "PEN" | "USD";
  amount?: number;
  contributionDate?: string;
  exchangeRate?: number;
  totalToCapitalize?: number;
  sharesToReceive?: number;
  pricePerShare?: number;
  sharePremium?: number;
  totalPremium?: number;
  socialCapital?: number;
}

/**
 * Port (Contrato): Repositorio de Capitalizaciones de Crédito
 *
 * Define las operaciones disponibles para gestionar capitalizaciones.
 * Similar a Aportes en Aporte Dinerario.
 */
export interface CreditCapitalizationRepository {
  /**
   * Listar todas las capitalizaciones
   */
  list(societyId: number, flowId: number): Promise<CreditCapitalization[]>;

  /**
   * Crear una nueva capitalización
   */
  create(
    societyId: number,
    flowId: number,
    dto: CreateCreditCapitalizationDTO
  ): Promise<CreditCapitalization>;

  /**
   * Actualizar una capitalización existente
   */
  update(societyId: number, flowId: number, dto: UpdateCreditCapitalizationDTO): Promise<void>;

  /**
   * Eliminar una o más capitalizaciones
   */
  delete(societyId: number, flowId: number, capitalizationIds: string[]): Promise<void>;
}




