---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/seo-meta
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
## SEO and Meta

Improve your Nuxt app's SEO with powerful head config, composables and components.

Nuxt head tag management is powered by [Unhead](https://unhead.unjs.io/). It provides sensible defaults, several powerful composables and numerous configuration options to manage your app's head and SEO meta tags.

## Nuxt Config

Providing an [`app.head`](https://nuxt.com/docs/4.x/api/nuxt-config#head) property in your [`nuxt.config.ts`](https://nuxt.com/docs/4.x/guide/directory-structure/nuxt-config) allows you to statically customize the head for your entire app.

This method does not allow you to provide reactive data. We recommend using `useHead()` in `app.vue`.

It's good practice to set tags here that won't change such as your site title default, language and favicon.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    head: {

      title: 'Nuxt', // default fallback title

      htmlAttrs: {

        lang: 'en',

      },

      link: [

        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

      ],

    },

  },

})
```

You can also provide any of the keys listed below in [Types](https://nuxt.com/docs/4.x/getting-started/seo-meta#types).

### Defaults Tags

Some tags are provided by Nuxt by default to ensure your website works well out of the box.

- `viewport`: `width=device-width, initial-scale=1`
- `charset`: `utf-8`

While most sites won't need to override these defaults, you can update them using the keyed shortcuts.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    head: {

      // update Nuxt defaults

      charset: 'utf-16',

      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',

    },

  },

})
```

## useHead

The [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) composable function supports reactive input, allowing you to manage your head tags programmatically.

app/app.vue

```
<script setup lang="ts">

useHead({

  title: 'My App',

  meta: [

    { name: 'description', content: 'My amazing site.' },

  ],

  bodyAttrs: {

    class: 'test',

  },

  script: [{ innerHTML: 'console.log(\'Hello world\')' }],

})

</script>
```

