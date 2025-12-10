import type { Asistencia } from '../entities/asistencia.entity';
import type { QuorumEstado } from '../entities/quorum-estado.entity';
import type { Quorum } from '../../application/dtos/snapshot-complete.dto';
import type { OrdenConvocatoria } from '../enums/orden-convocatoria.enum';

/**
 * Servicio para calcular el estado del quórum en tiempo real
 * 
 * Lógica:
 * - Obtiene quórums del snapshot (6 valores)
 * - Calcula según convocatoria activa (PRIMERA o SEGUNDA)
 * - Valida cumplimiento de quórum simple y calificado
 */
export class QuorumCalculatorService {
  /**
   * Calcula el estado del quórum
   */
  calculate(
    asistencias: Asistencia[],
    quorumsSnapshot: Quorum,
    convocatoria: OrdenConvocatoria
  ): QuorumEstado {
    // 1. Calcular total de acciones
    const totalAcciones = asistencias.reduce(
      (sum, a) => sum + a.accionesConDerechoVoto,
      0
    );
    
    // 2. Calcular acciones presentes
    const accionesPresentes = asistencias
      .filter((a) => a.asistio)
      .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    
    // 3. Calcular porcentaje
    const porcentajePresente =
      totalAcciones > 0 ? (accionesPresentes / totalAcciones) * 100 : 0;
    
    // 4. Obtener quórums según convocatoria
    const quorumSimple =
      convocatoria === 'PRIMERA'
        ? quorumsSnapshot.primeraConvocatoriaSimple
        : quorumsSnapshot.segundaConvocatoriaSimple;
    
    const quorumCalificado =
      convocatoria === 'PRIMERA'
        ? quorumsSnapshot.primeraConvocatoriaCalificada
        : quorumsSnapshot.segundaConvocatoriaCalificada;
    
    // 5. Validar cumplimiento
    const cumpleQuorumSimple = porcentajePresente >= quorumSimple;
    const cumpleQuorumCalificado = porcentajePresente >= quorumCalificado;
    
    return {
      convocatoria,
      quorumSimple,
      quorumCalificado,
      totalAcciones,
      accionesPresentes,
      porcentajePresente,
      cumpleQuorumSimple,
      cumpleQuorumCalificado,
    };
  }
}

























