/**
 * Configuración de secciones para cada sub-step
 *
 * Define las secciones que aparecen en el sidebar derecho para cada acuerdo
 */

import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Mapeo de sub-steps a sus secciones base (sin estados)
 */
export const SUB_STEP_SECTIONS_MAP: Record<string, Array<Omit<SectionItem, "status">>> = {
  "aporte-dinerarios": [
    {
      id: "aporte-dinerario",
      title: "Aporte Dinerario",
      navigationType: "route",
    },
    {
      id: "seleccion-aportantes",
      title: "Selección de Aportantes",
      navigationType: "route",
    },
    {
      id: "aportes-dinerarios",
      title: "Registro de Aportes Dinerarios",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación del Aumento de Capital",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "capitalizacion-creditos": [
    {
      id: "capitalizacion-creditos",
      title: "Capitalización de Créditos",
      navigationType: "route",
    },
    {
      id: "acreedores",
      title: "Acreedores",
      navigationType: "route",
    },
    {
      id: "creditos",
      title: "Créditos",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
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
      navigationType: "route",
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
  "pronunciamiento-gestion": [
    {
      id: "pronunciamiento-gestion",
      title: "Pronunciamiento de Gestión",
      description: "Vista general",
      navigationType: "route",
    },
    {
      id: "pronunciamiento",
      title: "Pronunciamiento",
      description: "Registro del informe",
      navigationType: "route",
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
  "delegacion-auditores": [
    {
      id: "nombramiento-auditores",
      title: "Nombramiento de Auditores",
      description: "Vista general",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Designación",
      description: "Registra los auditores propuestos",
      navigationType: "route",
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
  // Remociones
  "remocion-gerente": [
    {
      id: "remocion-gerente",
      title: "Remoción del Gerente General",
      navigationType: "route",
    },
    {
      id: "remocion",
      title: "Gerente General",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "remocion-apoderados": [
    {
      id: "remocion-apoderados",
      title: "Remoción de Apoderados",
      navigationType: "route",
    },
    {
      id: "remocion",
      title: "Selección de Apoderados",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "remocion-directores": [
    {
      id: "remocion-directores",
      title: "Remoción de Directores",
      navigationType: "route",
    },
    {
      id: "remocion",
      title: "Directores",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  // Nombramientos
  "nombramiento-gerente": [
    {
      id: "nombramiento-gerente",
      title: "Nombramiento de Gerente General",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Gerente General",
      navigationType: "route",
    },
    {
      id: "otorgamiento",
      title: "Otorgamiento de Poderes",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "nombramiento-apoderados": [
    {
      id: "nombramiento-apoderados",
      title: "Nombramiento de Apoderados",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Selección de Apoderados",
      navigationType: "route",
    },
    {
      id: "otorgamiento-poderes",
      title: "Otorgamiento de Poderes",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "nombramiento-nuevo-directorio": [
    {
      id: "nombramiento-directorio",
      title: "Nombramiento de Nuevo Directorio",
      navigationType: "route",
    },
    {
      id: "cantidad",
      title: "Configurar Directorio",
      navigationType: "route",
    },
    {
      id: "votacion-configuracion",
      title: "Votación de la Configuración del Directorio",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Designación de Directores",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación de la Designación",
      navigationType: "route",
    },
    {
      id: "presidente",
      title: "Presidente del Directorio",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      navigationType: "route",
    },
  ],
  "nombramiento-directores": [
    {
      id: "nombramiento-directores",
      title: "Nombramiento de Directores",
      description: "Vista general",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Nombramiento",
      description: "Registra los directores propuestos",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación",
      description: "Registra la votación",
      navigationType: "route",
    },
    {
      id: "presidente",
      title: "Presidente",
      description: "Define el presidente del directorio",
      navigationType: "route",
    },
    {
      id: "resumen",
      title: "Resumen",
      description: "Revisa el resumen",
      navigationType: "route",
    },
  ],
  "nombramiento-directorio": [
    {
      id: "nombramiento-directorio",
      title: "Nombramiento de Directorio",
      description: "Vista general",
      navigationType: "route",
    },
    {
      id: "nombramiento",
      title: "Configuración del directorio",
      description: "Detalla la propuesta de directorio",
      navigationType: "route",
    },
    {
      id: "cantidad",
      title: "Votacion para la configuración del directorio",
      description: "Establece el número de integrantes",
      navigationType: "route",
    },
    {
      id: "directores",
      title: "Designación de Directores",
      description: "Designa los directores del directorio",
      navigationType: "route",
    },
    {
      id: "votacion",
      title: "Votación para la designación",
      description: "Registra la aprobación o rechazo de los directores",
      navigationType: "route",
    },
    {
      id: "presidente",
      title: "Presidente del directorio",
      description: "Registra el presidente del directorio",
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
