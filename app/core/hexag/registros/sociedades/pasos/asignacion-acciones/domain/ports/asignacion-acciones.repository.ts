export interface AsignacionAccionesDTO {
  id: string; // UUID generado en frontend
  accionId: string; // ID de la acción creada
  accionistaId: string; // ID del accionista creado
  cantidadSuscrita: number; // Cantidad de acciones a asignar
  precioPorAccion: number; // Precio por acción
  porcentajePagadoPorAccion: number; // 0-100
  totalDividendosPendientes: number; // >= 0
  pagadoCompletamente: boolean; // true por defecto
}

export interface AsignacionAccionesRepository {
  create(societyProfileId: string, payload: AsignacionAccionesDTO): Promise<string>;
}

