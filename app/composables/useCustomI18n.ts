import type { LocaleCode, LocaleInfo } from "~/i18n/types";

interface CustomI18nReturn {
  locale: Ref<string>;
  availableLocales: LocaleInfo[];
  currentLocaleInfo: ComputedRef<LocaleInfo>;
  isRTL: ComputedRef<boolean>;
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLocale: (newLocale: LocaleCode) => Promise<boolean>;
  formatDate: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const useCustomI18n = (): CustomI18nReturn => {
  // Hook base de @nuxtjs/i18n
  const i18n = useNuxtApp().$i18n;

  // Lista de idiomas disponibles con metadata completa
  const availableLocales: LocaleInfo[] = [
    {
      code: "es",
      name: "Español",
      nativeName: "Español",
      flag: "🇪🇸",
      dir: "ltr",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇬🇧",
      dir: "ltr",
    },
    { code: "zh", name: "中文", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
    {
      code: "hi",
      name: "हिन्दी",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      dir: "ltr",
    },
    {
      code: "de",
      name: "Deutsch",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      dir: "ltr",
    },
    {
      code: "fr",
      name: "Français",
      nativeName: "Français",
      flag: "🇫🇷",
      dir: "ltr",
    },
  ];

  // Estado reactivo del locale actual
  const locale = computed(() => i18n.locale.value);

  // Información del idioma actual
  const currentLocaleInfo = computed((): LocaleInfo => {
    return (
      availableLocales.find((l) => l.code === locale.value) ||
      availableLocales[0]!
    );
  });

  // Función mejorada de traducción con parámetros y fallbacks
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

  // Cambio de idioma con validación y efectos secundarios
  const changeLocale = async (newLocale: LocaleCode): Promise<boolean> => {
    try {
      if (!availableLocales.some((l) => l.code === newLocale)) {
        console.error(`[i18n] Invalid locale: ${newLocale}`);
        return false;
      }

      await i18n.setLocale(newLocale);

      // Actualizar dirección del documento si es RTL
      if (import.meta.client) {
        const localeInfo = availableLocales.find((l) => l.code === newLocale);
        if (localeInfo) {
          document.documentElement.dir = localeInfo.dir;
          document.documentElement.lang = newLocale;
        }
      }

      return true;
    } catch (error) {
      console.error(`[i18n] Error changing locale to ${newLocale}:`, error);
      return false;
    }
  };

  // Formateo de fechas localizadas
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

  // Formateo de números localizados
  const formatNumber = (
    number: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    return number.toLocaleString(locale.value, options);
  };

  // Formateo de moneda localizada
  const formatCurrency = (amount: number, currency = "USD"): string => {
    return amount.toLocaleString(locale.value, {
      style: "currency",
      currency,
    });
  };

  // Verificar si el idioma actual es RTL
  const isRTL = computed(() => {
    return currentLocaleInfo.value?.dir === "rtl";
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
