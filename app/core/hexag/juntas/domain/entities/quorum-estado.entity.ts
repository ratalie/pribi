import type { OrdenConvocatoria } from '../enums/orden-convocatoria.enum';

/**
 * Estado calculado del quórum en tiempo real
 */
export interface QuorumEstado {
  /** Convocatoria activa (PRIMERA o SEGUNDA) */
  convocatoria: OrdenConvocatoria;
  
  /** Quórum requerido para mayoría simple (del snapshot) */
  quorumSimple: number;
  
  /** Quórum requerido para mayoría calificada (del snapshot) */
  quorumCalificado: number;
  
  /** Total de acciones con derecho a voto */
  totalAcciones: number;
  
  /** Acciones presentes en la junta */
  accionesPresentes: number;
  
  /** Porcentaje de asistencia (0-100) */
  porcentajePresente: number;
  
  /** Si cumple el quórum simple */
  cumpleQuorumSimple: boolean;
  
  /** Si cumple el quórum calificado */
  cumpleQuorumCalificado: boolean;
}




