---
title: Server-Side Translations
source: https://i18n.nuxtjs.org/docs/guide/server-side-translations
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Translate on the server-side and return it as a response.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Translate on the server-side and return it as a response.

You can do the translation on the server-side and return it as a response. The locale messages defined in nuxt i18n module options are integrated, so all you need to do is configure the locale detector.

**This feature is experimental,** that is supported from v8 RC8.

## Define locale detector

For server-side translation, you need to define a locale detector.

Nuxt i18n exports the `defineI18nLocaleDetector()` composable function to define it.

The following is an example of how to define a detector that detects locale using query, cookie, and header:

i18n/localeDetector.ts

```ts
// Detect based on query, cookie, header

export default defineI18nLocaleDetector((event, config) => {

  // try to get locale from query

  const query = tryQueryLocale(event, { lang: '' }) // disable locale default value with \`lang\` option

  if (query) {

    return query.toString()

  }

  // try to get locale from cookie

  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_locale' }) // disable locale default value with \`lang\` option

  if (cookie) {

    return cookie.toString()

  }

  // try to get locale from header (\`accept-header\`)

  const header = tryHeaderLocale(event, { lang: '' }) // disable locale default value with \`lang\` option

  if (header) {

    return header.toString()

  }

  // If the locale cannot be resolved up to this point, it is resolved with the value \`defaultLocale\` of the locale config passed to the function

  return config.defaultLocale

})
```

The locale detector function is used to detect the locale on the server-side. It's called per request on the server.

When you define the locale detector, you need to pass the path to the locale detector to the `experimental.localeDetector` option.

The following is an example of a locale detector configuration defined directly in the Nuxt application:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  i18n: {

    experimental: {

      localeDetector: 'localeDetector.ts'

    }

  }

})
```

For details on the locale detector function defined by `defineI18nLocaleDetector()`, see [here](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector).

## useTranslation() on eventHandler

To translate on the server-side, you need to call `useTranslation()`.

Example:

```ts
// you need to define \`async\` event handler

export default defineEventHandler(async event => {

  // call \`useTranslation\`, so it return the translation function

  const t = await useTranslation(event)

  return {

    // call translation function with key of locale messages,

    // and translation function has some overload

    hello: t('hello')

  }

})
```

For the key of the translation function, you can specify the locale messages set in the nuxt-i18n options inside the nuxt.config, or the locale loaded in the i18n.config messages.[Layers](https://i18n.nuxtjs.org/docs/guide/layers)

[

Using layers to extends projects with Nuxt i18n.

](https://i18n.nuxtjs.org/docs/guide/layers)[

Installing from a module

How to install Nuxt i18n using \`installModule\` inside of a module.

](https://i18n.nuxtjs.org/docs/guide/install-module)