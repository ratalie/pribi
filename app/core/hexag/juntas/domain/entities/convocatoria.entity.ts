import type { ModoReunion } from '../enums/modo-reunion.enum';

/**
 * Entidad de dominio que representa una convocatoria o detalle de junta
 */
export interface Convocatoria {
  direccion: string; // Dirección física si es PRESENCIAL, o link si es VIRTUAL
  modo: ModoReunion;
  fecha: Date;
  hora: Date;
}

