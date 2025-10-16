---
title: Routing Strategies
source: https://i18n.nuxtjs.org/docs/guide
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Nuxt i18n module overrides Nuxt default routes to add locale prefixes to every URL with routing strategies.
tags:
  - clippings
updated: 2025-10-15T22:00
---
Nuxt i18n module overrides Nuxt default routes to add locale prefixes to every URL with routing strategies.

This feature is built on top of [Nuxt's routing](https://nuxt.com/docs/getting-started/routing) which requires your project to have a `pages` directory for it to be enabled.

## Routing

**Nuxt i18n module** overrides Nuxt default routes to add locale prefixes to every URL (except in `'no_prefix'` strategy).

Say your app supports two languages: French and English as the default language, and you have the following pages in your project:

Note that routes for the English version do not have any prefix because it is the default language, see the routing strategies section for more details.

## Strategies

There are 4 supported strategies that affect how app's routes are generated:

### 'no\_prefix'

With this strategy, your routes won't have a locale prefix added. The locale will be detected & changed without changing the URL. This implies that you have to rely on browser & cookie detection, and implement locale switches by calling the i18n API.

This strategy doesn't support [Custom paths](https://i18n.nuxtjs.org/docs/guide/custom-paths) and [Ignore routes](https://i18n.nuxtjs.org/docs/guide/ignoring-localized-routes) features unless you're also using [`differentDomains`](https://i18n.nuxtjs.org/docs/guide/different-domains).

### 'prefix\_except\_default'

Using this strategy, all of your routes will have a locale prefix added except for the default language.

### 'prefix'

With this strategy, all routes will have a locale prefix.

### 'prefix\_and\_default'

This strategy combines both previous strategies behaviours, meaning that you will get URLs with prefixes for every language, but URLs for the default language will also have a non-prefixed version (though the prefixed version will be preferred when `detectBrowserLanguage` is enabled).

## Configuration

To configure the strategy, use the `strategy` option. Make sure that you have a `defaultLocale` defined, especially if using `prefix_except_default`, `prefix_and_default` or `no_prefix` strategy. For other strategies it's also recommended to set this as it will be used as a fallback when attempting to redirect from a 404 page.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  // ...

  i18n: {

    strategy: 'prefix_except_default',

    defaultLocale: 'en'

  }

  // ...

})
```[Vue I18n Configuration](https://i18n.nuxtjs.org/docs/getting-started/vue-i18n)

[

Configuring runtime options for Vue I18n

](https://i18n.nuxtjs.org/docs/getting-started/vue-i18n)[

Runtime Hooks

Nuxt i18n module provides runtime hooks that you can use to perform specific tasks based on your app's language.

](https://i18n.nuxtjs.org/docs/guide/runtime-hooks)