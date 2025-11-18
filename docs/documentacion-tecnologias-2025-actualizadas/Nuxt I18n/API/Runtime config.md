---
title: Runtime config
source: https://i18n.nuxtjs.org/docs/api/runtime-config
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: i18n runtime config options.
tags:
  - clippings
updated: 2025-10-15T22:02
---
i18n runtime config options.

Some options can be set via the `runtimeConfig`, setting options this way makes it possible to override these after building using environment variables.

## Usage

If you want to use environment variables to change [supported options](https://i18n.nuxtjs.org/docs/api/#supported-options), you will have to set these in `runtimeConfig.public.i18n`.

nuxt.config.ts

```ts
export default defineNuxtConfig({

    modules: ['@nuxtjs/i18n'],

    i18n: {

        // Leave options unset that you want to set using \`runtimeConfig\`

        // baseUrl: 'https://example.com',

    },

    runtimeConfig: {

        public: {

            i18n: {

                baseUrl: 'https://example.com',

                domainLocales: {}

                // other options ...

            }

        }

    }

})
```

You can read more about how this works in the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables).

Only [serializable values are supported](https://nuxt.com/docs/guide/going-further/runtime-config#serialization) in `runtimeConfig`, options set this way may not support all available types (such as functions) as would normally be possible using the default configuration.

If you would like other options to be supported, open an issue describing your use case, or open a PR adding to add support yourself!

## Supported options

The module configuration takes precedence, options set through `runtimeConfig` will only be used if they are unset.

These options can be set using `runtimeConfig`:

### baseUrl

- key: `NUXT_PUBLIC_I18N_BASE_URL`

This runtime config option is the same as the [`baseUrl`](https://i18n.nuxtjs.org/docs/api/options#baseUrl) module option.

Note that the `baseUrl` module option allows you to set the function, but the runtime config does not due to limitations.

### domainLocales

- property: `domainLocales[code].domain`
- key: `NUXT_PUBLIC_I18N_DOMAIN_LOCALES_{code}_DOMAIN`

This runtime config option allows overriding the domain set in the [`locales`](https://i18n.nuxtjs.org/docs/api/options#locales) module option.