import { routeMap } from "~/config/progress-navbar-map";
import type { ProgressNavigationContext } from "~/config/progress-navbar-map";
import { useJuntasNavbarStore } from "~/stores/useJuntasNavbarStore";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

/**
 * Composable para gestionar la navegación del flujo de Juntas de Accionistas
 * 
 * Detecta la ruta actual, carga los pasos correspondientes y calcula
 * el paso actual, sub-step actual y sección actual.
 */
export const useJuntasNavbarRoutes = () => {
  const route = useRoute();
  const juntasNavbarStore = useJuntasNavbarStore();
  const juntasFlowStore = useJuntasFlowStore();

  /**
   * Extrae el ID de la junta de los parámetros de la ruta
   */
  const extractJuntaId = (): string | undefined => {
    const param = route.params.id;
    if (typeof param === "string" && param.length > 0) return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  };

  /**
   * Resuelve el contexto de navegación (juntaId, flow)
   */
  const resolveContext = (): ProgressNavigationContext => {
    const path = route.path;
    const flow = path.includes("/crear")
      ? "crear"
      : path.includes("/editar")
        ? "editar"
        : undefined;
    return {
      juntaId: extractJuntaId(),
      flow,
    };
  };

  /**
   * Extrae el slug del paso actual desde la ruta
   * Ejemplos:
   * - /operaciones/junta-accionistas/123/seleccion-agenda -> "seleccion-agenda"
   * - /operaciones/junta-accionistas/seleccion-agenda -> "seleccion-agenda"
   * - /operaciones/junta-accionistas/123/detalles -> "detalles"
   */
  const extractCurrentStepSlug = (): string | undefined => {
    const path = route.path;
    
    // Lista de slugs de pasos principales (excluyendo sub-steps)
    const mainStepSlugs = [
      "seleccion-agenda",
      "detalles",
      "instalacion",
      "puntos-acuerdo",
      "resumen",
      "descargar",
    ];

    // Lista de slugs de sub-steps (para excluirlos)
    const subStepSlugs = [
      "aporte-dinerario",
      "aporte-no-dinerario",
      "capitalizacion-creditos",
      "remocion-gerente",
      "remocion-apoderados",
      "remocion-directores",
      "nombramiento-gerente",
      "nombramiento-apoderados",
      "nombramiento-directores",
      "nombramiento-directorio",
      "pronunciamiento-gestion",
      "aplicacion-resultados",
      "nombramiento-auditores",
    ];

    // Patrón 1: Con ID: /operaciones/junta-accionistas/[id]/[slug]
    let match = path.match(/\/operaciones\/junta-accionistas\/[^/]+\/([^/]+)(?:\/|$)/);
    if (match && match[1]) {
      const slug = match[1];
      // Si es un paso principal y no es un sub-step, retornarlo
      if (mainStepSlugs.includes(slug) && !subStepSlugs.includes(slug)) {
        return slug;
      }
    }
    
    // Patrón 2: Sin ID: /operaciones/junta-accionistas/[slug]
    match = path.match(/\/operaciones\/junta-accionistas\/([^/]+)(?:\/|$)/);
    if (match && match[1]) {
      const slug = match[1];
      // Si es un paso principal y no es un sub-step, retornarlo
      if (mainStepSlugs.includes(slug) && !subStepSlugs.includes(slug)) {
        return slug;
      }
    }
    
    return undefined;
  };

  /**
   * Extrae el ID del sub-step actual desde la ruta
   * 
   * NOTA: La estructura actual tiene los sub-steps directamente bajo /operaciones/junta-accionistas/
   * Ejemplos:
   * - /operaciones/junta-accionistas/123/aporte-dinerario -> "aporte-dinerarios"
   * - /operaciones/junta-accionistas/aporte-dinerario -> "aporte-dinerarios"
   * 
   * Mapeo de slugs a IDs de sub-steps
   */
  const extractCurrentSubStepId = (): string | undefined => {
    const path = route.path;
    
    // Lista de slugs de sub-steps (coinciden con las carpetas)
    const subStepSlugs = [
      "aporte-dinerario",
      "aporte-no-dinerario",
      "capitalizacion-creditos",
      "remocion-gerente",
      "remocion-apoderados",
      "remocion-directores",
      "nombramiento-gerente",
      "nombramiento-apoderados",
      "nombramiento-directores",
      "nombramiento-directorio",
      "pronunciamiento-gestion",
      "aplicacion-resultados",
      "nombramiento-auditores", // delegacion-auditores
    ];

    // Mapeo inverso: slug -> ID
    const slugToIdMap: Record<string, string> = {
      "aporte-dinerario": "aporte-dinerarios",
      "aporte-no-dinerario": "aporte-no-dinerario",
      "capitalizacion-creditos": "capitalizacion-creditos",
      "remocion-gerente": "remocion-gerente",
      "remocion-apoderados": "remocion-apoderados",
      "remocion-directores": "remocion-directores",
      "nombramiento-gerente": "nombramiento-gerente",
      "nombramiento-apoderados": "nombramiento-apoderados",
      "nombramiento-directores": "nombramiento-directores",
      "nombramiento-directorio": "nombramiento-nuevo-directorio",
      "pronunciamiento-gestion": "pronunciamiento-gestion",
      "aplicacion-resultados": "aplicacion-resultados",
      "nombramiento-auditores": "delegacion-auditores",
    };

    // Buscar si la ruta contiene algún slug de sub-step
    for (const slug of subStepSlugs) {
      // Patrón 1: Con ID: /operaciones/junta-accionistas/[id]/[slug]
      let match = path.match(new RegExp(`/operaciones/junta-accionistas/[^/]+/${slug}(?:/|$)`));
      if (match) {
        return slugToIdMap[slug];
      }
      // Patrón 2: Sin ID: /operaciones/junta-accionistas/[slug]
      match = path.match(new RegExp(`/operaciones/junta-accionistas/${slug}(?:/|$)`));
      if (match) {
        return slugToIdMap[slug];
      }
    }

    return undefined;
  };

  /**
   * Extrae el ID de la sección actual desde el hash de la ruta
   * Ejemplo: /operaciones/junta-accionistas/123/puntos-acuerdo/aporte-dinerarios#aportes -> "aportes"
   */
  const extractCurrentSectionId = (): string | undefined => {
    const hash = route.hash;
    if (hash && hash.startsWith("#")) {
      return hash.substring(1);
    }
    return undefined;
  };

  /**
   * Watch la ruta y actualizar los pasos cuando cambia
   */
  watch(
    () => route.path,
    (newPath) => {
      console.log("🟠 [useJuntasNavbarRoutes] Ruta cambiada:", newPath);
      const context = resolveContext();
      for (const rule of routeMap) {
        if (rule.match(newPath)) {
          const steps = rule.getSteps(context);
          console.log("🟠 [useJuntasNavbarRoutes] Pasos generados:", steps.length, steps.map(s => ({ title: s.title, subSteps: s.subSteps?.length || 0 })));
          juntasNavbarStore.setSteps(steps);
          
          // Actualizar estado del store con el paso actual
          const stepSlug = extractCurrentStepSlug();
          if (stepSlug) {
            juntasFlowStore.setCurrentStep(stepSlug);
            console.log("🟠 [useJuntasNavbarRoutes] Paso actual:", stepSlug);
          }
          
          // Actualizar estado del store con el sub-step actual
          const subStepId = extractCurrentSubStepId();
          console.log("🟠 [useJuntasNavbarRoutes] extractCurrentSubStepId resultado:", subStepId);
          if (subStepId) {
            juntasFlowStore.setCurrentSubStep(subStepId);
            console.log("🟠 [useJuntasNavbarRoutes] Sub-step actual establecido en store:", subStepId);
          } else {
            juntasFlowStore.setCurrentSubStep("");
            console.log("🟠 [useJuntasNavbarRoutes] No hay sub-step, limpiando store");
          }
          
          return;
        }
      }

      // Si no hay regla que coincida, limpiar pasos
      console.log("🟠 [useJuntasNavbarRoutes] No se encontró regla para la ruta, limpiando pasos");
      juntasNavbarStore.setSteps([]);
    },
    { immediate: true }
  );

  /**
   * Watch los sub-steps seleccionados en el store para actualizar los pasos
   * Esto asegura que cuando se selecciona un punto de agenda, el sidebar se actualice
   */
  watch(
    () => juntasFlowStore.getDynamicSubSteps,
    (newSubSteps) => {
      console.log("🟣 [useJuntasNavbarRoutes] Sub-steps en store cambiaron:", newSubSteps);
      // Recalcular los pasos cuando cambian los sub-steps seleccionados
      const context = resolveContext();
      for (const rule of routeMap) {
        if (rule.match(route.path)) {
          const steps = rule.getSteps(context);
          console.log("🟣 [useJuntasNavbarRoutes] Recalculando pasos con nuevos sub-steps:", steps.map(s => ({ title: s.title, subSteps: s.subSteps?.length || 0 })));
          juntasNavbarStore.setSteps(steps);
          return;
        }
      }
    },
    { deep: true }
  );

  /**
   * Watch el hash para actualizar la sección actual
   */
  watch(
    () => route.hash,
    (newHash) => {
      const sectionId = extractCurrentSectionId();
      if (sectionId) {
        juntasFlowStore.setCurrentSection(sectionId);
      } else {
        juntasFlowStore.setCurrentSection("");
      }
    },
    { immediate: true }
  );

  /**
   * Calcula el índice del paso actual
   */
  const currentStepIndex = computed(() => {
    return juntasNavbarStore.steps.findIndex((step) => step.route === route.path);
  });

  /**
   * Obtiene el slug del paso actual
   */
  const currentStepSlug = computed(() => {
    return extractCurrentStepSlug() || "";
  });

  /**
   * Obtiene el ID del sub-step actual
   */
  const currentSubStepId = computed(() => {
    return extractCurrentSubStepId();
  });

  /**
   * Obtiene el ID de la sección actual
   */
  const currentSectionId = computed(() => {
    return extractCurrentSectionId() || juntasFlowStore.currentSectionId;
  });

  // Hacer steps reactivo usando computed para asegurar que se actualice cuando cambie el store
  const steps = computed(() => {
    console.log("🟠 [useJuntasNavbarRoutes] computed steps ejecutado, store steps:", juntasNavbarStore.steps.length);
    return juntasNavbarStore.steps;
  });

  return {
    steps,
    currentStepIndex,
    currentStepSlug,
    currentSubStepId,
    currentSectionId,
  };
};

