import { ref, watch } from "vue";

/**
 * Paletas de colores disponibles en PROBO
 * - base: Purple/Slate (Profesional y corporativo)
 * - oceanic: Blue/Teal (Fresco y tecnológico)
 * - forest: Green/Emerald (Natural y estable)
 * - sunset: Orange/Pink (Energético y creativo)
 */
export type Palette = "base" | "oceanic" | "forest" | "sunset";

const STORAGE_KEY = "probo-palette";
const DEFAULT_PALETTE: Palette = "base";

/**
 * Composable para manejar la paleta de colores de la aplicación
 *
 * @example
 * ```vue
 * <script setup>
 * const { currentPalette, setPalette } = usePalette();
 *
 * // Cambiar a paleta oceanic
 * setPalette('oceanic');
 * </script>
 * ```
 */
export const usePalette = () => {
  // Estado reactivo de la paleta actual
  const currentPalette = ref<Palette>(DEFAULT_PALETTE);

  /**
   * Aplica la paleta al elemento HTML mediante el atributo data-palette
   */
  const applyPalette = (palette: Palette) => {
    if (import.meta.client) {
      document.documentElement.setAttribute("data-palette", palette);
      console.log("🎨 Paleta aplicada:", palette);
    }
  };

  /**
   * Carga la paleta guardada en localStorage
   */
  const loadPalette = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Palette | null;

        if (
          stored &&
          ["base", "oceanic", "forest", "sunset"].includes(stored)
        ) {
          currentPalette.value = stored;
          applyPalette(stored);
          console.log("✅ Paleta cargada desde localStorage:", stored);
        } else {
          // Si no hay paleta guardada, aplicar la default
          applyPalette(DEFAULT_PALETTE);
          console.log("📌 Paleta default aplicada:", DEFAULT_PALETTE);
        }
      } catch (error) {
        console.error("❌ Error al cargar paleta:", error);
        applyPalette(DEFAULT_PALETTE);
      }
    }
  };

  /**
   * Cambia la paleta de colores y la guarda en localStorage
   */
  const setPalette = (palette: Palette) => {
    if (!["base", "oceanic", "forest", "sunset"].includes(palette)) {
      console.warn("⚠️ Paleta inválida:", palette, "- Usando default");
      palette = DEFAULT_PALETTE;
    }

    currentPalette.value = palette;
    applyPalette(palette);

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, palette);
        console.log("💾 Paleta guardada:", palette);
      } catch (error) {
        console.error("❌ Error al guardar paleta:", error);
      }
    }
  };

  /**
   * Resetea la paleta al valor default
   */
  const resetPalette = () => {
    setPalette(DEFAULT_PALETTE);
    console.log("🔄 Paleta reseteada a default");
  };

  // Watcher para aplicar automáticamente cambios de paleta
  watch(currentPalette, (newPalette) => {
    applyPalette(newPalette);
  });

  // Auto-inicializar en el cliente
  if (import.meta.client) {
    loadPalette();
  }

  return {
    currentPalette,
    setPalette,
    loadPalette,
    resetPalette,
  };
};