We recommend taking a look at the [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) and [`useHeadSafe`](https://nuxt.com/docs/4.x/api/composables/use-head-safe) composables.

## useSeoMeta

The [`useSeoMeta`](https://nuxt.com/docs/4.x/api/composables/use-seo-meta) composable lets you define your site's SEO meta tags as an object with full type safety.

This helps you avoid typos and common mistakes, such as using `name` instead of `property`.

app/app.vue

```
<script setup lang="ts">

useSeoMeta({

  title: 'My Amazing Site',

  ogTitle: 'My Amazing Site',

  description: 'This is my amazing site, let me tell you all about it.',

  ogDescription: 'This is my amazing site, let me tell you all about it.',

  ogImage: 'https://example.com/image.png',

  twitterCard: 'summary_large_image',

})

</script>
```

Read more in Docs > 4 X > API > Composables > Use Seo Meta.

## Components

While using [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) is recommended in all cases, you may have a personal preference for defining your head tags in your template using components.

Nuxt provides the following components for this purpose: `<Title>`, `<Base>`, `<NoScript>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>` and `<Head>`. Note the capitalization of these components ensuring we don't use invalid native HTML tags.

`<Head>` and `<Body>` can accept nested meta tags (for aesthetic reasons) but this does not affect *where* the nested meta tags are rendered in the final HTML.

app/app.vue

```
<script setup lang="ts">

const title = ref('Hello World')

</script>

<template>

  <div>

    <Head>

      <Title>{{ title }}</Title>

      <Meta

        name="description"

        :content="title"

      />

      <Style>

        body { background-color: green; }

      </Style>

    </Head>

    <h1>{{ title }}</h1>

  </div>

</template>
```

It's suggested to wrap your components in either a `<Head>` or `<Html>` components as tags will be deduped more intuitively.

## Types

Below are the non-reactive types used for [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head), [`app.head`](https://nuxt.com/docs/4.x/api/nuxt-config#head) and components.

```ts
interface MetaObject {

  title?: string

  titleTemplate?: string | ((title?: string) => string)

  templateParams?: Record<string, string | Record<string, string>>

  base?: Base

  link?: Link[]

  meta?: Meta[]

  style?: Style[]

  script?: Script[]

  noscript?: Noscript[]

  htmlAttrs?: HtmlAttributes

  bodyAttrs?: BodyAttributes

}
```

See [@unhead/vue](https://github.com/unjs/unhead/blob/main/packages/vue/src/types/schema.ts) for more detailed types.

## Features

### Reactivity

Reactivity is supported on all properties, by providing a computed value, a getter, or a reactive object.

### Title Template

You can use the `titleTemplate` option to provide a dynamic template for customizing the title of your site. For example, you could add the name of your site to the title of every page.

The `titleTemplate` can either be a string, where `%s` is replaced with the title, or a function.

If you want to use a function (for full control), then this cannot be set in your `nuxt.config`. It is recommended instead to set it within your `app.vue` file where it will apply to all pages on your site:

Now, if you set the title to `My Page` with [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) on another page of your site, the title would appear as 'My Page - Site Title' in the browser tab. You could also pass `null` to default to 'Site Title'.

### Template Params

You can use `templateParams` to provide additional placeholders in your `titleTemplate` besides the default `%s`. This allows for more dynamic title generation.

### Body Tags

You can use the `tagPosition: 'bodyClose'` option on applicable tags to append them to the end of the `<body>` tag.

For example:

```
<script setup lang="ts">

useHead({

  script: [

    {

      src: 'https://third-party-script.com',

      // valid options are: 'head' | 'bodyClose' | 'bodyOpen'

      tagPosition: 'bodyClose',

    },

  ],

})

</script>
```

## Examples

### With definePageMeta

Within your [`app/pages/` directory](https://nuxt.com/docs/4.x/guide/directory-structure/app/pages), you can use `definePageMeta` along with [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) to set metadata based on the current route.

For example, you can first set the current page title (this is extracted at build time via a macro, so it can't be set dynamically):

pages/some-page.vue

```
<script setup lang="ts">

definePageMeta({

  title: 'Some Page',

})

</script>
```

And then in your layout file, you might use the route's metadata you have previously set:

layouts/default.vue

```
<script setup lang="ts">

const route = useRoute()

useHead({

  meta: [{ property: 'og:title', content: \`App Name - ${route.meta.title}\` }],

})

</script>
```

Read and edit a live example in [Docs > 4 X > Examples > Features > Meta Tags](https://nuxt.com/docs/4.x/examples/features/meta-tags).

Read more in Docs > 4 X > Guide > Directory Structure > App > Pages > #page Metadata.

### Dynamic Title

In the example below, `titleTemplate` is set either as a string with the `%s` placeholder or as a `function`, which allows greater flexibility in setting the page title dynamically for each route of your Nuxt app:

app/app.vue

```
<script setup lang="ts">

useHead({

  // as a string,

  // where \`%s\` is replaced with the title

  titleTemplate: '%s - Site Title',

})

</script>
```

app/app.vue

```
<script setup lang="ts">

useHead({

  // or as a function

  titleTemplate: (productCategory) => {

    return productCategory

      ? \`${productCategory} - Site Title\`

      : 'Site Title'

  },

})

</script>
```

`nuxt.config` is also used as an alternative way of setting the page title. However, `nuxt.config` does not allow the page title to be dynamic. Therefore, it is recommended to use `titleTemplate` in the `app.vue` file to add a dynamic title, which is then applied to all routes of your Nuxt app.

### External CSS

The example below shows how you might enable Google Fonts using either the `link` property of the [`useHead`](https://nuxt.com/docs/4.x/api/composables/use-head) composable or using the `<Link>` component:

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/08.seo-meta.md)[Routing](https://nuxt.com/docs/4.x/getting-started/routing)

[

Nuxt file-system routing creates a route for every file in the pages/ directory.

](https://nuxt.com/docs/4.x/getting-started/routing)[

Transitions

Apply transitions between pages and layouts with Vue or native browser View Transitions.

](https://nuxt.com/docs/4.x/getting-started/transitions)