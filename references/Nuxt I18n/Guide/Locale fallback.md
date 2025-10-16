---
title: Locale fallback
source: https://i18n.nuxtjs.org/docs/guide/locale-fallback
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: How a fallback gets selected when a translation is missing.
tags:
  - clippings
updated: 2025-10-15T22:01
---
How a fallback gets selected when a translation is missing.

**Nuxt i18n module** takes advantage of **Vue I18n** ability to handle localization fallback. It is possible to define a single fallback locale, an array of locales, or a decision map for more specific needs.

i18n/i18n.config.ts

```js
export default {

  fallbackLocale: 'en',

  // or

  fallbackLocale: ['en', 'fr'],

  // or

  fallbackLocale: {

    'de-CH': ['fr', 'it'],

    'zh-Hant': ['zh-Hans'],

    'es-CL': ['es-AR'],

    es: ['en-GB'],

    pt: ['es-AR'],

    default: ['en', 'da']

  }

  // ...

}
```

More information in [Vue I18n documentation](https://vue-i18n.intlify.dev/guide/essentials/fallback.html)[Multi domain locales](https://i18n.nuxtjs.org/docs/guide/multi-domain-locales)

[

Set up multiple domains for multiple locales. Use a different domain name for each language your app supports.

](https://i18n.nuxtjs.org/docs/guide/multi-domain-locales)[

Per-Component Translations

Inline your translation messages within your components.

](https://i18n.nuxtjs.org/docs/guide/per-component-translations)