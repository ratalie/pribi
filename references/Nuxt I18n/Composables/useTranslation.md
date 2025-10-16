---
title: useTranslation
source: https://i18n.nuxtjs.org/docs/composables/use-translation
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useTranslation() composable returns the translation function.
tags:
  - clippings
updated: 2025-10-15T22:04
---
The useTranslation() composable returns the translation function.

The `useTranslation()` composable returns the translation function.

The locale used by the translation function is the locale detected by the function defined in [`experimental.localeDetector` option](https://i18n.nuxtjs.org/docs/api/options#experimental).

**This composable is experimental and server-side only.**

## Type

```ts
declare function useTranslation<Schema extends Record<string, any> = {}, Event extends H3Event = H3Event>(

  event: Event

): Promise<TranslationFunction<Schema, DefineLocaleMessage>>
```

## Usage

```ts
export default defineEventHandler(async event => {

  const t = await useTranslation(event)

  return {

    hello: t('hello')

  }

})
```[useCookieLocale](https://i18n.nuxtjs.org/docs/composables/use-cookie-locale)

[

The useCookieLocale() composable returns the cookie locale.

](https://i18n.nuxtjs.org/docs/composables/use-cookie-locale)[

defineI18nConfig

The defineI18nConfig() composables is used to define a function which returns the vue-i18n configuration which is passed to the createI18n() options on the Nuxt I18n module.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)