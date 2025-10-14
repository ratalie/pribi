import type { Font } from "~/types/user";

// Definición de fuentes disponibles
export const primaryFonts = [
  {
    name: "Inter",
    value: "Inter, ui-sans-serif, system-ui, sans-serif",
    className: "font-inter",
    preview: "Inter - Elegante y moderna",
    googleFont: "Inter:wght@300;400;500;600;700",
  },
  {
    name: "Roboto",
    value: "Roboto, ui-sans-serif, system-ui, sans-serif",
    className: "font-roboto",
    preview: "Roboto - Legible y profesional",
    googleFont: "Roboto:wght@300;400;500;700",
  },
  {
    name: "Open Sans",
    value: "Open Sans, ui-sans-serif, system-ui, sans-serif",
    className: "font-opensans",
    preview: "Open Sans - Amigable y clara",
    googleFont: "Open+Sans:wght@300;400;600;700",
  },
] as const;

export const secondaryFonts = [
  {
    name: "Fira Code",
    value: "Fira Code, ui-monospace, SFMono-Regular, Consolas, monospace",
    className: "font-firacode",
    preview: "Fira Code - Código elegante",
    googleFont: "Fira+Code:wght@300;400;500",
  },
  {
    name: "JetBrains Mono",
    value: "JetBrains Mono, ui-monospace, SFMono-Regular, Consolas, monospace",
    className: "font-jetbrains",
    preview: "JetBrains Mono - Desarrollo",
    googleFont: "JetBrains+Mono:wght@300;400;500",
  },
  {
    name: "Cascadia Code",
    value: "Cascadia Code, ui-monospace, SFMono-Regular, Consolas, monospace",
    className: "font-cascadia",
    preview: "Cascadia Code - Microsoft",
    googleFont: "Cascadia+Code:wght@300;400;500",
  },
] as const;

export const useFont = () => {
  // Estado reactivo de fuentes
  const primaryFont = ref<Font>("Inter");
  const secondaryFont = ref<Font>("Fira Code");

  // Computed para obtener datos completos de fuentes
  const primaryFontData = computed(() => {
    return (
      primaryFonts.find((font) => font.name === primaryFont.value) ||
      primaryFonts[0]
    );
  });

  const secondaryFontData = computed(() => {
    return (
      secondaryFonts.find((font) => font.name === secondaryFont.value) ||
      secondaryFonts[0]
    );
  });

  // Aplicar fuentes al DOM
  const applyFonts = () => {
    if (import.meta.client) {
      const root = document.documentElement;

      // Establecer variables CSS para fuentes
      root.style.setProperty("--font-primary", primaryFontData.value.value);
      root.style.setProperty("--font-secondary", secondaryFontData.value.value);

      // Remover clases anteriores y agregar nuevas
      root.classList.remove(...primaryFonts.map((f) => f.className));
      root.classList.remove(...secondaryFonts.map((f) => f.className));

      root.classList.add(primaryFontData.value.className);
      root.classList.add(secondaryFontData.value.className);
    }
  };

  // Cargar Google Fonts dinámicamente
  const loadGoogleFonts = () => {
    if (import.meta.client) {
      const existingLink = document.getElementById("google-fonts");
      if (existingLink) {
        existingLink.remove();
      }

      const fonts = [
        primaryFontData.value.googleFont,
        secondaryFontData.value.googleFont,
      ].join("&family=");

      const link = document.createElement("link");
      link.id = "google-fonts";
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fonts}&display=swap`;
      document.head.appendChild(link);
    }
  };

  // Inicializar fuentes desde localStorage
  onMounted(() => {
    const storedPrimary = localStorage.getItem("probo-primary-font") as Font;
    const storedSecondary = localStorage.getItem(
      "probo-secondary-font"
    ) as Font;

    if (storedPrimary && primaryFonts.some((f) => f.name === storedPrimary)) {
      primaryFont.value = storedPrimary;
    }

    if (
      storedSecondary &&
      secondaryFonts.some((f) => f.name === storedSecondary)
    ) {
      secondaryFont.value = storedSecondary;
    }

    loadGoogleFonts();
    applyFonts();
  });

  // Cambiar fuente primaria
  const setPrimaryFont = (font: Font) => {
    primaryFont.value = font;

    if (import.meta.client) {
      localStorage.setItem("probo-primary-font", font);
      loadGoogleFonts();
      applyFonts();
    }
  };

  // Cambiar fuente secundaria
  const setSecondaryFont = (font: Font) => {
    secondaryFont.value = font;

    if (import.meta.client) {
      localStorage.setItem("probo-secondary-font", font);
      loadGoogleFonts();
      applyFonts();
    }
  };

  // Watch para cambios reactivos
  watch([primaryFont, secondaryFont], () => {
    loadGoogleFonts();
    applyFonts();
  });

  return {
    // Estado
    primaryFont: readonly(primaryFont),
    secondaryFont: readonly(secondaryFont),

    // Datos computados
    primaryFontData: readonly(primaryFontData),
    secondaryFontData: readonly(secondaryFontData),

    // Fuentes disponibles
    primaryFonts,
    secondaryFonts,

    // Métodos
    setPrimaryFont,
    setSecondaryFont,
    applyFonts,
    loadGoogleFonts,
  };
};
