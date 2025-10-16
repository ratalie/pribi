---
title: useRouteBaseName
source: https://i18n.nuxtjs.org/docs/composables/use-route-base-name
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useRouteBaseName() composable returns a function that gets the route's base name.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useRouteBaseName() composable returns a function that gets the route's base name.

The `useRouteBaseName()` composable returns a function that gets the route's base name.

## Type

```ts
declare function useRouteBaseName(

  options?: I18nCommonRoutingOptionsWithComposable

): (givenRoute?: string | Route | RouteLocationNormalizedLoaded) => string | undefined
```

## Usage

```ts
<script setup>

const route = useRoute()

const routeBaseName = useRouteBaseName()

const baseRouteName = computed(() => routeBaseName(route))

// or

const baseRouteNameString = computed(() => routeBaseName(route.name))

</script>

<template>

  <p>route base name: {{ baseRouteName }}</p>

</template>
```[useSetI18nParams](https://i18n.nuxtjs.org/docs/composables/use-set-i18n-params)

[

The useSetI18nParams() returns a function to set translated parameters for the current route. For more details on its usage see the Lang Switcher guide.

](https://i18n.nuxtjs.org/docs/composables/use-set-i18n-params)[

useBrowserLocale

The useBrowserLocale() composable returns the browser locale.

](https://i18n.nuxtjs.org/docs/composables/use-browser-locale)