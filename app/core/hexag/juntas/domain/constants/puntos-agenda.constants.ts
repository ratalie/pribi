/**
 * Constantes para Puntos de Agenda
 * 
 * Todos los puntos de agenda disponibles para una junta, agrupados por categoría.
 * 
 * @see app/core/hexag/juntas/domain/constants/agenda-classification.constants.ts
 */

export interface PuntoAgenda {
  id: string;
  title: string;
  category: string;
  description?: string;
}

/**
 * Todos los puntos de agenda disponibles, agrupados por categoría
 */
export const PUNTOS_AGENDA: ReadonlyArray<PuntoAgenda> = [
  // ========================================
  // CATEGORÍA: Aumento de Capital
  // ========================================
  {
    id: "aporte-dinerarios",
    title: "Aportes dinerarios",
    category: "Aumento de Capital",
    description: "Acuerdo para aumentar capital mediante aportes en efectivo",
  },
  {
    id: "aporte-no-dinerario",
    title: "Aporte no dinerario",
    category: "Aumento de Capital",
    description: "Acuerdo para aumentar capital mediante aportes de bienes",
  },
  {
    id: "capitalizacion-creditos",
    title: "Capitalización de créditos",
    category: "Aumento de Capital",
    description: "Acuerdo para convertir créditos en capital social",
  },

  // ========================================
  // CATEGORÍA: Remoción
  // ========================================
  {
    id: "remocion-gerente",
    title: "Remoción de gerente general",
    category: "Remoción",
    description: "Acuerdo para remover al gerente general de la sociedad",
  },
  {
    id: "remocion-apoderados",
    title: "Remoción de apoderados",
    category: "Remoción",
    description: "Acuerdo para remover apoderados de la sociedad",
  },
  {
    id: "remocion-directores",
    title: "Remoción de directores",
    category: "Remoción",
    description: "Acuerdo para remover directores del directorio",
  },

  // ========================================
  // CATEGORÍA: Nombramiento
  // ========================================
  {
    id: "nombramiento-gerente",
    title: "Nombramiento de gerente general",
    category: "Nombramiento",
    description: "Acuerdo para nombrar un nuevo gerente general",
  },
  {
    id: "nombramiento-apoderados",
    title: "Nombramiento de apoderados",
    category: "Nombramiento",
    description: "Acuerdo para nombrar nuevos apoderados",
  },
  {
    id: "nombramiento-directores",
    title: "Nombramiento de directores",
    category: "Nombramiento",
    description: "Acuerdo para nombrar nuevos directores",
  },
  {
    id: "nombramiento-nuevo-directorio",
    title: "Nombramiento del nuevo directorio",
    category: "Nombramiento",
    description: "Acuerdo para nombrar un directorio completamente nuevo",
  },

  // ========================================
  // CATEGORÍA: Gestión Social y Resultados Económicos
  // ========================================
  {
    id: "pronunciamiento-gestion",
    title: "Pronunciamiento de la gestión social y resultados económicos",
    category: "Gestión Social y Resultados Económicos",
    description: "Aprobación de la gestión y resultados del ejercicio",
  },
  {
    id: "aplicacion-resultados",
    title: "Aplicación de resultados",
    category: "Gestión Social y Resultados Económicos",
    description: "Decisión sobre el destino de las utilidades del ejercicio",
  },
  {
    id: "delegacion-auditores",
    title: "Delegación a los auditores para la presentación de estados financieros",
    category: "Gestión Social y Resultados Económicos",
    description: "Autorización para que auditores presenten los EEFF",
  },
] as const;

/**
 * Obtiene todas las categorías únicas
 */
export function getCategorias(): string[] {
  const categorias = new Set(PUNTOS_AGENDA.map((p) => p.category));
  return Array.from(categorias);
}

/**
 * Obtiene puntos de agenda por categoría
 */
export function getPuntosPorCategoria(category: string): ReadonlyArray<PuntoAgenda> {
  return PUNTOS_AGENDA.filter((p) => p.category === category);
}

/**
 * Obtiene un punto de agenda por ID
 */
export function getPuntoAgendaById(id: string): PuntoAgenda | undefined {
  return PUNTOS_AGENDA.find((p) => p.id === id);
}

/**
 * Verifica si un ID es válido
 */
export function isValidPuntoAgendaId(id: string): boolean {
  return PUNTOS_AGENDA.some((p) => p.id === id);
}

