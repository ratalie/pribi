---
title: Migration Guide
source: https://i18n.nuxtjs.org/docs/guide/migrating
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Follow this guide to upgrade from v9.x to v10.x
tags:
  - clippings
updated: 2025-10-15T22:02
---
Follow this guide to upgrade from v9.x to v10.x

## Upgraded to Vue I18n v11

We have upgraded from Vue I18n v10 to v11, this major version bump deprecates the Legacy API mode and custom `v-t` directive, and removes `tc()` and `$tc()` from Legacy API mode.

Check the documentation detailing the breaking changes [here](https://vue-i18n.intlify.dev/guide/migration/breaking11.html).

## Configuration options

The following [Configuration options](https://i18n.nuxtjs.org/docs/api/options) have been changed, deprecated, or removed.

| Status | Option | Notes |
| --- | --- | --- |
| promoted | `experimental.hmr` | Enabled by default and renamed to [`hmr`](https://i18n.nuxtjs.org/docs/api/options#hmr) |
| promoted | `experimental.switchLocalePathLinkSSR` | Enabled by default and the option to disable it has been removed. |
| promoted | `experimental.autoImportTranslationFunctions` | Enabled by default and renamed to [`autoDeclare`](https://i18n.nuxtjs.org/docs/api/options#autodeclare) |
| changed | [`restructureDir`](https://i18n.nuxtjs.org/docs/api/options#restructuredir) | This can no longer be disabled.      We recommend leaving this unset to use the default value of `'i18n'`. |
| deprecated | [`types`](https://i18n.nuxtjs.org/docs/api/options#types) | Only `'composition'` types will be supported in v11, in line with Vue I18n v12. |
| deprecated | [`baseUrl`](https://i18n.nuxtjs.org/docs/api/options#baseurl) | Will only allow string values and will no longer support function configuration in v11.      Use runtime config or rely on multi domain locales to set the base URL for complex setups. |
| deprecated | [`routesNameSeparator`](https://i18n.nuxtjs.org/docs/api/options#routesnameseparator) | This was documented as internal, use cases for end-users are unclear. |
| deprecated | [`defaultLocaleRouteNameSuffix`](https://i18n.nuxtjs.org/docs/api/options#defaultlocaleroutenamesuffix) | This was documented as internal, use cases for end-users are unclear. |
|  | `lazy` | Lazy loading of locale messages is now enabled for all locale files. |
|  | `bundle.optimizeTranslationDirective` | This feature has been disabled and fully removed, see [the discussion in this issue](https://github.com/nuxt-modules/i18n/issues/3238#issuecomment-2672492536) for context on this change. |
|  | `experimental.generatedLocaleFilePathFormat` | File paths (e.g. locale files, vue-i18n configs) configured for this module are now removed from the build entirely making this option obsolete. |

## Behavior Changes

### Browser Language Detection

Language detection and redirection have been improved to follow documented behavior strictly. In v9, some combinations of `strategy` and `redirectOn` options worked unexpectedly, which has been corrected in v10.

**Key Change**: When using `strategy: 'prefix'` with `redirectOn: 'root'`, non-root paths (e.g., `'/search'`) will no longer automatically redirect to their localized versions (e.g., `'/zh/search'`).

**Migration**: If you need redirection for all paths with a prefix strategy, update your configuration:

```
export default defineNuxtConfig({

  i18n: {

    strategy: 'prefix',

    detectBrowserLanguage: {

-      // redirectOn: 'root', // ⚠️ In v10 this will only redirect the root path

+      redirectOn: 'all',  // Redirects all paths as documented

    }

  }

})
```

**Impact**: This affects projects using `strategy: 'prefix'` that relied on the previous unintended behavior where `redirectOn: 'root'` also handled non-root paths.

See the [`redirectOn` documentation](https://i18n.nuxtjs.org/docs/api/options#redirecton) for more details about the available options.

## I18n functions

The following composables and [I18n functions](https://i18n.nuxtjs.org/docs/api/vue-i18n) have been changed, deprecated, or removed.

| Status | Function | Notes |
| --- | --- | --- |
| changed | [`useLocaleHead()`](https://i18n.nuxtjs.org/docs/composables/use-locale-head) | The `key` property on the options parameter has been removed and can no longer be configured, this is necessary for predictable and consistent localized head tag management. |
|  | `onLanguageSwitched()` | Use the [`'i18n:localeSwitched'`](https://i18n.nuxtjs.org/docs/guide/runtime-hooks) hook instead.      This function actually called the hook instead of subscribing to it, leading to unpredictable behavior. |
|  | `onBeforeLanguageSwitch()` | Use the [`'i18n:beforeLocaleSwitch'`](https://i18n.nuxtjs.org/docs/guide/runtime-hooks) hook instead.      This function actually called the hook instead of subscribing to it, leading to unpredictable behavior. |

## Context functions

The following [context functions](https://i18n.nuxtjs.org/docs/api/nuxt) have been changed, deprecated, or removed.

| Status | Function | Notes |
| --- | --- | --- |
| changed | [`$localeHead()`](https://i18n.nuxtjs.org/docs/api/nuxt#localehead) | The `key` property on the options parameter has been removed and can no longer be configured, this is necessary for predictable and consistent localized head tag management. |
| deprecated | [`$localeHead()`](https://i18n.nuxtjs.org/docs/api/nuxt#localehead) | Use the `useLocaleHead()` composable instead.      Deprecated due to limited use cases, the [`useLocaleHead()`](https://i18n.nuxtjs.org/docs/composables/use-locale-head) composable offers the same functionality and is easier to use in combination with `useHead()`. |
| deprecated | `$getRouteBaseName()` | Use [`$routeBaseName()`](https://i18n.nuxtjs.org/docs/api/nuxt#routebasename) instead.      Deprecated in favor of the same function under a new name: [`$routeBaseName()`](https://i18n.nuxtjs.org/docs/api/nuxt#routebasename), to be consistent with the other context functions and their composable counterparts. |
|  | `$resolveRoute()` | Use [`$localeRoute()`](https://i18n.nuxtjs.org/docs/api/nuxt#localeroute) instead |
|  | `$localeLocation()` | Use [`$localeRoute()`](https://i18n.nuxtjs.org/docs/api/nuxt#localeroute) instead |

## Runtime config

Several options set in the runtime config were only used to transfer build-time configuration to runtime and changing these at runtime could cause issues.

Instead of setting these on runtime config we now treat them as compiler constants, this way we can tree-shake any unused logic from a project build.

The following options have been removed from runtime config:

| Removed runtime config option |
| --- |
| `lazy` |
| `strategy` |
| `trailingSlash` |
| `differentDomains` |
| `defaultDirection` |
| `multiDomainLocales` |
| `routeNameSeparator` |
| `defaultLocaleRouteNameSuffix` |

## Generated options

The generated options files in your projects are meant for internal use by this module at runtime and should never be used, more properties may be removed in the future.

Future changes to these internal options will not be documented in the migration guide. If you have use cases for these options, please open an issue describing your use case so we can evaluate if we can support it differently.

The generated option files have been renamed:

| Old Name | New Name |
| --- | --- |
| `#build/i18n-options.mjs` | `#build/i18n-options.mjs` |
| `#internal/i18n/options.mjs` | `#internal/i18n-options.mjs` |

The following exports have been removed from the generated options:

| Removed Export |
| --- |
| `isSSG` |
| `hasPages` |
| `parallelPlugin` |
| `nuxtI18nOptions` |
| `DEFAULT_COOKIE_KEY` |
| `DYNAMIC_PARAMS_KEY` |
| `NUXT_I18N_MODULE_ID` |
| `SWITCH_LOCALE_PATH_LINK_IDENTIFIER` |

Reasons for removal:

- These are no longer used by the module and might expose vulnerable information in the final build
- Some options are now used as static values for better tree-shaking resulting in a smaller project build.

## Legacy migration

The migration guides for v7 and v8 can be found in the [legacy documentation](https://v9.i18n.nuxtjs.org/docs/guide/migrating)[Installing from a module](https://i18n.nuxtjs.org/docs/guide/install-module)

[

How to install Nuxt i18n using \`installModule\` inside of a module.

](https://i18n.nuxtjs.org/docs/guide/install-module)[

New features

What's new in v10

](https://i18n.nuxtjs.org/docs/guide/new-features)