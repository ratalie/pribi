/**
 * DTO para crear o actualizar una asignación de acción.
 * Este es el formato que espera el backend.
 */
export interface AsignacionAccionDTO {
  id?: string;
  accionId: string;
  accionistaId: string;
  cantidadSuscrita: number;
  precioPorAccion: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
}
