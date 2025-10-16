---
title: Vue
source: https://i18n.nuxtjs.org/docs/api/vue
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Extension of Vue.
tags:
  - clippings
updated: 2025-10-15T22:02
---
Extension of Vue.

## Extension of Vue

The APIs listed are available in the Options API. They are kept for Nuxt2 to migration from `@nuxtjs/i18n`. we will be deprecated in the future.

### routeBaseName()

- **Arguments**:
	- route (type: `string | Route`, default: current route)
- **Returns**: `string`

Returns base name of the passed route (uses the current route by default). The base name of a route is its name without a locale suffix or other metadata added by `@nuxtjs/i18n`.

### switchLocalePath()

- **Arguments**:
	- locale: (type: `Locale`)
- **Returns**: `string`

Returns path of the current route for specified `locale`.

See also [Link localizing](https://i18n.nuxtjs.org/docs/getting-started/usage)

### localePath()

- **Arguments**:
	- route (type: `string | Location`)
	- locale (type: `Locale`, default: current locale)
- **Returns**: `string`

Returns localized path for the passed `route`. Uses the current `locale` by default.

See also [Link localizing](https://i18n.nuxtjs.org/docs/getting-started/usage)

### localeRoute()

- **Arguments**:
	- route (type: `string | Location`)
	- locale (type: `Locale`, default: current locale)
- **Returns**: `Route | undefined`

Returns localized route for the passed `route`. Uses the current `locale` by default.

See also [Link localizing](https://i18n.nuxtjs.org/docs/getting-started/usage)

### localeHead()

- **Arguments**:
	- options: (type: `I18nHeadOptions`)
- **Returns**: `I18nHeadMetaInfo`

The `options` object accepts these optional properties:

- `dir` (type: `boolean`) - Adds a `dir` attribute to the HTML element. Default: `false`
- `seo` (type: `boolean | SeoAttributesOptions`) - Adds various SEO attributes. Default: `false`

See also [SEO](https://i18n.nuxtjs.org/docs/guide/seo)