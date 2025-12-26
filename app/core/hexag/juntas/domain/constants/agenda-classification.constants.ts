/**
 * Clasificación de Puntos de Agenda
 * 
 * Los puntos de agenda se clasifican en:
 * - SIMPLE: Requieren mayoría simple para aprobarse
 * - CALIFICADO: Requieren mayoría calificada para aprobarse
 * 
 * @see puntos-agenda.constants.ts - Para el catálogo completo de puntos
 */

import { getPuntoAgendaById } from './puntos-agenda.constants';

export enum TipoAcuerdo {
  SIMPLE = 'SIMPLE',
  CALIFICADO = 'CALIFICADO',
}

/**
 * Puntos de Agenda que requieren MAYORÍA SIMPLE
 * 
 * Incluye:
 * - Aprobación de EEFF y memoria
 * - Aplicación de utilidades/dividendos
 * - Elección y remoción de directores
 * - Designación de gerente, apoderados, etc.
 */
export const PUNTOS_SIMPLES = [
  // Gestión Social y Resultados Económicos
  'pronunciamiento-gestion',
  'aplicacion-resultados',
  'delegacion-auditores',
  
  // Remoción
  'remocion-gerente',
  'remocion-apoderados',
  'remocion-directores',
  
  // Nombramiento
  'nombramiento-gerente',
  'nombramiento-apoderados',
  'nombramiento-directores',
  'nombramiento-nuevo-directorio',
] as const;

/**
 * Puntos de Agenda que requieren MAYORÍA CALIFICADA
 * 
 * Incluye:
 * - Aumento de capital (cualquier modalidad)
 * - Modificación de estatutos
 * - Reducción de capital
 */
export const PUNTOS_CALIFICADOS = [
  // Aumento de Capital
  'aporte-dinerarios',
  'aporte-no-dinerario',
  'capitalizacion-creditos',
] as const;

/**
 * Obtiene el tipo de acuerdo de un punto de agenda
 * 
 * @param puntoId - ID del punto de agenda
 * @returns TipoAcuerdo.SIMPLE o TipoAcuerdo.CALIFICADO
 */
export function getTipoAcuerdo(puntoId: string): TipoAcuerdo {
  if (PUNTOS_CALIFICADOS.includes(puntoId as any)) {
    return TipoAcuerdo.CALIFICADO;
  }
  return TipoAcuerdo.SIMPLE;
}

/**
 * Labels amigables para mostrar en la UI
 */
export const LABELS_PUNTOS: Record<string, string> = {
  // SIMPLES - Gestión Social y Resultados Económicos
  'pronunciamiento-gestion': 'Gestión social y resultados económicos',
  'aplicacion-resultados': 'Aplicación de utilidades/dividendos',
  'delegacion-auditores': 'Designación de auditores',
  
  // SIMPLES - Remoción
  'remocion-gerente': 'Remoción de gerente',
  'remocion-apoderados': 'Remoción de apoderados',
  'remocion-directores': 'Remoción de directores',
  
  // SIMPLES - Nombramiento
  'nombramiento-gerente': 'Nombramiento de gerente',
  'nombramiento-apoderados': 'Nombramiento de apoderados',
  'nombramiento-directores': 'Nombramiento de directores',
  'nombramiento-nuevo-directorio': 'Nombramiento de directorio',
  
  // CALIFICADOS - Aumento de Capital
  'aporte-dinerarios': 'Aporte dinerario',
  'aporte-no-dinerario': 'Aporte no dinerario',
  'capitalizacion-creditos': 'Capitalización de créditos',
};

/**
 * Obtiene el label amigable de un punto de agenda
 * 
 * @param puntoId - ID del punto de agenda
 * @returns Label amigable o el ID si no existe
 */
export function getLabelPunto(puntoId: string): string {
  return LABELS_PUNTOS[puntoId] || puntoId;
}

/**
 * Filtra puntos por tipo de acuerdo
 * 
 * @param puntos - Array de IDs de puntos
 * @param tipo - Tipo de acuerdo a filtrar
 * @returns Array de puntos filtrados
 */
export function filtrarPorTipo(puntos: string[], tipo: TipoAcuerdo): string[] {
  return puntos.filter((id) => getTipoAcuerdo(id) === tipo);
}

