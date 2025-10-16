---
title: Installing from a module
source: https://i18n.nuxtjs.org/docs/guide/install-module
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: How to install Nuxt i18n using `installModule` inside of a module.
tags:
  - clippings
updated: 2025-10-15T22:01
---
How to install Nuxt i18n using \`installModule\` inside of a module.

If you're a **module author** and want your module to install Nuxt i18n, you can do so using `installModule()` but you will have to resolve paths used for `vueI18n`, `langDir` and those configured in `locales`.

We strongly recommend using [layers](https://i18n.nuxtjs.org/docs/guide/layers) for complete module installations over using `installModule()`, layers are merged by priority which allows projects to overwrite options as desired and will not cause conflicts if more than one layer provides options for the Nuxt i18n module.  
  
If you would only like your module to provide translations, consider using the hook described in [extend-messages](https://i18n.nuxtjs.org/docs/guide/extend-messages) instead.

Note that when using `installModule()`, the options passed will essentially have a higher priority than any layer (including the project layer), options are merged when possible and applicable but will otherwise override configurations.

Example:

```ts
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({

  async setup(options, nuxt) {

    const { resolve } = createResolver(import.meta.url)

    // paths needs to be resolved so absolute paths are used

    await installModule('@nuxtjs/i18n', {

      vueI18n: resolve('./i18n.config.ts'),

      langDir: resolve('./lang'),

      locales: [

        {

          code: 'en',

          file: resolve('./lang/en.json'),

        },

        {

          code: 'fr',

          file: resolve('./lang/fr.json'),

        },

      ]

    })

  }

})
```

Now the project has access to new messages and can use them through `$t('my-module-example.hello')`.[Server-Side Translations](https://i18n.nuxtjs.org/docs/guide/server-side-translations)

[

Translate on the server-side and return it as a response.

](https://i18n.nuxtjs.org/docs/guide/server-side-translations)[

Migration Guide

Follow this guide to upgrade from v9.x to v10.x

](https://i18n.nuxtjs.org/docs/guide/migrating)