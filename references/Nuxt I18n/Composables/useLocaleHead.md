---
title: useLocaleHead
source: https://i18n.nuxtjs.org/docs/composables/use-locale-head
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: The useLocaleHead() composable returns localized head properties for locale-related aspects.
tags:
  - clippings
updated: 2025-10-15T22:03
---
The `useLocaleHead()` composable returns localized head properties for locale-related aspects.

## Type

```ts
declare function useLocaleHead(options: I18nHeadOptions): Ref<I18nHeadMetaInfo>
```

## Parameters

### options

An object accepting the following optional fields:

- `dir`
	- type: `boolean`
	- default: `true`
	- Adds a `dir` attribute to the HTML element.
- `lang`
	- type: `boolean`
	- default: `true`
	- Adds a `lang` attribute to the HTML element.
- `seo`
	- type: `boolean | SeoAttributesOptions`
	- Adds various SEO attributes.

## Usage

```ts
<script setup>

const i18nHead = useLocaleHead({

  seo: {

    canonicalQueries: ['foo']

  }

})

useHead(() => ({

  htmlAttrs: {

    lang: i18nHead.value.htmlAttrs!.lang

  },

  link: [...(i18nHead.value.link || [])],

  meta: [...(i18nHead.value.meta || [])]

}))

</script>
```[useSwitchLocalePath](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path)

[

The useSwitchLocalePath() composable returns a function that allows to switch the locale.

](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path)[

useSetI18nParams

The useSetI18nParams() returns a function to set translated parameters for the current route. For more details on its usage see the Lang Switcher guide.

](https://i18n.nuxtjs.org/docs/composables/use-set-i18n-params)