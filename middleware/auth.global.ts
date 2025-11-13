import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated && to.path !== "/") {
      const redirectPath =
        useRuntimeConfig().public?.defaultRedirectAfterLogin || "/registros/sociedades/dashboard";
      return navigateTo(redirectPath);
    }
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});

