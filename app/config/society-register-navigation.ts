import type { NavigationStep } from "~/types/navigationSteps";

export type SocietyNavigationBase = "registro-societario" | "registros";

export interface SocietyNavigationContext {
  base: SocietyNavigationBase;
  societyId?: string;
  flow?: "crear" | "editar";
}

const BASE_STEPS: Array<
  Pick<NavigationStep, "title" | "description" | "status"> & { slug: string }
> = [
  {
    slug: "datos-sociedad",
    title: "Datos principales",
    description: "Completa todos los datos de la Sociedad",
    status: "completed",
  },
  {
    slug: "accionistas",
    title: "Accionistas",
    description: "Agrega los accionistas de la Sociedad",
    status: "completed",
  },
  {
    slug: "acciones",
    title: "Capital Social y Acciones",
    description: "Completa información sobre las acciones",
    status: "completed",
  },
  {
    slug: "asignacion-acciones",
    title: "Asignación de Acciones",
    description: "Distribuye Tipos de Acciones entre los Accionistas",
    status: "current",
  },
  {
    slug: "directorio",
    title: "Directorio",
    description: "Configura el directorio y designa directores",
    status: "empty",
  },
  {
    slug: "registro-apoderados",
    title: "Registro de Apoderados",
    description: "Define quiénes serán los apoderados",
    status: "empty",
  },
  {
    slug: "regimen-poderes",
    title: "Régimen General de Poderes",
    description: "Configura reglas para el ejercicio de poderes",
    status: "empty",
  },
  {
    slug: "quorums-mayorias",
    title: "Quorums y Mayorías para Adopción de Acuerdos",
    description: "Asigna porcentajes para ambos casos según corresponda",
    status: "empty",
  },
  {
    slug: "acuerdos-societarios",
    title: "Acuerdos Societarios Especiales",
    description: "Completa la información según corresponda",
    status: "empty",
  },
  {
    slug: "resumen",
    title: "Resumen",
    description: "Visualiza un resumen de los datos",
    status: "empty",
  },
];

const buildLegacyModeSegment = (context: SocietyNavigationContext) => {
  if (context.flow === "crear") return "crear";
  if (context.flow === "editar" && context.societyId) {
    return `editar/${context.societyId}`;
  }
  if (context.societyId) {
    return `editar/${context.societyId}`;
  }
  return context.flow ?? "crear";
};

const buildRoute = (slug: string, context: SocietyNavigationContext) => {
  if (context.base === "registros") {
    const id = context.societyId ?? ":id";
    return `/registros/sociedades/${id}/${slug}`;
  }
  const modeSegment = buildLegacyModeSegment(context);
  return `/registro-societario/sociedades/${modeSegment}/${slug}`;
};

export const societyRegisterNavigation = (
  context: SocietyNavigationContext
): NavigationStep[] => {
  return BASE_STEPS.map((step) => ({
    title: step.title,
    description: step.description,
    status: step.status,
    route: buildRoute(step.slug, context),
  }));
};
