/**
 * Entidad: Instalación de Junta
 */

export interface InstalacionJuntaEntity {
  id: string;
  juntaId: string;
  fechaInstalacion: Date;
  tipoConvocatoria: "PRIMERA" | "SEGUNDA";
  quorumPresente: number; // Porcentaje
  instalada: boolean;
  createdAt: Date;
  updatedAt: Date;
}


