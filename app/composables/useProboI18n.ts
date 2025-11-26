/**
 * Composable unificado de i18n para la aplicación PROBO
 * Combina @nuxtjs/i18n con traducciones personalizadas
 */

import type { LocaleCode } from "~/i18n/types";

export const useProboI18n = () => {
  const i18n = useNuxtApp().$i18n;

  // Estado reactivo del locale actual
  const locale = computed(() => i18n.locale.value as LocaleCode);

  // Lista de idiomas disponibles con metadata completa
  const availableLocales = [
    {
      code: "es" as const,
      name: "Español",
      nativeName: "Español",
      flag: "🇪🇸",
      dir: "ltr" as "ltr" | "rtl",
    },
    {
      code: "en" as const,
      name: "English",
      nativeName: "English",
      flag: "🇬🇧",
      dir: "ltr" as "ltr" | "rtl",
    },
    {
      code: "zh" as const,
      name: "中文",
      nativeName: "中文",
      flag: "🇨🇳",
      dir: "ltr" as "ltr" | "rtl",
    },
    {
      code: "hi" as const,
      name: "हिन्दी",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      dir: "ltr" as "ltr" | "rtl",
    },
    {
      code: "de" as const,
      name: "Deutsch",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      dir: "ltr" as "ltr" | "rtl",
    },
    {
      code: "fr" as const,
      name: "Français",
      nativeName: "Français",
      flag: "🇫🇷",
      dir: "ltr" as "ltr" | "rtl",
    },
  ];

  // Información del idioma actual
  const currentLocaleInfo = computed(() => {
    return (
      availableLocales.find((l) => l.code === locale.value) ||
      availableLocales[0]!
    );
  });

  // Función de traducción mejorada
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const translation = params ? i18n.t(key, params) : i18n.t(key);

      // Warning en desarrollo si falta traducción
      if (import.meta.dev && translation === key) {
        console.warn(
          `[i18n] Missing translation for key: ${key} (locale: ${locale.value})`
        );
      }

      return translation;
    } catch (error) {
      console.error(`[i18n] Error translating key: ${key}`, error);
      return key;
    }
  };

  // Cambio de idioma con validación
  const changeLocale = async (newLocale: LocaleCode): Promise<boolean> => {
    try {
      if (!availableLocales.some((l) => l.code === newLocale)) {
        console.error(`[i18n] Invalid locale: ${newLocale}`);
        return false;
      }

      await i18n.setLocale(newLocale);

      // Actualizar dirección del documento
      if (import.meta.client) {
        const localeInfo = availableLocales.find((l) => l.code === newLocale);
        if (localeInfo) {
          document.documentElement.dir = localeInfo.dir;
          document.documentElement.lang = newLocale;
        }

        // Guardar preferencia
        localStorage.setItem("probo-language", newLocale);
      }

      return true;
    } catch (error) {
      console.error(`[i18n] Error changing locale to ${newLocale}:`, error);
      return false;
    }
  };

  // Formateo de fechas
  const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const formatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    } as Intl.DateTimeFormatOptions;

    return dateObj.toLocaleDateString(locale.value, formatOptions);
  };

  // Formateo de números
  const formatNumber = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    return number.toLocaleString(locale.value, options);
  };

  // Formateo de moneda
  const formatCurrency = (amount: number, currency = "USD"): string => {
    return amount.toLocaleString(locale.value, {
      style: "currency",
      currency,
    });
  };

  // Verificar si es RTL
  const isRTL = computed(() => currentLocaleInfo.value?.dir === "rtl");

  // Inicializar idioma desde localStorage o cookie
  onMounted(() => {
    if (import.meta.client) {
      // Prioridad: 1. Cookie de i18n, 2. localStorage, 3. Español por defecto
      const cookieLocale = useCookie("i18n_redirected");
      const stored = localStorage.getItem("probo-language") as LocaleCode;
      
      // Si hay cookie válida, usarla
      if (cookieLocale.value && availableLocales.some((l) => l.code === cookieLocale.value)) {
        changeLocale(cookieLocale.value as LocaleCode);
      }
      // Si no hay cookie pero hay localStorage válido, usarlo
      else if (stored && availableLocales.some((l) => l.code === stored)) {
        changeLocale(stored);
      }
      // Por defecto, forzar español
      else {
        changeLocale("es");
      }
    }
  });

  return {
    // Estados
    locale,
    availableLocales,
    currentLocaleInfo,
    isRTL,

    // Funciones
    t,
    changeLocale,
    formatDate,
    formatNumber,
    formatCurrency,
  };
};
