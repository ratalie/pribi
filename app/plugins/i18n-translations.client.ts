import esTranslations from "~/i18n/locales/es";
import enTranslations from "~/i18n/locales/en";
import zhTranslations from "~/i18n/locales/zh";
import hiTranslations from "~/i18n/locales/hi";
import deTranslations from "~/i18n/locales/de";
import frTranslations from "~/i18n/locales/fr";

export default defineNuxtPlugin(async () => {
  const { $i18n } = useNuxtApp();

  // Configurar traducciones para cada idioma
  $i18n.setLocaleMessage("es", esTranslations);
  $i18n.setLocaleMessage("en", enTranslations);
  $i18n.setLocaleMessage("zh", zhTranslations);
  $i18n.setLocaleMessage("hi", hiTranslations);
  $i18n.setLocaleMessage("de", deTranslations);
  $i18n.setLocaleMessage("fr", frTranslations);
});
