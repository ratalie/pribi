/**
 * Entidad: Capitalización de Crédito (Credit Capitalization)
 *
 * Representa un registro de capitalización de crédito.
 * Similar a Aporte en Aporte Dinerario.
 */
export interface CreditCapitalization {
  /** ID de la capitalización (número en v1, UUID en v2 futuro) */
  id: string;

  /** ID del acreedor (shareholderId) */
  shareholderId: string;

  /** ID de la clase de acción */
  actionId: string;

  /** ID del archivo comprobante (REQUERIDO) */
  fileAccountingEntryId: string;

  /** Moneda (PEN o USD) */
  currency: "PEN" | "USD";

  /** Monto original del crédito */
  amount: number;

  /** Fecha de capitalización (opcional) */
  contributionDate?: string;

  /** Tasa de cambio (si USD) */
  exchangeRate?: number;

  /** Monto total a capitalizar */
  totalToCapitalize: number;

  /** Acciones a recibir */
  sharesToReceive: number;

  /** Precio por acción */
  pricePerShare: number;

  /** Prima por acción */
  sharePremium: number;

  /** Prima total */
  totalPremium: number;

  /** Incremento de capital social (opcional) */
  socialCapital?: number;
}




