---
title: Vue I18n
source: https://i18n.nuxtjs.org/docs/api/vue-i18n
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Extension of Vue I18n
tags:
  - clippings
updated: 2025-10-15T22:02
---
Extension of Vue I18n

Instance of [Composer (for Composition API)](https://vue-i18n.intlify.dev/api/composition.html#composer) or [VueI18n (for Legacy API)](https://vue-i18n.intlify.dev/api/legacy.html#vuei18n) is exposed as `$i18n` on Vue instance.

### getLocaleCookie()

- **Arguments**:
	- no arguments
- **Returns**: `string | undefined`

Returns locale code from stored locale cookie.

### setLocaleCookie()

- **Arguments**:
	- locale (type: `string`)
- **Returns**: `undefined`

Updates stored locale cookie with specified locale code. Consider using `setLocale` instead if you want to switch locale.

### setLocale()

- **Arguments**:
	- locale (type: `string`)
- **Returns**: `Promise<void>`

Switches locale of the app to specified locale code. If `useCookie` option is enabled, locale cookie will be updated with new value. If prefixes are enabled (`strategy` other than `no_prefix`), will navigate to new locale's route.

### loadLocaleMessages()

- **Arguments**:
	- locale (type: `string`)
- **Returns**: `Promise<void>`

Loads the translation messages of the specified locale code, this is relevant for when using translations from a non-loaded locale.

### getBrowserLocale()

- **Arguments**:
	- no arguments
- **Returns**: `string | undefined`

Returns browser locale code filtered against the ones defined in options.

### finalizePendingLocaleChange()

- **Arguments**:
	- no arguments
- **Returns**: `Promise<void>`

Switches locale to the pending locale, used when navigation locale switch is prevented by the [`skipSettingLocaleOnNavigate`](https://i18n.nuxtjs.org/docs/api/options#skipsettinglocaleonnavigate) option. See [Wait for page transition](https://i18n.nuxtjs.org/docs/guide/lang-switcher#wait-for-page-transition) for more information.

### waitForPendingLocaleChange()

- **Arguments**:
	- no arguments
- **Returns**: `Promise<void>`

Returns a promise that will be resolved once the pending locale is set.

### strategy

- type: `Strategies`

Routing strategy as specified in options.

### defaultDirection

- **Type**: `Directions`

Default direction as specified in options.

### defaultLocale

- **Type**: `string`

Default locale as specified in options.

### localeCodes

- **Type**: `Array<string>`

List of locale codes of registered locales.

### locales

- **Type**: `Array<string | LocaleObject>`

List of locales as defined in options.

### localeProperties

- **Type**: `LocaleObject`

Object of the current locale properties.

### differentDomains

- **Type**: `boolean`

Whether `differentDomains` option is enabled.[Options](https://i18n.nuxtjs.org/docs/api/options)

[

All the options you can use to configure Nuxt I18n.

](https://i18n.nuxtjs.org/docs/api/options)[

Vue

Extension of Vue.

](https://i18n.nuxtjs.org/docs/api/vue)