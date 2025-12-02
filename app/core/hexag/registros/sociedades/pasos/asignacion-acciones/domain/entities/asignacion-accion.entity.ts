/**
 * Entidad de dominio que representa una asignación de acción.
 */
export interface AsignacionAccion {
  id: string;
  estructuraAsignacionId: string;
  accionId: string;
  accionistaId: string;
  cantidadAccionesSuscritas: number;
  precioPorAccion: number;
  capitalSocial: number;
  prima: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
}
