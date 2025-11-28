/**
 * Configuración de secciones para cada sub-step
 * 
 * Define las secciones que aparecen en el sidebar derecho para cada acuerdo
 */

import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Mapeo de sub-steps a sus secciones base (sin estados)
 */
export const SUB_STEP_SECTIONS_MAP: Record<
  string,
  Array<Omit<SectionItem, "status">>
> = {
  "aporte-dinerarios": [
    {
      id: "aporte-dinerario",
      title: "Aporte Dinerario",
      description: "Vista general del acuerdo",
      navigationType: "route",
    },
    {
      id: "seleccion-aportantes",
      title: "Selección de Aportantes",
      description: "Selecciona los aportantes",
      navigationType: "route",
    },
    {
      id: "aportes-dinerarios",
      title: "Aportes Dinerarios",
      description: "Completa los montos de aporte",
      navigationType: "route",
    },
    {
      id: "test-anclas",
      title: "Test por Anclas",
      description: "Prueba de hijos con anclas",
      navigationType: "anchor",
      subSections: [
        {
          id: "ancla-1",
          title: "Ancla 1: Introducción",
          description: "Primera sección de prueba",
          navigationType: "anchor",
        },
        {
          id: "ancla-2",
          title: "Ancla 2: Desarrollo",
          description: "Segunda sección de prueba",
          navigationType: "anchor",
        },
        {
          id: "ancla-3",
          title: "Ancla 3: Conclusión",
          description: "Tercera sección de prueba",
          navigationType: "anchor",
        },
      ],
    },
    {
      id: "test-rutas",
      title: "Test por Rutas",
      description: "Prueba de hijos con rutas",
      navigationType: "route",
      subSections: [
        {
          id: "ruta-1",
          title: "Ruta 1: Primera Página",
          description: "Navega a página de prueba 1",
          navigationType: "route",
        },
        {
          id: "ruta-2",
          title: "Ruta 2: Segunda Página",
          description: "Navega a página de prueba 2",
          navigationType: "route",
        },
        {
          id: "ruta-3",
          title: "Ruta 3: Tercera Página",
          description: "Navega a página de prueba 3",
          navigationType: "route",
        },
      ],
    },
    {
      id: "votacion",
      title: "Votación",
      description: "Registra la votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      description: "Revisa el resumen",
      navigationType: "route",
    },
  ],
  "aplicacion-resultados": [
    {
      id: "aplicacion-resultados",
      title: "Aplicación de Resultados",
      description: "Vista general",
      navigationType: "route",
    },
    {
      id: "utilidades-montos",
      title: "Utilidades y Montos a Distribuir",
      description: "Cálculos y valores",
      navigationType: "anchor",
      subSections: [
        {
          id: "valores-preliminares",
          title: "Valores Preliminares",
          navigationType: "anchor",
        },
        {
          id: "calculo-utilidad-antes-reserva",
          title: "Cálculo de la Utilidad antes de la Reserva Legal",
          navigationType: "anchor",
        },
        {
          id: "calculo-reserva-legal",
          title: "Cálculo de la Reserva Legal",
          navigationType: "anchor",
        },
        {
          id: "valores-utilidad-distribuible",
          title: "Valores de la Utilidad Distribuible",
          navigationType: "anchor",
        },
      ],
    },
    {
      id: "votacion",
      title: "Votación",
      description: "Registra la votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      description: "Revisa el resumen",
      navigationType: "route",
    },
  ],
};

/**
 * Obtiene las secciones base para un sub-step
 */
export function getBaseSectionsForSubStep(
  subStepId: string
): Array<Omit<SectionItem, "status">> {
  return SUB_STEP_SECTIONS_MAP[subStepId] || [];
}

/**
 * Aplica estados a las secciones basándose en la sección actual
 */
export function applySectionStatuses(
  sections: Array<Omit<SectionItem, "status">>,
  currentSectionId?: string
): SectionItem[] {
  if (!currentSectionId) {
    return sections.map((section, index) => ({
      ...section,
      status: index === 0 ? "current" : "upcoming",
    }));
  }

  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  return sections.map((section, index) => {
    if (index < currentIndex) {
      return { ...section, status: "completed" as const };
    } else if (index === currentIndex) {
      return { ...section, status: "current" as const };
    } else {
      return { ...section, status: "upcoming" as const };
    }
  });
}

