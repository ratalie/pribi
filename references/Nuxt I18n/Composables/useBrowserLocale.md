---
title: useBrowserLocale
source: https://i18n.nuxtjs.org/docs/composables/use-browser-locale
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useBrowserLocale() composable returns the browser locale.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useBrowserLocale() composable returns the browser locale.

The `useBrowserLocale()` composable returns the browser locale.

If this composable function is called on client-side, it detects the locale from the value of `navigator.languages`.

Else on the server side, the locale is detected from the value of `accept-language` header.

## Type

```ts
declare function useBrowserLocale(): string | null
```