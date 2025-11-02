---
title: defineI18nRoute
source: https://i18n.nuxtjs.org/docs/compiler-macros/define-i18n-route
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: defineI18nRoute() is a compiler macro that you can use to set custom route paths for your page components located in the pages/ directory (unless set otherwise). This way you can set custom route paths for each static or dynamic route of your Nuxt application.
tags:
  - clippings
updated: 2025-10-15T22:05
---
defineI18nRoute() is a compiler macro that you can use to set custom route paths for your page components located in the pages/ directory (unless set otherwise). This way you can set custom route paths for each static or dynamic route of your Nuxt application.

`defineI18nRoute()` is a compiler macro that you can use to set custom route paths for your **page** components located in the `pages/` directory (unless [set otherwise](https://nuxt.com/docs/api/configuration/nuxt-config#pages-1)). This way you can set custom route paths for each static or dynamic route of your Nuxt application.

pages/some-page.vue

```ts
<script setup>

defineI18nRoute({

  paths: {

    en: '/about-us',

    fr: '/a-propos',

    ja: '/about-ja'

  }

})

</script>
```

## Type

```ts
defineI18nRoute(route: I18nRoute | false) => void

interface I18nRoute {

  paths?: Record<Locale, \`/${string}\`>

  locales?: Locale[]

}
```

## Parameters

### false

Disable localize for the target page component route.

### I18nRoute

An object accepting the following i18n route settings:

- **`paths`**
	- **Type**: `Record<Locale, `/${string} `>`  
		Customize page component routes per locale. You can specify static and dynamic paths for vue-router.
- **`locales`**
	- **Type**: `Locale[]`  
		Some locales to which the page component should be localized.[defineI18nLocaleDetector](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector)

[

The defineI18nLocaleDetector() is composable used to define a function which detects the locale on the server-side, it's called per request on the server.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector)