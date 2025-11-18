---
title: <SwitchLocalePathLink>
source: https://i18n.nuxtjs.org/docs/components/switch-locale-path-link
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: An enhanced constrained <NuxtLink> for rendering paths resolved from switchLocalePath
tags:
  - clippings
updated: 2025-10-15T22:03
---
An enhanced constrained <NuxtLink> for rendering paths resolved from switchLocalePath

This component acts as a constrained [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link#nuxtlink) which internally uses `switchLocalePath()` to link to the same page in the provided locale.

We especially recommend using this component for language-switchers since it will correctly update routes using dynamic route parameters during server-side rendering.

### Props

This component supports most, but not all [props documented for `<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link#props) (does not support `to` or `href`) in addition to props described below.

| Prop | Description |
| --- | --- |
| `locale` | Optional prop to force localization using passed Locale, it defaults to the current locale. Identical to `locale` argument of `switchLocalePath()` |

### Examples

#### Basic usage

```html
<template>

  <SwitchLocalePathLink locale="nl">Dutch</SwitchLocalePathLink>

  <SwitchLocalePathLink locale="en">English</SwitchLocalePathLink>

</template>

<!-- equivalent to -->

<script setup>

const switchLocalePath = useSwitchLocalePath()

</script>

<template>

  <NuxtLink :to="switchLocalePath('nl')">Dutch</NuxtLink>

  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>

</template>
```[<NuxtLinkLocale>](https://i18n.nuxtjs.org/docs/components/nuxt-link-locale)

[

A shorthand component for using localePath with <NuxtLink>

](https://i18n.nuxtjs.org/docs/components/nuxt-link-locale)[

useLocalePath

The useLocalePath() composable returns a function that resolves a path according to the current locale.

](https://i18n.nuxtjs.org/docs/composables/use-locale-path)