export interface AsignacionAccion {
  id: string;
  accionistaId: string;
  accionista: string; // Nombre del accionista
  tipoAccion: string; // Tipo de acción (Comunes, Clase A, etc.)
  cantidadAcciones: number;
  porcentaje: number; // Porcentaje de participación por clase
  precioAccion: number;
  capitalSocial: number;
  prima: number;
  totalmentePagado: boolean;
  porcentajePagado: number;
  dividendoPasivo: number;
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
