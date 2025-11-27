import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import type { JuntaNavigationContext } from "~/types/junta-navigation.types";
import type { NavigationStep, NavigationSubStep } from "~/types/navigationSteps";

/**
 * Configuración base de los 6 pasos principales del flujo de Juntas
 */
const BASE_STEPS: Array<
  Pick<NavigationStep, "title" | "description" | "status"> & { slug: string }
> = [
  {
    slug: "seleccion-agenda",
    title: "Puntos de Agenda",
    description: "Selecciona los puntos a incluir en la junta",
    status: "completed",
  },
  {
    slug: "detalles",
    title: "Detalles de la Junta",
    description: "Completa la información de la Junta",
    status: "completed",
  },
  {
    slug: "instalacion",
    title: "Instalación de la Junta",
    description: "Registra representante, asistencia y autoridades",
    status: "completed",
  },
  {
    slug: "puntos-acuerdo",
    title: "Puntos de Acuerdo",
    description: "Completa las acciones y decisiones adoptadas",
    status: "current",
  },
  {
    slug: "resumen",
    title: "Resumen",
    description: "Visualiza un resumen de los datos",
    status: "empty",
  },
  {
    slug: "descargar",
    title: "Documentos Generados",
    description: "Visualiza o descarga los documentos finales",
    status: "empty",
  },
];

/**
 * Configuración base de TODOS los sub-steps posibles del Paso 4
 * Estos se filtrarán dinámicamente según lo seleccionado en Paso 1
 */
const BASE_SUB_STEPS: Array<
  Pick<NavigationSubStep, "id" | "title" | "category"> & { parentSlug: string }
> = [
  // CATEGORÍA: Aumento de Capital
  {
    id: "aporte-dinerarios",
    title: "Aporte Dinerario",
    category: "Aumento de Capital",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "aporte-no-dinerario",
    title: "Aporte no Dinerario",
    category: "Aumento de Capital",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "capitalizacion-creditos",
    title: "Capitalización de Créditos",
    category: "Aumento de Capital",
    parentSlug: "puntos-acuerdo",
  },

  // CATEGORÍA: Remoción
  {
    id: "remocion-gerente",
    title: "Remoción de Gerente General",
    category: "Remoción",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "remocion-apoderados",
    title: "Remoción de Apoderados",
    category: "Remoción",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "remocion-directores",
    title: "Remoción de Directores",
    category: "Remoción",
    parentSlug: "puntos-acuerdo",
  },

  // CATEGORÍA: Nombramiento
  {
    id: "nombramiento-gerente",
    title: "Nombramiento de Gerente General",
    category: "Nombramiento",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "nombramiento-apoderados",
    title: "Nombramiento de Apoderados",
    category: "Nombramiento",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "nombramiento-directores",
    title: "Nombramiento de Directores",
    category: "Nombramiento",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "nombramiento-nuevo-directorio",
    title: "Nombramiento del Nuevo Directorio",
    category: "Nombramiento",
    parentSlug: "puntos-acuerdo",
  },

  // CATEGORÍA: Gestión Social y Resultados Económicos
  {
    id: "pronunciamiento-gestion",
    title: "Pronunciamiento de la Gestión Social y Resultados Económicos",
    category: "Gestión Social y Resultados Económicos",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "aplicacion-resultados",
    title: "Aplicación de Resultados",
    category: "Gestión Social y Resultados Económicos",
    parentSlug: "puntos-acuerdo",
  },
  {
    id: "delegacion-auditores",
    title:
      "Designación y/o Delegación en el Directorio de la Designación de Auditores Externos",
    category: "Gestión Social y Resultados Económicos",
    parentSlug: "puntos-acuerdo",
  },
];

/**
 * Construye la ruta para un paso principal
 *
 * Si hay juntaId, incluye el ID en la ruta.
 * Si no hay juntaId, usa la ruta sin ID (para flujos nuevos).
 */
const buildRoute = (slug: string, context: JuntaNavigationContext): string => {
  if (context.juntaId) {
    return `/operaciones/junta-accionistas/${context.juntaId}/${slug}`;
  }
  // Para flujos nuevos sin ID aún
  return `/operaciones/junta-accionistas/${slug}`;
};

/**
 * Construye la ruta para un sub-step
 *
 * NOTA: La estructura actual tiene los sub-steps directamente bajo /operaciones/junta-accionistas/
 * Ejemplo: /operaciones/junta-accionistas/aporte-dinerario
 *
 * Si en el futuro se cambia a /operaciones/junta-accionistas/[id]/puntos-acuerdo/[sub-step],
 * actualizar esta función.
 */
