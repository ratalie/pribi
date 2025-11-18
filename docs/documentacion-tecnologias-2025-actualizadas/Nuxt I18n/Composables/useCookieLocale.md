---
title: useCookieLocale
source: https://i18n.nuxtjs.org/docs/composables/use-cookie-locale
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useCookieLocale() composable returns the cookie locale.
tags:
  - clippings
updated: 2025-10-15T22:04
---
The `useCookieLocale()` composable returns the cookie locale.

If this composable function is called on client-side, it detects the locale from the value of `document.cookie` via `useCookie()`. else on the server side, the locale is detected from the value of `cookie` header.

Note that if the value of `detectBrowserLanguage.useCookie` is `false`, an **empty string** is always returned.

## Type[useBrowserLocale](https://i18n.nuxtjs.org/docs/composables/use-browser-locale)

[

The useBrowserLocale() composable returns the browser locale.

](https://i18n.nuxtjs.org/docs/composables/use-browser-locale)[

useTranslation

The useTranslation() composable returns the translation function.

](https://i18n.nuxtjs.org/docs/composables/use-translation)