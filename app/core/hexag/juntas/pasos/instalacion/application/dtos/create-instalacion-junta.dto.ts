/**
 * DTO: Crear Instalación de Junta
 */

export interface CreateInstalacionJuntaDTO {
  fechaInstalacion: string; // ISO date
  tipoConvocatoria: "PRIMERA" | "SEGUNDA";
}


