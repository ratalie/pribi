---
title: useSwitchLocalePath
source: https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useSwitchLocalePath() composable returns a function that allows to switch the locale.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useSwitchLocalePath() composable returns a function that allows to switch the locale.

The `useSwitchLocalePath()` composable returns a function that allows to switch the locale.

## Type

```ts
declare function useSwitchLocalePath(options?: I18nCommonRoutingOptionsWithComposable): (locale?: Locale) => string
```

## Usage

```ts
<script setup>

const switchLocalePath = useSwitchLocalePath()

</script>

<template>

  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>

  <NuxtLink :to="switchLocalePath('fr')">Français</NuxtLink>

</template>
```