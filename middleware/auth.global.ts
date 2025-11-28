import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // Rutas públicas
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      // Redirigir a ruta original o dashboard
      const redirect = (to.query.redirect as string) || undefined;
      const defaultPath =
        config.public?.defaultRedirectAfterLogin || "/registros/sociedades/dashboard";
      return navigateTo(redirect || defaultPath);
    }
    return;
  }

  // Proteger rutas privadas
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});

