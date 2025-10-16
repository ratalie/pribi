---
title: Runtime Hooks
source: https://i18n.nuxtjs.org/docs/guide/runtime-hooks
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Nuxt i18n module provides runtime hooks that you can use to perform specific tasks based on your app's language.
tags:
  - clippings
updated: 2025-10-15T22:00
---
Nuxt i18n module provides runtime hooks that you can use to perform specific tasks based on your app's language.

**Nuxt i18n module** provides runtime hooks to perform specific tasks based on your app's language.

## Hooks

### 'i18n:beforeLocaleSwitch'

Called before the app's locale is switched, the `newLocale` property can be overridden to change the locale being switched to.

Parameters:

- `oldLocale`
	- type: `string`
	- The app's locale before the switch
- `newLocale`
	- type: `string`
	- The app's locale after the switch
- `initialSetup`
	- type: `string`
	- Set to `true` if it's the initial locale switch that triggers on app load. It's a special case since the locale is not technically set yet so we're switching from no locale to locale.
- `context`
	- type: `NuxtApp`
	- The Nuxt app, this property is deprecated, the same can be achieved by using `const context = useNuxtApp()` outside the hook scope instead.

Returns: `string | null`

### 'i18n:localeSwitched'

Called right after the app's locale has been switched.

Parameters:

- `oldLocale`
	- type: `string`
	- The app's locale before the switch
- `newLocale`
	- type: `string`
	- The app's locale after the switch

## Usage

A typical usage would be to define those callbacks via a plugin where you can access the app's context (useful if you need to change Axios' config when the language changes for example).

/plugins/i18n.ts

```ts
export default defineNuxtPlugin(nuxtApp => {

  // called right before setting a new locale

  nuxtApp.hook('i18n:beforeLocaleSwitch', (options) => {

    console.log('onBeforeLanguageSwitch', options.oldLocale, options.newLocale, options.initialSetup)

    // You can override the new locale by setting it to a different value

    if(options.newLocale === 'fr') {

      options.newLocale = 'en'

    }

  })

  // called right after a new locale has been set

  nuxtApp.hook('i18n:localeSwitched', (options) => {

    console.log('onLanguageSwitched', options.oldLocale, options.newLocale)

  })

})
```[Routing Strategies](https://i18n.nuxtjs.org/docs/guide)

[

Nuxt i18n module overrides Nuxt default routes to add locale prefixes to every URL with routing strategies.

](https://i18n.nuxtjs.org/docs/guide)[

Custom Route Paths

Customize the names of the paths for specific locale.

](https://i18n.nuxtjs.org/docs/guide/custom-paths)