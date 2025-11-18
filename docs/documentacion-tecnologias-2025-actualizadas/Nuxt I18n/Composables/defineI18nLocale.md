---
title: defineI18nLocale
source: https://i18n.nuxtjs.org/docs/composables/define-i18n-locale
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The defineI18nLocale() composable is used to define a function to dynamically load locale messages used for lazy-loading translations.
tags:
  - clippings
updated: 2025-10-15T22:04
---
The defineI18nLocale() composable is used to define a function to dynamically load locale messages used for lazy-loading translations.

The `defineI18nLocale()` composable is used to define a function to dynamically load locale messages used for [lazy-loading translations](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations).

The loader function needs to return a `Promise` that resolves a messages object.

## Type

```ts
declare function defineI18nLocale<Messages = LocaleMessages<DefineLocaleMessage>, Locales = Locale>(

  loader: (locale: Locales) => Messages | Promise<Messages>

): (locale: Locales) => Messages | Promise<Messages>
```

## Parameters

### loader

A function that is the dynamic locale messages loading, that has the following parameters:

- `locale`  
	**Type**: `Locale`  
	A target locale that is passed from nuxt i18n module. That is passed when the locale is switched in the following cases:
	- when you switch the locale with `setLocale()`.
	- when the locale is switched with `<NuxtLink>`. for example, the route path resolved by `useSwitchLocalePath()` or `$switchLocalePath()`.

## Usage

An example of a loader function using a fetch request to load locale messages:

```ts
export default defineI18nLocale(locale => {

  return $fetch(\`https://your-company-product/api/${locale}\`)

})
```[defineI18nConfig](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)

[

The defineI18nConfig() composables is used to define a function which returns the vue-i18n configuration which is passed to the createI18n() options on the Nuxt I18n module.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)[

defineI18nLocaleDetector

The defineI18nLocaleDetector() is composable used to define a function which detects the locale on the server-side, it's called per request on the server.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector)