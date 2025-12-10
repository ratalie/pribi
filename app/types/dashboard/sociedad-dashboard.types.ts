/**
 * Tipos para Dashboard de Sociedades
 */

export interface SociedadDashboardStats {
  totalSociedades: number;
  totalJuntas: number;
  sociedadesActivas: number;
  sociedadesEnProceso: number;
  juntasFinalizadas: number;
  ahorroEstimado?: number; // Placeholder para futuro
}

export interface EvolucionSociedades {
  mes: string; // "Ene 2024", "Feb 2024", etc.
  creadas: number;
  finalizadas: number;
}

export interface JuntasPorTipo {
  tipo: string; // "Aumento Capital", "Nombramiento", "Remoción", etc.
  cantidad: number;
  porcentaje: number;
  key: string; // Para el chart config
}

export interface EstadoSociedades {
  mes: string;
  activas: number;
  enProceso: number;
  finalizadas: number;
}

export interface TopSociedad {
  id: string;
  razonSocial: string;
  totalJuntas: number;
  ultimaJunta?: string; // Fecha
  estado: "activa" | "en_proceso" | "finalizada";
}





