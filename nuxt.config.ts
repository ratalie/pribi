// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true, editor: "code" },

  ssr: false,

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],

  // CSS global - Tailwind 4
  css: ["~/assets/tailwind.css"],

  // Vite plugins - Tailwind 4 directo
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: "es",
    strategy: "no_prefix",

    locales: [
      { code: "es", name: "Español" },
      { code: "en", name: "English" },
      { code: "zh", name: "中文" },
      { code: "hi", name: "हिन्दी" },
      { code: "de", name: "Deutsch" },
      { code: "fr", name: "Français" },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false,
      fallbackLocale: "es",
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
