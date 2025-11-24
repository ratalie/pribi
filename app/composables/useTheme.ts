import type { Theme } from "~/types/user";

export const useTheme = () => {
  // Estado reactivo del tema actual
  // Por defecto: "light" (color claro) según especificación
  const currentTheme = ref<Theme>("light");

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

  // Aplicar tema al DOM
  const applyTheme = (theme: "light" | "dark" | "purple") => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔧 [applyTheme] INICIO");
    console.log("  📝 Theme solicitado:", theme);
    console.log("  🌍 import.meta.client:", import.meta.client);

    if (!import.meta.client) {
      console.log("  ⚠️ NO ESTAMOS EN CLIENT - SSR mode");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    console.log("  ✅ Estamos en CLIENT - procediendo...");

    const root = document.documentElement;
    console.log("  📄 document.documentElement:", root);
    console.log("  📄 tagName:", root.tagName);

    if (!root) {
      console.error("  ❌ ERROR: document.documentElement es NULL!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    // Estado ANTES
    console.log("  📊 ESTADO ANTES:");
    console.log("    - className:", `"${root.className}"`);
    console.log("    - classList:", Array.from(root.classList));
    console.log("    - style.colorScheme:", root.style.colorScheme);

    // Limpiar clases de tema existentes
    console.log("  🧹 Limpiando clases...");
    root.classList.remove("light", "dark", "purple");
    console.log("    - Después de remove:", Array.from(root.classList));

    // Aplicar nueva clase de tema
    console.log("  ➕ Agregando clase:", theme);
    root.classList.add(theme);
    console.log("    - Después de add:", Array.from(root.classList));

    // Verificación
    const hasClass = root.classList.contains(theme);
    console.log(
      "  ✔️ Verificación classList.contains('" + theme + "'):",
      hasClass
    );

    // Estado DESPUÉS
    console.log("  📊 ESTADO DESPUÉS:");
    console.log("    - className:", `"${root.className}"`);
    console.log("    - classList:", Array.from(root.classList));

    // Actualizar color-scheme
    const newColorScheme = theme === "light" ? "light" : "dark";
    console.log("  🎨 Actualizando color-scheme a:", newColorScheme);
    root.style.colorScheme = newColorScheme;
    console.log("    - style.colorScheme:", root.style.colorScheme);

    // Verificar variables CSS
    console.log("  🔍 Verificando variables CSS:");
    const computedStyle = getComputedStyle(root);
    const bgColor = computedStyle.getPropertyValue("--color-background");
    const primaryColor = computedStyle.getPropertyValue("--color-primary");
    console.log("    - --color-background:", bgColor.trim());
    console.log("    - --color-primary:", primaryColor.trim());

    console.log("✅ [applyTheme] COMPLETADO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  };

  // Manejar cambios en la preferencia del sistema
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (currentTheme.value === "system") {
      const newTheme = e.matches ? "dark" : "light";
      console.log("🌐 System theme changed to:", newTheme);
      applyTheme(newTheme);
    }
  };

  // Cambiar tema
  const setTheme = (theme: Theme) => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎨 [setTheme] LLAMADO");
    console.log("  📝 Nuevo tema solicitado:", theme);
    console.log("  📝 Tema actual antes:", currentTheme.value);
    currentTheme.value = theme;
    console.log("  ✅ currentTheme.value actualizado a:", currentTheme.value);
    console.log("  📊 effectiveTheme.value será:", effectiveTheme.value);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  };

  // Inicializar tema desde localStorage al montar
  onMounted(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 [onMounted] useTheme MONTADO");
    console.log("  🌍 import.meta.client:", import.meta.client);
    console.log("  📄 typeof document:", typeof document);
    console.log("  📄 typeof window:", typeof window);

    // 1. Cargar tema guardado
    console.log("  💾 Intentando cargar desde localStorage...");
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem("probo-theme") as Theme;
      console.log("    - Valor en localStorage:", stored);
    } catch (e) {
      console.error("    - ERROR accediendo localStorage:", e);
    }

    if (stored && ["light", "dark", "purple", "system"].includes(stored)) {
      console.log("  ✅ Tema válido encontrado:", stored);
      currentTheme.value = stored;
    } else {
      console.log("  ℹ️ No hay tema válido, usando default: system");
      currentTheme.value = "system";
    }

    console.log("  📊 Estado después de cargar:");
    console.log("    - currentTheme.value:", currentTheme.value);
    console.log("    - effectiveTheme.value:", effectiveTheme.value);

    // 2. Aplicar tema inicial
    console.log("  🎯 Aplicando tema inicial...");
    applyTheme(effectiveTheme.value);

    // 3. Escuchar cambios en preferencia del sistema si es necesario
    if (currentTheme.value === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      // Cleanup
      onUnmounted(() => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      });
    }

    // 4. Watch para cambios futuros en el tema
    console.log("  👁️ Configurando watcher de effectiveTheme...");
    watch(
      effectiveTheme,
      (newTheme, oldTheme) => {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("👁️ [WATCH effectiveTheme] TRIGGERED");
        console.log("  📝 Cambio detectado:");
        console.log("    - De:", oldTheme);
        console.log("    - A:", newTheme);
        console.log("  🎯 Llamando applyTheme...");
        applyTheme(newTheme);
      },
      { immediate: false } // NO immediate porque ya aplicamos el tema arriba
    );

    // 5. Watch para guardar en localStorage
    console.log("  💾 Configurando watcher de currentTheme...");
    watch(currentTheme, (newTheme, oldTheme) => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("💾 [WATCH currentTheme] TRIGGERED");
      console.log("  📝 Cambio detectado:");
      console.log("    - De:", oldTheme);
      console.log("    - A:", newTheme);

      try {
        localStorage.setItem("probo-theme", newTheme);
        console.log("  ✅ Guardado en localStorage:", newTheme);
      } catch (e) {
        console.error("  ❌ ERROR guardando en localStorage:", e);
      }

      // Si cambiamos a/desde system, actualizar listener
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (newTheme === "system") {
        console.log("  🔄 Tema es 'system' - agregando listener de OS");
        mediaQuery.addEventListener("change", handleSystemThemeChange);
      } else {
        console.log("  🔄 Tema NO es 'system' - removiendo listener de OS");
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      }
    });

    console.log("✅ [onMounted] CONFIGURACIÓN COMPLETA");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  });

  return {
    currentTheme: readonly(currentTheme),
    effectiveTheme: readonly(effectiveTheme),
    setTheme,
  };
};
