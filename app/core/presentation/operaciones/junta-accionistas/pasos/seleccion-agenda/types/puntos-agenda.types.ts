/**
 * Types y constantes para puntos de agenda
 */

export type PuntoAgenda = {
  id: string;
  title: string;
  category: string;
};

// Todos los sub-steps posibles, agrupados por categoría
export const PUNTOS_AGENDA: readonly PuntoAgenda[] = [
  // CATEGORÍA: Aumento de Capital
  {
    id: "aporte-dinerarios",
    title: "Aportes dinerarios",
    category: "Aumento de Capital",
  },
  {
    id: "aporte-no-dinerario",
    title: "Aporte no dinerario",
    category: "Aumento de Capital",
  },
  {
    id: "capitalizacion-creditos",
    title: "Capitalización de créditos",
    category: "Aumento de Capital",
  },

  // CATEGORÍA: Remoción
  {
    id: "remocion-gerente",
    title: "Remoción de gerente general",
    category: "Remoción",
  },
  {
    id: "remocion-apoderados",
    title: "Remoción de apoderados",
    category: "Remoción",
  },
  {
    id: "remocion-directores",
    title: "Remoción de directores",
    category: "Remoción",
  },

  // CATEGORÍA: Nombramiento
  {
    id: "nombramiento-gerente",
    title: "Nombramiento de gerente general",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-apoderados",
    title: "Nombramiento de apoderados",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-directores",
    title: "Nombramiento de directores",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-nuevo-directorio",
    title: "Nombramiento del nuevo directorio",
    category: "Nombramiento",
  },

  // CATEGORÍA: Gestión Social y Resultados Económicos
  {
    id: "pronunciamiento-gestion",
    title: "Pronunciamiento de la gestión social y resultados económicos",
    category: "Gestión Social y Resultados Económicos",
  },
  {
    id: "aplicacion-resultados",
    title: "Aplicación de resultados",
    category: "Gestión Social y Resultados Económicos",
  },
  {
    id: "delegacion-auditores",
    title:
      "Designación y/o delegación en el directorio de la designación de auditores externos",
    category: "Gestión Social y Resultados Económicos",
  },
] as const;

// Puntos obligatorios para Junta Obligatoria Anual
export const PUNTOS_JUNTA_OBLIGATORIA = [
  "pronunciamiento-gestion",
  "aplicacion-resultados",
  "delegacion-auditores",
] as const;

