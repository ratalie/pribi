---
title: defineI18nLocaleDetector
source: https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The defineI18nLocaleDetector() is composable used to define a function which detects the locale on the server-side, it's called per request on the server.
tags:
  - clippings
updated: 2025-10-15T22:04
---
The defineI18nLocaleDetector() is composable used to define a function which detects the locale on the server-side, it's called per request on the server.

The `defineI18nLocaleDetector()` is composable used to define a function which detects the locale on the server-side, it's called per request on the server.

The function needs to return a locale string.

You can use [`@intlify/h3` utilities](https://github.com/intlify/h3#%EF%B8%8F-utilites--helpers) in the locale detector function, these are auto imported.

**This composable is experimental.** You need to configure filepath to [`experimental.localeDetector` option](https://i18n.nuxtjs.org/docs/api/options#experimental).

## Type

```ts
type LocaleConfig = {

  defaultLocale: Locale

  fallbackLocale: FallbackLocale

}

declare function defineI18nLocaleDetector(

  detector: (event: H3Event, config: LocaleConfig) => string

): (event: H3Event, config: LocaleConfig) => string
```

## Parameters

### detector

A function that is the locale detector, that has the following parameters:

- `event`
	- type: `H3Event`
	- An H3 event. see details [H3 API docs](https://www.jsdocs.io/package/h3#H3Event)
- `config`
	- type: `object`
	- A locale config that is passed from Nitro.
	- Properties:
		- `defaultLocale`
			- type: `Locale`
			- This value is set to the `defaultLocale` option of Nuxt i18n. If unset, it is set to the `locale` option loaded from the Vue I18n configuration (`i18n.config` file set on the `vueI18n` option). If neither of these are set, the default value of `'en-US'` is used.
		- `fallbackLocale`
			- type: `FallbackLocale`
			- This value is set to the `fallbackLocale` option loaded from the Vue I18n configuration (`i18n.config` file set on the `vueI18n` option). If no fallback locale has been configured this will default to `false`.

## Usage

An example of a locale detector:[defineI18nLocale](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale)

[

The defineI18nLocale() composable is used to define a function to dynamically load locale messages used for lazy-loading translations.

](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale)[

defineI18nRoute

defineI18nRoute() is a compiler macro that you can use to set custom route paths for your page components located in the pages/ directory (unless set otherwise). This way you can set custom route paths for each static or dynamic route of your Nuxt application.

](https://i18n.nuxtjs.org/docs/compiler-macros/define-i18n-route)