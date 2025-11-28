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

  // FORZAR SIEMPRE ESPAÑOL - Sin excepciones
  if (import.meta.client) {
    // Establecer cookie a español
    const cookieLocale = useCookie("i18n_redirected", {
      default: () => "es",
    });
    
    // Forzar español siempre, ignorando cualquier preferencia previa
    $i18n.setLocale("es");
    cookieLocale.value = "es";
    
    // También limpiar localStorage si tiene otro idioma guardado
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("probo-language");
      if (stored && stored !== "es") {
        localStorage.setItem("probo-language", "es");
      }
    }
  }
});
