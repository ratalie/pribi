import deTranslations from "~/i18n/locales/de";
import enTranslations from "~/i18n/locales/en";
import esTranslations from "~/i18n/locales/es";
import frTranslations from "~/i18n/locales/fr";
import hiTranslations from "~/i18n/locales/hi";
import zhTranslations from "~/i18n/locales/zh";

export default defineNuxtPlugin(async () => {
  const { $i18n } = useNuxtApp();

  // Configurar traducciones para cada idioma
  $i18n.setLocaleMessage("es", esTranslations);
  $i18n.setLocaleMessage("en", enTranslations);
  $i18n.setLocaleMessage("zh", zhTranslations);
  $i18n.setLocaleMessage("hi", hiTranslations);
  $i18n.setLocaleMessage("de", deTranslations);
  $i18n.setLocaleMessage("fr", frTranslations);

  // Forzar español por defecto si no hay cookie o locale guardado
  if (import.meta.client) {
    const cookieLocale = useCookie("i18n_redirected", {
      default: () => "es", // Por defecto español
    });
    const currentLocale = $i18n.locale.value;

    // Si no hay cookie válida o el locale actual no es válido, forzar español
    const validLocales = ["es", "en", "zh", "hi", "de", "fr"];
    if (!cookieLocale.value || !validLocales.includes(currentLocale)) {
      $i18n.setLocale("es");
      cookieLocale.value = "es";
    } else {
      // Asegurar que el locale esté sincronizado con la cookie
      $i18n.setLocale(cookieLocale.value as "es" | "en" | "zh" | "hi" | "de" | "fr");
    }
  }
});
