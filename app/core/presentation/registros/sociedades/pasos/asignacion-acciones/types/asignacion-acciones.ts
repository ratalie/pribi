export interface AsignacionAccion {
  id: string;
  accionistaId: string;
  accionista: string; // Nombre del accionista
  accionId: string; // ID de la acción (UUID)
  cantidadSuscrita: number;
  porcentaje: number; // Porcentaje de participación por clase
  precioPorAccion: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
  // Campos calculados/UI (no van al backend)
  capitalSocial?: number;
  prima?: number;
}

export interface AsignacionAccionista {
  id: string;
  accionista: string;
  acciones: AsignacionAccion[];
}

export interface AsignacionAccionistaTableRow {
  id: string;
  accionista: string;
  tipos: string; // "1 tipo", "2 tipos", etc.
  acciones: {
    id: string; // ID de la asignación (necesario para editar/eliminar)
    clase: string;
    acciones: number;
    porcentaje: number;
  }[];
}

export interface AccionDisponible {
  id: string;
  nombre: string;
  accionesSuscritas: number;
  accionesAsignadas: number;
}
