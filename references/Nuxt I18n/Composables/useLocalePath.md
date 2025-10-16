---
title: useLocalePath
source: https://i18n.nuxtjs.org/docs/composables/use-locale-path
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useLocalePath() composable returns a function that resolves a path according to the current locale.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useLocalePath() composable returns a function that resolves a path according to the current locale.

The `useLocalePath()` composable returns a function that resolves a path according to the current locale.

## Type

```ts
declare function useLocalePath(

  options?: I18nCommonRoutingOptionsWithComposable

): (route: RawLocation | RouteLocation, locale?: Locale) => string
```

## Usage

```ts
<script setup>

const localePath = useLocalePath()

</script>

<template>

  <NuxtLink :to="localePath('index')">{{ $t('home') }}</NuxtLink>

</template>
```[<SwitchLocalePathLink>](https://i18n.nuxtjs.org/docs/components/switch-locale-path-link)

[

An enhanced constrained <NuxtLink> for rendering paths resolved from switchLocalePath

](https://i18n.nuxtjs.org/docs/components/switch-locale-path-link)[

useLocaleRoute

The useLocaleRoute() composable returns a function that resolves the route according to the current locale.

](https://i18n.nuxtjs.org/docs/composables/use-locale-route)