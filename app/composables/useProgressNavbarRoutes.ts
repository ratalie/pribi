import { routeMap } from "~/config/progress-navbar-map";
import type { ProgressNavigationContext } from "~/config/progress-navbar-map";

export const useProgressNavbarRoutes = () => {
  const route = useRoute();
  const progressNavbar = useProgressNavbarStore();

  const extractSocietyId = (): string | undefined => {
    const param = route.params.id;
    if (typeof param === "string" && param.length > 0) return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  };

  const resolveContext = (): ProgressNavigationContext => {
    const path = route.path;
    const flow = path.includes("/crear") ? "crear" : path.includes("/editar") ? "editar" : undefined;
    return {
      societyId: extractSocietyId(),
      flow,
    };
  };

  watch(
    () => route.path,
    (newPath) => {
      const context = resolveContext();
      for (const rule of routeMap) {
        if (rule.match(newPath)) {
          progressNavbar.setSteps(rule.getSteps(context));
          return;
        }
      }

      progressNavbar.setSteps([]);
    },
    { immediate: true }
  );

  const currentStepIndex = computed(() => {
    return progressNavbar.steps.findIndex((step) => step.route === route.path);
  });

  return {
    steps: progressNavbar.steps,
    currentStepIndex,
  };
};
