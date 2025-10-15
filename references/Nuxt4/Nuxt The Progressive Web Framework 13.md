---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/layers
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
## Layers

Nuxt provides a powerful system that allows you to extend the default files, configs, and much more.

One of the core features of Nuxt is the layers and extending support. You can extend a default Nuxt application to reuse components, utils, and configuration. The layers structure is almost identical to a standard Nuxt application which makes them easy to author and maintain.

## Use Cases

- Share reusable configuration presets across projects using `nuxt.config` and `app.config`
- Create a component library using [`app/components/`](https://nuxt.com/docs/4.x/guide/directory-structure/app/components) directory
- Create utility and composable library using [`app/composables/`](https://nuxt.com/docs/4.x/guide/directory-structure/app/composables) and [`app/utils/`](https://nuxt.com/docs/4.x/guide/directory-structure/app/utils) directories
- Create Nuxt module presets
- Share standard setup across projects
- Create Nuxt themes
- Enhance code organization by implementing a modular architecture and support Domain-Driven Design (DDD) pattern in large scale projects.

## Usage

By default, any layers within your project in the `~~/layers` directory will be automatically registered as layers in your project.

Layer auto-registration was introduced in Nuxt v3.12.0.

In addition, named layer aliases to the `srcDir` of each of these layers will automatically be created. For example, you will be able to access the `~~/layers/test` layer via `#layers/test`.

Named layer aliases were introduced in Nuxt v3.16.0.

In addition, you can extend from a layer by adding the [extends](https://nuxt.com/docs/4.x/api/nuxt-config#extends) property to your [`nuxt.config`](https://nuxt.com/docs/4.x/guide/directory-structure/nuxt-config) file.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  extends: [

    // Extend from a local layer

    '../base',

    // Extend from an installed npm package

    '@my-themes/awesome',

    // Extend from a git repository

    'github:my-themes/awesome#v1',

  ],

})
```

You can also pass an authentication token if you are extending from a private GitHub repository:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  extends: [

    // per layer configuration

    ['github:my-themes/private-awesome', { auth: process.env.GITHUB_TOKEN }],

  ],

})
```

You can override a layer's alias by specifying it in the options next to the layer source.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  extends: [

    [

      'github:my-themes/awesome',

      {

        meta: {

          name: 'my-awesome-theme',

        },

      },

    ],

  ],

})
```

Nuxt uses [unjs/c12](https://c12.unjs.io/) and [unjs/giget](https://giget.unjs.io/) for extending remote layers. Check the documentation for more information and all available options.

## Layer Priority

When using multiple layers, it's important to understand how they override each other:

1. **Layers in `extends`** - earlier entries have higher priority (first overrides second)
2. **Auto-scanned local layers** from `~~/layers` directory in alphabetical order (Z overrides A)
3. **Your project** has the highest priority in the stack - it will always override other layers

nuxt.config.ts

```ts
export default defineNuxtConfig({

  extends: [

    // Highest priority (among extends)

    '../base',

    // Medium priority

    '@my-themes/awesome',

    // Lower priority

    'github:my-themes/awesome#v1',

  ],

  // Your project has the highest priority

})
```

This means if multiple layers define the same component, configuration, or file, the one with higher priority will be used.

Read more about layers in the **Layer Author Guide**.

## Examples

Content Wind

A lightweight Nuxt theme to build a Markdown driven website. Powered by Nuxt Content, TailwindCSS and Iconify.

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/14.layers.md)[Server](https://nuxt.com/docs/4.x/getting-started/server)

[

Build full-stack applications with Nuxt's server framework. You can fetch data from your database or another server, create APIs, or even generate static server-side content like a sitemap or a RSS feed - all from a single codebase.

](https://nuxt.com/docs/4.x/getting-started/server)[

Prerendering

Nuxt allows pages to be statically rendered at build time to improve certain performance or SEO metrics

](https://nuxt.com/docs/4.x/getting-started/prerendering)