---
title: defineI18nConfig
source: https://i18n.nuxtjs.org/docs/composables/define-i18n-config
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The defineI18nConfig() composables is used to define a function which returns the vue-i18n configuration which is passed to the createI18n() options on the Nuxt I18n module.
tags:
  - clippings
updated: 2025-10-15T22:04
---
The defineI18nConfig() composables is used to define a function which returns the vue-i18n configuration which is passed to the createI18n() options on the Nuxt I18n module.

The `defineI18nConfig()` composables is used to define a function which returns the vue-i18n configuration which is passed to the `createI18n()` options on the Nuxt I18n module.

The loader function needs to return a Function or Promise that resolves a vue-i18n options object.

For more details on configuring vue-i18n, see the [Vue I18n documentation](https://vue-i18n.intlify.dev/api/general.html#createi18n).

## Type

```ts
export function defineI18nConfig<Config extends I18nOptions>(

  loader: () => Config | Promise<Config>

): () => Config | Promise<Config>
```

## Parameters

### loader

A function that is the vue-i18n options loading.

## Usage

An example defining a simple vue-i18n options object:

```ts
export default defineI18nConfig(() => ({

  legacy: false,

  locale: 'en',

  messages: {

    en: {

      welcome: 'Welcome'

    },

    fr: {

      welcome: 'Bienvenue'

    }

  }

}))
```[useTranslation](https://i18n.nuxtjs.org/docs/composables/use-translation)

[

The useTranslation() composable returns the translation function.

](https://i18n.nuxtjs.org/docs/composables/use-translation)[

defineI18nLocale

The defineI18nLocale() composable is used to define a function to dynamically load locale messages used for lazy-loading translations.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale)