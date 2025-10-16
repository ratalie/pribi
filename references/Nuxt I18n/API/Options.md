---
title: Options
source: https://i18n.nuxtjs.org/docs/api/options
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: All the options you can use to configure Nuxt I18n.
tags:
  - clippings
updated: 2025-10-15T22:02
---
All the options you can use to configure Nuxt I18n.

## vueI18n

- type: `string`
- default: `''`

Build-time configuration for Vue I18n options that is used internally by this module. See full documentation at [here](https://vue-i18n.intlify.dev/api/general.html#createi18n)

Configuration for `createI18n()` can be passed using a configuration file. By default, the module will scan for a `i18n.config{.js,.mjs,.ts}` if nothing is specified.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  modules: ['@nuxtjs/i18n'],

  i18n: {

    vueI18n: './nuxt-i18n.js' // custom path example

  }

})
```

You need to `export default` with **plain object** or **function**.

Export with plain object example:

```ts
export default {

  legacy: false,

  locale: 'en',

  messages: {

    en: {

      welcome: 'Welcome'

    },

    fr: {

      welcome: 'Bienvenue'

    }

  }

}
```

Export with function example:

```ts
import en from '../locales/en.json'

import fr from '../locales/fr.yaml'

// You can use \`defineI18nConfig\` to get type inferences for options to pass to vue-i18n.

export default defineI18nConfig(() => {

  return {

    legacy: false,

    locale: 'en',

    messages: {

      en,

      fr

    }

  }

})
```

The Vue I18n `messages` option should be returned **by the plain object**.That will be pre-compiled in the nuxt i18n module via vue-i18n message-compiler as an executable message in the vue-i18n runtime.

## baseUrl

- type: `string | Function`
- default: `''`

The fallback base URL to use as a prefix for alternate URLs in `hreflang` tags. By default VueRouter's base URL will be used and only if that is not available, fallback URL will be used.

Can also be a function (will be passed a Nuxt Context as a parameter) that returns a string. Useful to make base URL dynamic based on request headers.

This property can also be set using [`runtimeConfig`](https://i18n.nuxtjs.org/docs/api/runtime-config).

It's especially important to set this option when using SEO features, in which case it's required that generated SEO tags use fully-qualified URLs.

## locales

- type: `string[] | LocaleObject[]`
- default: `[]`

List of locales supported by your app. Can either be an array of language codes (`['en', 'fr', 'es']`) or an array of locale objects for more complex configurations:

```json
[

  { "code": "en", "language": "en-US", "file": "en.js", "dir": "ltr" },

  { "code": "ar", "language": "ar-EG", "file": "ar.js", "dir": "rtl" },

  { "code": "fr", "language": "fr-FR", "file": "fr.js" }

]
```

When using an object form, the properties can be:

### code

- type: `string`
- Unique identifier of the locale

### language

- type: `undefined | string`
- **Required when using SEO features**
- A language-range used for SEO features and for matching browser locales when using [`detectBrowserLanguage`](https://i18n.nuxtjs.org/docs/api/options#detectbrowserlanguage) functionality. Should use the [language tag syntax](https://www.w3.org/International/articles/language-tags/) as defined by the IETF's [BCP47](https://www.rfc-editor.org/info/bcp47), for example:
	- `'en'` (`language` subtag for English)
	- `'fr-CA'` (`language+region` subtags for French as used in Canada)
	- `'zh-Hans'` (`language+script` subtags for Chinese written with Simplified script)

### file

- type: `null | string | { path: string; cache: string; }`
- The name of the file. Will be resolved relative to `langDir` path when loading locale messages from file.

### files

- type: `null | string[] | { path: string; cache: string; }[]`
- The name of the file in which multiple locale messages are defined. Will be resolved relative to `langDir` path when loading locale messages from file.

See also [Multiple files lazy loading](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations#multiple-files-lazy-loading) to learn more.

### dir

- type: `null | 'rtl' | 'ltr' | 'auto'`
- The dir property specifies the direction of the elements and content, value could be `'rtl'`, `'ltr'` or `'auto'`.

### domain

- type: `null | string`
- The domain name you'd like to use for that locale (including the port if used). This property can also be set using [`runtimeConfig`](https://i18n.nuxtjs.org/docs/api/runtime-config). This property is required when using [`differentDomains`](https://i18n.nuxtjs.org/docs/api/options#differentdomains)

### domains

- type: `null | string[]`
- An array of `domain`. This property is required when using [`multiDomainLocales`](https://i18n.nuxtjs.org/docs/api/options#multiDomainLocales) while one or more of the domains having multiple of the same locales

### defaultForDomains

- type: `null | string[]`
- (optional when using [`multiDomainLocales`](https://i18n.nuxtjs.org/docs/api/options#multiDomainLocales))
- An array of `domain` for which the locale should be the default locale when using `domains`.

### domainDefault

- type: `null | boolean`
- Set `domainDefault` to `true` for each locale that should act as a default locale for the particular domain. This property is required when using [`differentDomains`](https://i18n.nuxtjs.org/docs/api/options#differentdomains) while one or more of the domains having multiple locales

### ...

- any custom property set on the object will be exposed at runtime. This can be used, for example, to define the language name for the purpose of using it in a language selector on the page.

You can access all the properties of the current locale through the `localeProperties` property. When using an array of codes, it will only include the `code` property.

## defaultDirection

- type: `string`
- default: `ltr`

The app's default direction. Will only be used when `dir` is not specified.

## defaultLocale

- type: `string | null`
- default: `null`

The app's default locale. Should match the language code of one of the defined `locales`.

When using `prefix_except_default` strategy, URLs for locale specified here won't have a prefix. **It's recommended to set this to some locale** regardless of chosen strategy, as it will be used as a fallback locale when navigating to a non-existent route.

## strategy

- type: `'no_prefix' | 'prefix_except_default' | 'prefix' | 'prefix_and_default'`
- default: `'prefix_except_default'`

Routes generation strategy. Can be set to one of the following:

- `'no_prefix'`: routes won't have a locale prefix
- `'prefix_except_default'`: locale prefix added for every locale except default
- `'prefix'`: locale prefix added for every locale
- `'prefix_and_default'`: locale prefix added for every locale and default

## customRoutes

- type: `'meta' | 'page' | 'config'`
- default: `'page'`

Whether [custom paths](https://i18n.nuxtjs.org/docs/guide/custom-paths) are extracted from page files or configured in the module configuration:

- `'meta'`: custom paths are extracted from the `definePageMeta()` function in page components.
- `'page'`: custom paths are extracted from the `defineI18nRoute()` macro in page components.
- `'config'`: custom paths are configured in the `pages` option of the module configuration.

## pages

- type: `object`
- default: `{}`

If `customRoutes` option is disabled with `config`, the module will look for custom routes in the `pages` option. Refer to the [Routing](https://i18n.nuxtjs.org/docs/guide) for usage.

## skipSettingLocaleOnNavigate

- type: `boolean`
- default: `false`

If `true`, the locale will not be set when navigating to a new locale. This is useful if you want to wait for the page transition to end before setting the locale yourself using [`finalizePendingLocaleChange`](https://i18n.nuxtjs.org/docs/api/vue-i18n#finalizependinglocalechange). See more information in [Wait for page transition](https://i18n.nuxtjs.org/docs/guide/lang-switcher#wait-for-page-transition).

## defaultLocaleRouteNameSuffix

- type: `string`
- default: `'default'`

Internal suffix added to generated route names for default locale, if strategy is `prefix_and_default`. You shouldn't need to change this.

## routesNameSeparator

- type: `string`
- default: `'___'`

Internal separator used for generated route names for each locale. You shouldn't need to change this.

## rootRedirect

- type: `string | { statusCode: number; path: string; } | null`
- default: `null`

Set to a path to which you want to redirect users accessing the root URL (`'/'`). Accepts either a string or an object with `statusCode` and `path` properties. E.g

```json
{

  "statusCode": 301,

  "path": "about-us"

}
```

## redirectStatusCode

- type: `number`
- default: `302`

Specifies the HTTP status code to use when redirecting to a localized route from any URL except the root URL ('/').

## langDir

- type: `string`
- default: `locales`

A relative path to a directory containing translation files to load.

The path is resolved relative to the project `restructureDir` at the root of a project (`'i18n'` by default).

Absolute paths will fail in production (eg. `'/locales'` should be changed into either `'locales'` or `'./locales'`)

## detectBrowserLanguage

- type: `object | boolean`

Enables browser language detection to automatically redirect visitors to their preferred locale as they visit your site for the first time.

See also [Browser language detection](https://i18n.nuxtjs.org/docs/guide/browser-language-detection) for a guide.

Note that for better SEO it's recommended to set `redirectOn` to `'root'`.

Set to `false` to disable.

Supported properties:

### alwaysRedirect

- type: `boolean`
- default: `false`

Set to always redirect to the value stored in the cookie, not just on first visit.

### fallbackLocale

- type: `string | null`

If none of the locales match the browser's locale, use this one as a fallback.

### redirectOn

- type: `string`
- default: `'root'`

Supported options:

- `'all'` - detect browser locale on all paths.
- `'root'` (recommended for improved SEO) - only detect the browser locale on the root path (`'/'`) of the site. Only effective when using strategy other than `'no_prefix'`.
- `'no prefix'` - a more permissive variant of `'root'` that will detect the browser locale on the root path (`'/'`) and also on paths that have no locale prefix (like `'/foo'`). Only effective when using strategy other than `'no_prefix'`.

### useCookie

- type: `boolean`
- default: `true`

If enabled, a cookie is set once the user has been redirected to browser's preferred locale, to prevent subsequent redirects. Set to `false` to redirect every time.

### cookieKey

- type: `string`
- default: `'i18n_redirected'`

Cookie name.

### cookieDomain

- type: `string | null`
- default: `null`

Set to override the default domain of the cookie. Defaults to the **host** of the site.

### cookieCrossOrigin

- type: `boolean`
- default: `false`

When `true`, sets the flags `SameSite=None; Secure` on the cookie to allow cross-domain use of the cookie (required when app is embedded in an iframe).

### cookieSecure

- type: `boolean`
- default: `false`

Sets the `Secure` flag for the cookie.

## differentDomains

- type: `boolean`
- default: `false`

Set this to `true` when using different domains for each locale, with this enabled you MUST configure locales as an array of objects, each containing a `domain` key. Refer to the [Different domains](https://i18n.nuxtjs.org/docs/guide/different-domains) for more information.

## multiDomainLocales

- type: `boolean`
- default: `false`

Set this to `true` when using different domains with different locales. If enabled, you MUST configure locales as an array of objects, each containing a `domains` and `defaultForDomains` key. Refer to the [Multi Domain Locales](https://i18n.nuxtjs.org/docs/guide/multi-domain-locales) for more information.

## compilation

- type: `object`
- default: `{ strictMessage: true, escapeHtml: false }`

Configure flags that sets the behavior compilation of locale messages.

Supported properties:

### strictMessage

- type: `boolean`
- default: `true`

Strictly check that the locale message does not contain HTML tags. If HTML tags are included, an error is thrown.

If you do not want the error to be thrown, you can work around it by setting it to false. However, **this means that the locale message might cause security issues with XSS**. In that case, we recommend setting the `escapeHtml` option to `true`.

### escapeHtml

- type: `boolean`
- default: `false`

Determine whether to escape HTML tags if they are included in the locale message.

If `strictMessage` is disabled by setting it to `false`, we recommend enabling this option.

## bundle

- type: `object`
- default: `{ compositionOnly: true, runtimeOnly: false, fullInstall: true, dropMessageCompiler: false }`

Configure the bundling optimization for nuxt i18n module.

Supported properties:

### compositionOnly

- type: `boolean`
- default: `true`

Whether to make vue-i18n API only composition API. By default the legacy API is tree-shaken. For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags)

If you would like to use Vue I18n's Legacy API, you must set `compositionOnly: false`. **Note that setting this value will disable Vue I18n Composition API**.Note that the Legacy API can also be used in hybrid by setting the Vue I18n option to `allowComposition: true` in i18n.config, but this is limited. See [here](https://vue-i18n.intlify.dev/guide/migration/vue3.html) for details.

### runtimeOnly

- type: `boolean`
- default: `false`

Whether or not to automatically use Vue I18n runtime-only in build.

When you will enable this option, vue-i18n message compiler is not bundled. This means that you will not be able to dynamically retrieve locale messages for use in your application from back-end APIs via fetch, or programmatically compose the locale messages. That is to say, **you must be able to fully resolve locale messages at build time.**

### fullInstall

- type: `boolean`
- default: `true`

Whether to install the full set of APIs, components, etc. By default, all of them will be installed. If `false` is specified, built-in components (`<i18n-t>`, `<i18n-d>` and `<i18n-n>`) and directive (`v-t`) will not be installed in vue and will be tree-shaken. For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags)

### dropMessageCompiler

- type: `boolean`
- default: `false`

Whether to tree-shake message compiler when bundling.

If you enable this option, **you should check that resources in your application are pre-compiled with nuxt i18n module**. If you will be loading resources dynamically from the back-end via the API, enabling this option will not work because there is no message compiler.

### onlyLocales

- type: `string | string[]`
- default: `undefined`

Specify the locales codes that need to be included, the rest will be removed.

It can be useful if you have one code base (e.g. [Nuxt Layers](https://nuxt.com/docs/getting-started/layers)) for several similar projects using different languages.

The value of this **option will not be merged with other Nuxt Layers**. This option should only be specified in the final project config.

## experimental

Experimental configuration property is an object with the following properties:

### localeDetector

- type: `string`
- default: `''`
- Specify the locale detector to be called per request on the server side. You need to specify the filepath where the locale detector is defined.

For more details on how to define the locale detector, see the [`defineI18nLocaleDetector()` API](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector)

### strictSeo

- type: `boolean | SeoAttributesOptions`
- default: `false`
- Enables strict SEO mode.

### typedPages

- type: `boolean`
- default: `true`
- Generates route types used in composables and configuration, this feature is enabled by default when Nuxt's `experimental.typedRoutes` is enabled.

This feature relies on [Nuxt's `experimental.typedRoutes`](https://nuxt.com/docs/guide/going-further/experimental-features#typedpages) and will not work if this is not enabled.

### typedOptionsAndMessages

- type: `false | 'default' | 'all'`
	- `false` - disables type generation
	- `'default'` - generate types based on configured `defaultLocale`
	- `'all'` - generate types based on all configured locales
- default: `false`
- Generate `vue-i18n` and message types used in translation functions and `vue-i18n` configuration. Can be configured to use the `defaultLocale` (better performance) or all locales for type generation.

### alternateLinkCanonicalQueries

- type: `boolean`
- default: `true`
- Remove non-canonical query parameters from alternate link meta tags

## hmr

- type: `boolean`
- default: `true`
- Hot module replacement for locale message files and vue-i18n configuration in dev mode.

This functionality is only supported for projects using vite.

## customBlocks

Configure the `i18n` custom blocks of SFC.

Supported properties:

### defaultSFCLang

- type: `'json' | 'json5' | 'yaml' | 'yml'`
- default: `'json'`
- Specify the content for all your inlined i18n custom blocks on your SFC. For more details refer to [unplugin-vue-i18n documentation](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md#defaultsfclang)

On inlined `i18n` custom blocks that have specified the `lang` attribute, the `defaultSFCLang` is not applied.

For example, with `defaultSFCLang: "yaml"` or `defaultSFCLang: "yml"`, this custom block:

```
<i18n lang="yaml">

en:

  hello: Hello

es:

  hello: Hola

</i18n>
```

Would be equivalent to this:

```
<i18n>

en:

  hello: Hello

es:

  hello: Hola

</i18n>
```

### globalSFCScope

- type: `boolean`
- default: `false`
- Whether to include all `i18n` custom blocks on your SFC on global scope. For more details refer to [unplugin-vue-i18n documentation](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md#globalsfcscope)

beware enabling `globalSFCScope: true`, all `i18n` custom blocks in all your `SFC` will be on `global` scope.

For example, with `globalSFCScope: true`, this custom block:

```
<i18n lang="yaml" global>

en:

  hello: Hello

es:

  hello: Hola

</i18n>
```

Would be equivalent to this:

```
<i18n lang="yaml">

en:

  hello: Hello

es:

  hello: Hola

</i18n>
```

This combines with `defaultSFCLang`, with `defaultSFCLang: "yaml"` the following would be equivalent to the previous examples:

```
<i18n>

en:

  hello: Hello

es:

  hello: Hola

</i18n>
```

## types

- type: `'composition' | 'legacy'`
- default: `'composition'`

Enforces the type definition of the API style to be used.

- Set to `'composition'`, Composition API types provided by Vue I18n and `@nuxtjs/i18n` are supported,
- Set to `'legacy'`, Options API types are supported.

You may need to run `nuxi prepare` for the generated types to update.

## debug

- type: `boolean | 'verbose'`
- default: `false`

Whether to use `@nuxtjs/i18n` debug mode. If `true` or `'verbose'`, logs will be output to the console, setting this to `'verbose'` will also log loaded messages objects.

The purpose of this option is to help identify any problems with `@nuxtjs/i18n`.You should not enable this option in production as it will negatively impact performance.

## parallelPlugin

- type: `boolean`
- default: `false`

Set the plugin as `parallel`. See [nuxt plugin loading strategy](https://nuxt.com/docs/guide/directory-structure/plugins#loading-strategy).

## restructureDir

- type: `string`
- default: `'i18n'`

Used to configure the directory used to resolve i18n files.

## autoDeclare

- type: `boolean`
- default: `true`
- Automatically imports/initializes `$t()`, `$rt()`, `$d()`, `$n()`, `$tm()` and `$te()` functions in `<script setup>` when used.

This feature relies on [Nuxt's Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports) and will not work if this has been disabled.[New features](https://i18n.nuxtjs.org/docs/guide/new-features)

[

What's new in v10

](https://i18n.nuxtjs.org/docs/guide/new-features)[

Vue I18n

Extension of Vue I18n

](https://i18n.nuxtjs.org/docs/api/vue-i18n)