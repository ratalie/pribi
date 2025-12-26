/**
 * Entidad: Selección de Agenda
 * 
 * Representa la selección de puntos de agenda para una junta de accionistas.
 */

export interface SeleccionAgendaEntity {
  id: string;
  juntaId: string;
  puntosSeleccionados: string[]; // IDs de puntos de agenda
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidad: Punto de Agenda (Catálogo)
 * 
 * Representa un punto de agenda disponible para seleccionar.
 */
export interface PuntoAgendaEntity {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "AUMENTO_CAPITAL" | "NOMBRAMIENTO" | "REMOCION" | "GESTION_SOCIAL";
  requiereVotacion: boolean;
  orden?: number;
}


