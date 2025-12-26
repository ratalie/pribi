/**
 * Tipos específicos para la navegación del flujo de Juntas de Accionistas
 */

export interface JuntaNavigationContext {
  base: "operaciones";
  societyId?: string | number;
  flowId?: string | number;
  /** @deprecated Usar flowId en su lugar */
  juntaId?: string;
  flow?: "crear" | "editar";
}

export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  status?: "current" | "upcoming" | "completed";
  // Soporte para sub-secciones (anclas dentro de la misma página)
  subSections?: SectionItem[];
  // Tipo de navegación: 'route' (nueva página) o 'anchor' (ancla en la misma página)
  navigationType?: "route" | "anchor";
  // Ruta completa (solo para navigationType: 'route')
  route?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  status?: "current" | "upcoming" | "completed";
  subSteps?: WizardSubStep[];
}

export interface WizardSubStep {
  id: string;
  title: string;
  category?: string;
  status?: "current" | "upcoming" | "completed";
}

