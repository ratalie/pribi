/**
 * DTO: Crear Detalles de Junta
 * 
 * Formato que el backend espera para crear/actualizar detalles.
 */

export interface CreateDetallesJuntaDTO {
  tipoJunta: "GENERAL" | "ESPECIAL" | "UNIVERSAL";
  modoRealizacion: "PRESENCIAL" | "VIRTUAL" | "MIXTA";
  fechaJunta: string; // ISO string (YYYY-MM-DD)
  horaJunta: string; // HH:mm
  lugarJunta?: string;
  enlaceVirtual?: string;
  observaciones?: string;
}


