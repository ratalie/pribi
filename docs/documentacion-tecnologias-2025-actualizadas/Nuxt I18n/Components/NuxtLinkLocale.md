---
title: <NuxtLinkLocale>
source: https://i18n.nuxtjs.org/docs/components/nuxt-link-locale
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: A shorthand component for using localePath with <NuxtLink>
tags:
  - clippings
updated: 2025-10-15T22:03
---
A shorthand component for using localePath with <NuxtLink>

This component is built on top of [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link#nuxtlink) but changes the default behavior by internally using [`localePath()`](https://i18n.nuxtjs.org/docs/api/vue#localepath) to make it easier to link to localized routes.

### Props

This component supports all [props documented for `<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link#props) in addition to props described below.

| Prop | Description |
| --- | --- |
| `locale` | Optional prop to force localization using passed Locale, it defaults to the current locale. Identical to `locale` argument of `localePath()` |

### Examples

#### Basic usage

```html
<template>

  <NuxtLinkLocale to="/">{{ $t('home') }}</NuxtLinkLocale>

</template>

<!-- equivalent to -->

<script setup>

const localePath = useLocalePath()

</script>

<template>

  <NuxtLink :to="localePath('/')">{{ $t('home') }}</NuxtLink>

</template>
```

#### Forcing locale resolution

```html
<template>

  <NuxtLinkLocale to="/" locale="nl">{{ $t('home') }}</NuxtLinkLocale>

</template>

<!-- equivalent to -->

<script setup>

const localePath = useLocalePath()

</script>

<template>

  <NuxtLink :to="localePath('/', 'nl')">{{ $t('home') }}</NuxtLink>

</template>
```[Runtime config](https://i18n.nuxtjs.org/docs/api/runtime-config)

[

i18n runtime config options.

](https://i18n.nuxtjs.org/docs/api/runtime-config)[

<SwitchLocalePathLink>

An enhanced constrained <NuxtLink> for rendering paths resolved from switchLocalePath

](https://i18n.nuxtjs.org/docs/components/switch-locale-path-link)