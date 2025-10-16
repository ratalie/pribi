import type { Theme } from "~/types/user";

export const useTheme = () => {
  // Estado reactivo del tema actual
  const currentTheme = ref<Theme>("system");

  // Tema efectivo considerando preferencia del sistema
  const effectiveTheme = computed<"light" | "dark" | "purple">(() => {
    if (currentTheme.value === "system") {
      // En el lado del cliente, detectar preferencia del sistema
      if (import.meta.client) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light"; // Fallback para SSR
    }
    // Si es light, dark o purple, retornar directamente
    return currentTheme.value as "light" | "dark" | "purple";
  });

  // Inicializar tema desde localStorage al montar
  onMounted(() => {
    const stored = localStorage.getItem("probo-theme") as Theme;
    if (stored && ["light", "dark", "purple", "system"].includes(stored)) {
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

  // Aplicar tema al DOM con debug
  const applyTheme = (theme: "light" | "dark" | "purple") => {
    if (import.meta.client) {
      const root = document.documentElement;

      // Debug info
      console.log(`🔧 Applying theme: ${theme}`);
      console.log("Before:", root.className);

      // Limpiar clases de tema existentes
      root.classList.remove("light", "dark", "purple");

      // Aplicar nueva clase de tema
      root.classList.add(theme);

      // Debug info
      console.log("After:", root.className);

      // Forzar recálculo de CSS (purple se comporta como dark)
      root.style.colorScheme = theme === "light" ? "light" : "dark";
    }
  };

  // Manejar cambios en la preferencia del sistema
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (currentTheme.value === "system") {
      applyTheme(e.matches ? "dark" : "light");
    }
  };

  // Cambiar tema con reactividad mejorada
  const setTheme = (theme: Theme) => {
    // Actualizar estado reactivo (esto disparará los watchers)
    currentTheme.value = theme;

    // El localStorage y aplicación de tema se maneja en el watcher
    // Esto garantiza reactividad consistente
  };

  // Watch principal para effectiveTheme (maneja todos los casos)
  watch(
    effectiveTheme,
    (newTheme) => {
      console.log(`🎨 Applying theme: ${newTheme}`);
      applyTheme(newTheme);
    },
    { immediate: true }
  );

  // Watch para currentTheme solo para persistence
  watch(currentTheme, (newTheme) => {
    if (import.meta.client) {
      console.log(`💾 Saving theme to localStorage: ${newTheme}`);
      localStorage.setItem("probo-theme", newTheme);
    }
  });

  return {
    currentTheme: readonly(currentTheme),
    effectiveTheme: readonly(effectiveTheme),
    setTheme,
  };
};
