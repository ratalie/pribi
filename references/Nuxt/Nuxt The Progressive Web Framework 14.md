---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/prerendering
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
## Prerendering

Nuxt allows pages to be statically rendered at build time to improve certain performance or SEO metrics

Nuxt allows for select pages from your application to be rendered at build time. Nuxt will serve the prebuilt pages when requested instead of generating them on the fly.

Read more in Nuxt rendering modes.

## Crawl-based Pre-rendering

Use the [`nuxt generate` command](https://nuxt.com/docs/4.x/api/commands/generate) to build and pre-render your application using the [Nitro](https://nuxt.com/docs/4.x/guide/concepts/server-engine) crawler. This command is similar to `nuxt build` with the `nitro.static` option set to `true`, or running `nuxt build --prerender`.

This will build your site, stand up a nuxt instance, and, by default, prerender the root page `/` along with any of your site's pages it links to, any of your site's pages they link to, and so on.

You can now deploy the `.output/public` directory to any static hosting service or preview it locally with `npx serve .output/public`.

Working of the Nitro crawler:

1. Load the HTML of your application's root route (`/`), any non-dynamic pages in your `~/pages` directory, and any other routes in the `nitro.prerender.routes` array.
2. Save the HTML and `payload.json` to the `~/.output/public/` directory to be served statically.
3. Find all anchor tags (`<a href="...">`) in the HTML to navigate to other routes.
4. Repeat steps 1-3 for each anchor tag found until there are no more anchor tags to crawl.

This is important to understand since pages that are not linked to a discoverable page can't be pre-rendered automatically.

Read more about the `nuxt generate` command.

### Selective Pre-rendering

You can manually specify routes that [Nitro](https://nuxt.com/docs/4.x/guide/concepts/server-engine) will fetch and pre-render during the build or ignore routes that you don't want to pre-render like `/dynamic` in the `nuxt.config` file:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  nitro: {

    prerender: {

      routes: ['/user/1', '/user/2'],

      ignore: ['/dynamic'],

    },

  },

})
```

You can combine this with the `crawlLinks` option to pre-render a set of routes that the crawler can't discover like your `/sitemap.xml` or `/robots.txt`:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  nitro: {

    prerender: {

      crawlLinks: true,

      routes: ['/sitemap.xml', '/robots.txt'],

    },

  },

})
```

Setting `nitro.prerender` to `true` is similar to `nitro.prerender.crawlLinks` to `true`.

Read more about pre-rendering in the Nitro documentation.

Lastly, you can manually configure this using routeRules.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  routeRules: {

    // Set prerender to true to configure it to be prerendered

    '/rss.xml': { prerender: true },

    // Set it to false to configure it to be skipped for prerendering

    '/this-DOES-NOT-get-prerendered': { prerender: false },

    // Everything under /blog gets prerendered as long as it

    // is linked to from another page

    '/blog/**': { prerender: true },

  },

})
```

Read more about Nitro's `routeRules` configuration.

As a shorthand, you can also configure this in a page file using [`defineRouteRules`](https://nuxt.com/docs/4.x/api/utils/define-route-rules).

This feature is experimental and in order to use it you must enable the `experimental.inlineRouteRules` option in your `nuxt.config`.

app/pages/index.vue

```
<script setup>

// Or set at the page level

defineRouteRules({

  prerender: true,

})

</script>

<template>

  <div>

    <h1>Homepage</h1>

    <p>Pre-rendered at build time</p>

  </div>

</template>
```

This will be translated to:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  routeRules: {

    '/': { prerender: true },

  },

})
```

## Runtime Prerender Configuration

### prerenderRoutes

You can use this at runtime within a [Nuxt context](https://nuxt.com/docs/4.x/guide/going-further/nuxt-app#the-nuxt-context) to add more routes for Nitro to prerender.

app/pages/index.vue

```
<script setup>

prerenderRoutes(['/some/other/url'])

prerenderRoutes('/api/content/article/my-article')

</script>

<template>

  <div>

    <h1>This will register other routes for prerendering when prerendered</h1>

  </div>

</template>
```

Read more in prerenderRoutes.

### prerender:routes Nuxt hook

This is called before prerendering for additional routes to be registered.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  hooks: {

    async 'prerender:routes' (ctx) {

      const { pages } = await fetch('https://api.some-cms.com/pages').then(

        res => res.json(),

      )

      for (const page of pages) {

        ctx.routes.add(\`/${page.name}\`)

      }

    },

  },

})
```

### prerender:generate Nitro hook

This is called for each route during prerendering. You can use this for fine-grained handling of each route that gets prerendered.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  nitro: {

    hooks: {

      'prerender:generate' (route) {

        if (route.route?.includes('private')) {

          route.skip = true

        }

      },

    },

  },

})
```

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/15.prerendering.md)[Layers](https://nuxt.com/docs/4.x/getting-started/layers)

[

Nuxt provides a powerful system that allows you to extend the default files, configs, and much more.

](https://nuxt.com/docs/4.x/getting-started/layers)[

Deployment

Learn how to deploy your Nuxt application to any hosting provider.

](https://nuxt.com/docs/4.x/getting-started/deployment)