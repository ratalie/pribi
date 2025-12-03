/**
 * DTO para crear o actualizar una asignación de acción.
 * Este es el formato que espera el backend.
 */
export interface AsignacionAccionDTO {
  id: string; // Requerido por el backend
  accionId: string;
  accionistaId: string;
  cantidadSuscrita: number;
  precioPorAccion: number;
  capitalSocial: number; // Requerido por el backend
  prima: number; // Requerido por el backend
  porcentajePagadoPorAccion: number;
  dividendoPasivoTotal: number;
  pagadoCompletamente: boolean;
}
