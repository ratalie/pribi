// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

declare const process: { env: Record<string, string | undefined> };

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
      authEndpoint: process.env.NUXT_PUBLIC_AUTH_ENDPOINT || "",
      mswDisabled: process.env.MSW_DISABLED === "true",
      defaultRedirectAfterLogin: "/registros/sociedades/dashboard",
      societyProfileEndpoint: process.env.NUXT_PUBLIC_SOCIETY_PROFILE_ENDPOINT || "",
      societyProfileListSuffix: process.env.NUXT_PUBLIC_SOCIETY_PROFILE_LIST_SUFFIX || "",
      societyProfileDetailsSuffix:
        process.env.NUXT_PUBLIC_SOCIETY_PROFILE_DETAILS_SUFFIX || "/society",
      defaultAuthToken: process.env.NUXT_PUBLIC_DEFAULT_AUTH_TOKEN || "",
    },
  },

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
  css: [
    "~/assets/tailwind.css",
    "~/assets/styles/fonts.css",
    "~/assets/styles/sidebar-variables.css",
  ],

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

  components: [{ path: "~/components", pathPrefix: false }],
});
