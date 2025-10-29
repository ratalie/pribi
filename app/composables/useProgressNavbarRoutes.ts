import { routeMap } from "~/config/progress-navbar-map";

export const useProgressNavbarRoutes = () => {
  const route = useRoute();
  const progressNavbar = useProgressNavbarStore();

  const modeFlow = route.path.includes("/crear") ? "crear" : "editar";
  const sociedadId = modeFlow === "editar" ? String(route.params.id) : undefined;

  const mode = sociedadId ? `${modeFlow}/${sociedadId}` : modeFlow;

  watch(
    () => route.path,
    (newPath) => {
      for (const rule of routeMap) {
        if (rule.match(newPath)) {
          progressNavbar.setSteps(rule.getSteps(mode));
          return;
        }
      }

      progressNavbar.setSteps([]);
    },
    { immediate: true }
  );

  return {
    steps: progressNavbar.steps,
  };
};
