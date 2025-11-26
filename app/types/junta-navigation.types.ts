/**
 * Tipos específicos para la navegación del flujo de Juntas de Accionistas
 */

export interface JuntaNavigationContext {
  base: "operaciones";
  juntaId?: string;
  flow?: "crear" | "editar";
}

export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  status?: "current" | "upcoming" | "completed";
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

