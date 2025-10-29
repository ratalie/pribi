import type { NavigationStep } from "~/types/navigationSteps";

export const societyRegisterNavigation = (mode: string): NavigationStep[] => {
  return [
    {
      title: "Datos principales",
      description: "Completa todos los datos de la Sociedad",
      status: "completed",
      route: `/registro-societario/sociedades/${mode}/datos-sociedad`,
    },
    {
      title: "Accionistas",
      description: "Agrega los accionistas de la Sociedad",
      status: "current",
      route: `/registro-societario/sociedades/${mode}/accionistas`,
    },
    {
      title: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/acciones`,
    },
  ];
};
