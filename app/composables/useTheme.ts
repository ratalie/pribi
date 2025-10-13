import type { Theme } from "~/types/user";

export const useTheme = () => {
  // Estado reactivo del tema actual
  const currentTheme = ref<Theme>("system");

  // Tema efectivo considerando preferencia del sistema
  const effectiveTheme = computed(() => {
    if (currentTheme.value === "system") {
      // En el lado del cliente, detectar preferencia del sistema
      if (import.meta.client) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light"; // Fallback para SSR
    }
    return currentTheme.value;
  });

  // Inicializar tema desde localStorage al montar
  onMounted(() => {
    const stored = localStorage.getItem("probo-theme") as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      currentTheme.value = stored;
    }

    // Aplicar tema inicial
    applyTheme(effectiveTheme.value);

    // Escuchar cambios en preferencia del sistema
    if (currentTheme.value === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      // Cleanup
      onUnmounted(() => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      });
    }
  });

  // Aplicar tema al DOM
  const applyTheme = (theme: "light" | "dark") => {
    if (import.meta.client) {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  };

  // Manejar cambios en la preferencia del sistema
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (currentTheme.value === "system") {
      applyTheme(e.matches ? "dark" : "light");
    }
  };

  // Cambiar tema
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;

    if (import.meta.client) {
      localStorage.setItem("probo-theme", theme);

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        applyTheme(systemTheme);
      } else {
        applyTheme(theme);
      }
    }
  };

  // Watch para cambios en effectiveTheme
  watch(effectiveTheme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    currentTheme: readonly(currentTheme),
    effectiveTheme: readonly(effectiveTheme),
    setTheme,
  };
};
