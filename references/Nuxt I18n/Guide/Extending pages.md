---
title: Extending pages
source: https://i18n.nuxtjs.org/docs/guide/extend-pages
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Adding localized pages from a module.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Adding localized pages from a module.

If you're a **module author** and want your module to add extra pages to your project, you can add these by using the `'pages:extend'` Nuxt hook.

modules/example-module/index.ts

```ts
import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({

  setup(options, nuxt) {

    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('pages:extend', pages => {

      pages.push({

        name: 'example-page',

        path: '/example-page',

        file: resolve(__dirname, './pages/example-page.vue')

      })

    })

  }

})
```[Extending messages hook](https://i18n.nuxtjs.org/docs/guide/extend-messages)

[

Nuxt hooks to extend i18n messages in your project.

](https://i18n.nuxtjs.org/docs/guide/extend-messages)[

Layers

Using layers to extends projects with Nuxt i18n.

](https://i18n.nuxtjs.org/docs/guide/layers)