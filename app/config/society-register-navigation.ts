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
      status: "completed",
      route: `/registro-societario/sociedades/${mode}/accionistas`,
    },
    {
      title: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      status: "completed",
      route: `/registro-societario/sociedades/${mode}/acciones`,
    },
    {
      title: "Asignación de Acciones",
      description: "Distribuye Tipos de Acciones entre los Accionistas",
      status: "current",
      route: `/registro-societario/sociedades/${mode}/asignacion-acciones`,
    },
    {
      title: "Directorio",
      description: "Configura el directorio y designa directores",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/directorio`,
    },
    {
      title: "Registro de Apoderados",
      description: "Define quiénes serán los apoderados",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/registro-apoderados`,
    },
    {
      title: "Régimen General de Poderes",
      description: "Configura reglas para el ejercicio de poderes",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/regimen-poderes`,
    },
    {
      title: "Quorums y Mayorías para Adopción de Acuerdos",
      description: "Asigna porcentajes para ambos casos según corresponda",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/quorums-mayorias`,
    },
    {
      title: "Acuerdos Societarios Especiales",
      description: "Completa la información según corresponda",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/acuerdos-societarios`,
    },
    {
      title: "Resumen",
      description: "Visualiza un resumen de los datos",
      status: "empty",
      route: `/registro-societario/sociedades/${mode}/resumen`,
    },
  ];
};
