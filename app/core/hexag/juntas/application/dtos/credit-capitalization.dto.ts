/**
 * DTOs para Capitalizaciones de Crédito (Credit Capitalizations)
 * Basado en: docs/backend/REGISTER-ASSEMBLY-CAPITALIZACION-CREDITOS-COMPLETO-FRONTEND.md
 *
 * ⚠️ NOTA: Los endpoints están en v1 (usan números como IDs)
 * En el futuro se migrarán a v2 (usarán UUIDs)
 */

/**
 * DTO de respuesta al obtener capitalizaciones (GET Response)
 */
export interface CreditCapitalizationResponseDTO {
  id: string; // Número en v1, UUID en v2 futuro
  shareholderId: string; // ID del acreedor
  actionId: string; // ID de la clase de acción
  fileAccountingEntry: {
    id: string;
    name: string;
    url: string;
  };
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

/**
 * DTO para crear capitalización (POST Request)
 */
export interface CreateCreditCapitalizationDTO {
  shareholderId: string; // ID del acreedor (creditor)
  actionId: string; // ID de la clase de acción
  fileAccountingEntryId: string; // REQUERIDO - ID del archivo comprobante
  currency: "PEN" | "USD";
  amount: number; // Monto original del crédito
  contributionDate?: string; // Opcional
  exchangeRate?: number;
  totalToCapitalize: number; // Monto total a capitalizar
  sharesToReceive: number;
  pricePerShare: number;
  sharePremium: number;
  totalPremium: number;
  socialCapital?: number;
}

/**
 * DTO para actualizar capitalización (PUT Request)
 */
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
 * Response wrapper del backend para listar capitalizaciones
 */
export interface CreditCapitalizationListResponse {
  success: boolean;
  message: string;
  code: number;
  data: CreditCapitalizationResponseDTO[];
}

/**
 * Response wrapper para crear capitalización
 */
export interface CreditCapitalizationCreateResponse {
  success: boolean;
  message: string;
  code: number;
  data: CreditCapitalizationResponseDTO;
}

/**
 * Response wrapper para actualizar/eliminar capitalización
 */
export interface CreditCapitalizationActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}




