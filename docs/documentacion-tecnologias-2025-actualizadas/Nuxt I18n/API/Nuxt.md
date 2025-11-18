---
title: Nuxt
source: https://i18n.nuxtjs.org/docs/api/nuxt
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: I18n Other APIs related to Nuxt.
tags:
  - clippings
updated: 2025-10-15T22:02
---
## Extension of Nuxt runtime app context

The following APIs are exposed both on `NuxtApp`.

### $i18n

- **Type**: `VueI18n | Composer`

See also [NuxtApp](https://nuxt.com/docs/guide/going-further/nuxt-app#accessing-nuxtapp)

`$i18n` is the global `Composer` or global `VueI18n` instance of Vue I18n. See about details [here](https://vue-i18n.intlify.dev/api/general.html#i18n)

If you set `i18n.vueI18n.legacy` option to `false` in your `@nuxtjs/i18n` configuration, `$i18n` is a global `Composer` instance. Otherwise, it is a global `VueI18n` instance.

Example use:

```ts
export default defineNuxtPlugin(nuxtApp => {

  nuxtApp.$i18n.onBeforeLanguageSwitch = (oldLocale, newLocale, isInitialSetup, nuxtApp) => {

    console.log('onBeforeLanguageSwitch', oldLocale, newLocale, isInitialSetup)

  }

})
```

### $routeBaseName()

### $switchLocalePath()

### $localePath()

### $localeRoute()

### $localeHead()

See more info about those in [Extension of Vue](https://i18n.nuxtjs.org/docs/api/vue) section.

## Extension of NuxtHooks

### 'i18n:registerModule' Hook

- **Arguments**:
	- registerModule (type: `({ langDir: string, locales: LocaleObject[] }) => void`)

my-module-example/module.ts

```ts
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({

  async setup(options, nuxt) {

    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('i18n:registerModule', register => {

      register({

        // langDir path needs to be resolved

        langDir: resolve('./lang'),

        locales: [

          {

            code: 'en',

            file: 'en.json',

          },

          {

            code: 'fr',

            file: 'fr.json',

          },

        ]

      })

    })

  }

})
```

See also [Extending messages hook](https://i18n.nuxtjs.org/docs/guide/extend-messages)[Vue](https://i18n.nuxtjs.org/docs/api/vue)

[

Extension of Vue.

](https://i18n.nuxtjs.org/docs/api/vue)[

Runtime config

i18n runtime config options.

](https://i18n.nuxtjs.org/docs/api/runtime-config)