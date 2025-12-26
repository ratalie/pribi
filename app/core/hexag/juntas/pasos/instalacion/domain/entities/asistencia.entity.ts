/**
 * Entidad: Asistencia a Junta
 */

export interface AsistenciaEntity {
  id: string;
  juntaId: string;
  accionistaId: string;
  asistio: boolean;
  representadoPorId?: string; // ID de representante si aplica
  numeroAcciones: number;
  porcentajeParticipacion: number;
  createdAt: Date;
  updatedAt: Date;
}


