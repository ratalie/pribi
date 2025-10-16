---
title: useLocaleRoute
source: https://i18n.nuxtjs.org/docs/composables/use-locale-route
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useLocaleRoute() composable returns a function that resolves the route according to the current locale.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useLocaleRoute() composable returns a function that resolves the route according to the current locale.

The `useLocaleRoute()` composable returns a function that resolves the route according to the current locale.

## Type

```ts
declare function useLocaleRoute(

  options?: I18nCommonRoutingOptionsWithComposable

): (route: RawLocation | RouteLocation, locale?: Locale) => Route | (RouteLocation & { href: string }) | undefined
```

## Usage

```ts
<script setup>

const localeRoute = useLocaleRoute()

const { locale } = useI18n()

const linkPath = computed(() => {

  const route = localeRoute('blog', locale.value)

  return route != null ? route.path : '/'

})

</script>

<template>

  <NuxtLink :to="linkPath">{{ $t('blog') }}</NuxtLink>

</template>
```[useLocalePath](https://i18n.nuxtjs.org/docs/composables/use-locale-path)

[

The useLocalePath() composable returns a function that resolves a path according to the current locale.

](https://i18n.nuxtjs.org/docs/composables/use-locale-path)[

useSwitchLocalePath

The useSwitchLocalePath() composable returns a function that allows to switch the locale.

](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path)