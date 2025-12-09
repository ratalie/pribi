/**
 * Tipos para Dashboard de Juntas
 */

export interface JuntaDashboardStats {
  totalJuntas: number;
  aumentoCapital: number;
  nombramiento: number;
  remocion: number;
  mayoriaAbsoluta: number;
  utilidades: number;
  enProceso: number;
  finalizadas: number;
}

export interface TimelineJunta {
  fecha: Date;
  tipo: string;
  estado: string;
  monto?: number; // Para aportes dinerarios
  id: string;
}

export interface ImpactoCapital {
  fecha: Date;
  capitalAntes: number;
  capitalDespues: number;
  junta: string; // Nombre/tipo de junta
  id: string;
}

export interface CambiosAutoridades {
  fecha: Date;
  directoresAntes: number;
  directoresDespues: number;
  apoderadosAntes: number;
  apoderadosDespues: number;
  junta: string;
  id: string;
}

export interface ImpactoAcumulado {
  capitalInicial: number;
  capitalActual: number;
  incrementoCapital: number;
  incrementoPorcentaje: number;
  directoresInicial: number;
  directoresActual: number;
  cambioDirectores: number;
  apoderadosInicial: number;
  apoderadosActual: number;
  cambioApoderados: number;
}

export interface HistorialJunta {
  id: string;
  fecha: string;
  tipo: string;
  estado: "FINALIZADO" | "EN_PROCESO" | "BORRADOR";
  impacto: string; // "+S/ 500K", "+2 Directores", etc.
  votacion?: string;
}

