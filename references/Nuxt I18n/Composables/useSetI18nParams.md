---
title: useSetI18nParams
source: https://i18n.nuxtjs.org/docs/composables/use-set-i18n-params
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useSetI18nParams() returns a function to set translated parameters for the current route.For more details on its usage see the Lang Switcher guide.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The useSetI18nParams() returns a function to set translated parameters for the current route. For more details on its usage see the Lang Switcher guide.

The `useSetI18nParams()` returns a function to set translated parameters for the current route. For more details on its usage see the [Lang Switcher guide](https://i18n.nuxtjs.org/docs/guide/lang-switcher#dynamic-route-parameters).

## Type

```ts
declare function useSetI18nParams(options?: SeoAttributesOptions): (locale: Record<Locale, unknown>) => void
```

## Parameters

### options

**Type**: `SeoAttributesOptions | undefined`

An `SeoAttributesOptions` object, default `undefined`. See the [SEO guide](https://i18n.nuxtjs.org/docs/guide/seo#feature-details) for more details.

## Usage

```ts
<script setup>

// fetch product from API... (red mug)

const setI18nParams = useSetI18nParams({

  canonicalQueries: ['foo']

})

setI18nParams({

  en: { slug: data.slugs.en }, // slug: 'red-mug'

  nl: { slug: data.slugs.nl } // slug: 'rode-mok'

})

const switchLocalePath = useSwitchLocalePath()

switchLocalePath('en') // /products/red-mug

switchLocalePath('nl') // /nl/products/rode-mok

</script>

<template>

  <!-- pages/products/[slug].vue -->

</template>
```