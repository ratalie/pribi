import type { Language } from "~/types/user";

// Mock translations - en producción usar @nuxtjs/i18n
const translations = {
  es: {
    "nav.registroSocietario": "Registro Societario",
    "nav.sociedades": "Sociedades",
    "nav.sucursales": "Sucursales",
    "nav.operaciones": "Operaciones de Órgano de Control",
    "nav.directorio": "Directorio",
    "nav.gerenciaGeneral": "Gerencia General",
    "nav.juntaAccionistas": "Junta de Accionistas",
    "nav.dashboard": "Dashboard",
    "nav.directores": "Directores",
    "nav.gerentes": "Gerentes",
    "nav.accionistas": "Accionistas",
    "nav.historico": "Histórico",
    "nav.storage": "Storage",
    "nav.almacen": "Almacén",
    "nav.documentosGenerados": "Documentos Generados",
    "nav.features": "Features",
    "nav.chatIA": "Chat IA",
    "nav.documentosIA": "Documentos IA",
    "nav.reporteria": "Reportería",
    "nav.planServicio": "Plan de Servicio",
    "nav.personalizacion": "Personalización",
    "nav.configuracion": "Configuración",
    "nav.ayuda": "Ayuda",
    "user.profile": "Perfil",
    "user.settings": "Configuración",
    "user.logout": "Cerrar Sesión",
    "common.collapse": "Colapsar",
    "common.expand": "Expandir",
  },
  en: {
    "nav.registroSocietario": "Corporate Registry",
    "nav.sociedades": "Companies",
    "nav.sucursales": "Branches",
    "nav.operaciones": "Control Body Operations",
    "nav.directorio": "Board",
    "nav.gerenciaGeneral": "General Management",
    "nav.juntaAccionistas": "Shareholders Meeting",
    "nav.dashboard": "Dashboard",
    "nav.directores": "Directors",
    "nav.gerentes": "Managers",
    "nav.accionistas": "Shareholders",
    "nav.historico": "History",
    "nav.storage": "Storage",
    "nav.almacen": "Warehouse",
    "nav.documentosGenerados": "Generated Documents",
    "nav.features": "Features",
    "nav.chatIA": "AI Chat",
    "nav.documentosIA": "AI Documents",
    "nav.reporteria": "Reporting",
    "nav.planServicio": "Service Plan",
    "nav.personalizacion": "Customization",
    "nav.configuracion": "Settings",
    "nav.ayuda": "Help",
    "user.profile": "Profile",
    "user.settings": "Settings",
    "user.logout": "Logout",
    "common.collapse": "Collapse",
    "common.expand": "Expand",
  },
};

export const useLanguage = () => {
  const currentLanguage = ref<Language>("es");

  // Inicializar idioma desde localStorage al montar
  onMounted(() => {
    const stored = localStorage.getItem("probo-language") as Language;
    if (stored && ["es", "en", "pt", "fr", "de"].includes(stored)) {
      currentLanguage.value = stored;
    }
  });

  // Función para traducir texto
  const t = (key: string): string => {
    const langTranslations =
      translations[currentLanguage.value as keyof typeof translations] ||
      translations.es;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  // Cambiar idioma
  const setLanguage = (language: Language) => {
    currentLanguage.value = language;

    if (import.meta.client) {
      localStorage.setItem("probo-language", language);
    }
  };

  // Lista de idiomas disponibles
  const availableLanguages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  return {
    currentLanguage: readonly(currentLanguage),
    availableLanguages,
    t,
    setLanguage,
  };
};
