import type { NavigationStep } from "~/types/navigationSteps";

export const useProgressNavbarRoutes = () => {
  const steps: NavigationStep[] = [];

  const route = useRoute();

  const mode = route.path.includes("/crear") ? "crear" : "editar";
  const _sociedadId = mode === "editar" ? String(route.params.id) : undefined;

  return {
    steps,
  };
};
