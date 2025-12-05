/**
 * Entidad: Detalles de la Junta
 * 
 * Representa los detalles de configuración de una junta de accionistas.
 */

export interface DetallesJuntaEntity {
  id: string;
  juntaId: string;
  tipoJunta: "GENERAL" | "ESPECIAL" | "UNIVERSAL";
  modoRealizacion: "PRESENCIAL" | "VIRTUAL" | "MIXTA";
  fechaJunta: Date;
  horaJunta: string; // HH:mm formato
  lugarJunta?: string;
  enlaceVirtual?: string;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}