const buildSubStepRoute = (subStepId: string, context: JuntaNavigationContext): string => {
  // Mapeo de IDs de sub-steps a slugs de rutas
  const subStepSlugMap: Record<string, string> = {
    "aporte-dinerarios": "aporte-dinerario",
    "aporte-no-dinerario": "aporte-no-dinerario",
    "capitalizacion-creditos": "capitalizacion-creditos",
    "remocion-gerente": "remocion-gerente",
    "remocion-apoderados": "remocion-apoderados",
    "remocion-directores": "remocion-directores",
    "nombramiento-gerente": "nombramiento-gerente",
    "nombramiento-apoderados": "nombramiento-apoderados",
    "nombramiento-directores": "nombramiento-directores",
    "nombramiento-nuevo-directorio": "nombramiento-directorio",
    "pronunciamiento-gestion": "pronunciamiento-gestion",
    "aplicacion-resultados": "aplicacion-resultados",
    "delegacion-auditores": "nombramiento-auditores",
  };

  const slug = subStepSlugMap[subStepId] || subStepId;

  if (context.juntaId) {
    return `/operaciones/junta-accionistas/${context.juntaId}/${slug}`;
  }
  // Para flujos nuevos sin ID aún
  return `/operaciones/junta-accionistas/${slug}`;
};

/**
 * Genera la configuración de navegación para Juntas de Accionistas
 *
 * ⭐ CARACTERÍSTICA CLAVE: Filtrado dinámico de sub-steps
 * Los sub-steps del Paso 4 se filtran según lo seleccionado en Paso 1
 *
 * @param context Contexto de navegación (juntaId, flow)
 * @returns Array de NavigationStep con sub-steps filtrados
 */
export const juntaNavigation = (context: JuntaNavigationContext): NavigationStep[] => {
  // Obtener sub-steps seleccionados desde el store
  const juntasFlowStore = useJuntasFlowStore();
  const dynamicSubSteps = juntasFlowStore.getDynamicSubSteps;

  console.log("🟡 [juntaNavigation] dynamicSubSteps desde store:", dynamicSubSteps);

  return BASE_STEPS.map((step) => {
    // Si es el paso "puntos-acuerdo", filtrar sub-steps dinámicamente
    if (step.slug === "puntos-acuerdo") {
      console.log("🟡 [juntaNavigation] Procesando paso 'puntos-acuerdo'");
      
      // Si NO hay sub-steps seleccionados, devolver paso sin sub-steps (pero siempre desplegable)
      if (dynamicSubSteps.length === 0) {
        console.log("🟡 [juntaNavigation] No hay sub-steps seleccionados, retornando paso sin sub-steps");
        return {
          title: step.title,
          description: step.description,
          status: step.status,
          route: buildRoute(step.slug, context),
          subSteps: [], // Array vacío pero el paso sigue siendo desplegable
        };
      }

      console.log("🟡 [juntaNavigation] Filtrando sub-steps. Total BASE_SUB_STEPS:", BASE_SUB_STEPS.length);

      // Filtrar sub-steps según los seleccionados en Paso 1
      const filteredSubSteps: NavigationSubStep[] = BASE_SUB_STEPS.filter(
        (sub) => sub.parentSlug === "puntos-acuerdo"
      )
        .filter((sub) => {
          const isIncluded = dynamicSubSteps.includes(sub.id);
          console.log(`🟡 [juntaNavigation] Sub-step '${sub.id}': ${isIncluded ? 'INCLUIDO' : 'EXCLUIDO'}`);
          return isIncluded;
        })
        .map((sub) => ({
          id: sub.id,
          title: sub.title,
          category: sub.category,
          status: "empty" as const,
          route: buildSubStepRoute(sub.id, context),
        }));

      console.log("🟡 [juntaNavigation] Sub-steps filtrados:", filteredSubSteps.length, filteredSubSteps.map(s => s.id));

      return {
        title: step.title,
        description: step.description,
        status: step.status,
        route: buildRoute(step.slug, context),
        subSteps: filteredSubSteps,
      };
    }

    // Para los demás pasos, no hay sub-steps
    return {
      title: step.title,
      description: step.description,
      status: step.status,
      route: buildRoute(step.slug, context),
    };
  });
};
