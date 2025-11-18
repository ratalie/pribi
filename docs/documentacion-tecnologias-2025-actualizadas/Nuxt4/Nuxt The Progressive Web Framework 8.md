---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/transitions
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
## Transitions

Apply transitions between pages and layouts with Vue or native browser View Transitions.

Nuxt leverages Vue's [`<Transition>`](https://vuejs.org/guide/built-ins/transition.html#the-transition-component) component to apply transitions between pages and layouts.

## Page Transitions

You can enable page transitions to apply an automatic transition for all your [pages](https://nuxt.com/docs/4.x/guide/directory-structure/app/pages).

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    pageTransition: { name: 'page', mode: 'out-in' },

  },

})
```

If you are changing layouts as well as page, the page transition you set here will not run. Instead, you should set a [layout transition](https://nuxt.com/docs/4.x/getting-started/transitions#layout-transitions).

To start adding transition between your pages, add the following CSS to your [`app.vue`](https://nuxt.com/docs/4.x/guide/directory-structure/app):

This produces the following result when navigating between pages:

<video controls=""><source src="https://res.cloudinary.com/nuxt/video/upload/v1665061349/nuxt3/nuxt3-page-transitions_umwvmh.mp4" type="video/mp4"></video>

To set a different transition for a page, set the `pageTransition` key in [`definePageMeta`](https://nuxt.com/docs/4.x/api/utils/define-page-meta) of the page:

Moving to the about page will add the 3d rotation effect:

<video controls=""><source src="https://res.cloudinary.com/nuxt/video/upload/v1665063233/nuxt3/nuxt3-page-transitions-cutom.mp4" type="video/mp4"></video>

## Layout Transitions

You can enable layout transitions to apply an automatic transition for all your [layouts](https://nuxt.com/docs/4.x/guide/directory-structure/app/layouts).

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    layoutTransition: { name: 'layout', mode: 'out-in' },

  },

})
```

To start adding transition between your pages and layouts, add the following CSS to your [`app.vue`](https://nuxt.com/docs/4.x/guide/directory-structure/app):

This produces the following result when navigating between pages:

<video controls=""><source src="https://res.cloudinary.com/nuxt/video/upload/v1665065289/nuxt3/nuxt3-layouts-transitions_c9hwlx.mp4" type="video/mp4"></video>

Similar to `pageTransition`, you can apply a custom `layoutTransition` to the page component using `definePageMeta`:

pages/about.vue

```
<script setup lang="ts">

definePageMeta({

  layout: 'orange',

  layoutTransition: {

    name: 'slide-in',

  },

})

</script>
```

## Global Settings

You can customize these default transition names globally using `nuxt.config`.

Both `pageTransition` and `layoutTransition` keys accept [`TransitionProps`](https://vuejs.org/api/built-in-components.html#transition) as JSON serializable values where you can pass the `name`, `mode` and other valid transition-props of the custom CSS transition.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    pageTransition: {

      name: 'fade',

      mode: 'out-in', // default

    },

    layoutTransition: {

      name: 'slide',

      mode: 'out-in', // default

    },

  },

})
```

If you change the `name` property, you also have to rename the CSS classes accordingly.

To override the global transition property, use the `definePageMeta` to define page or layout transitions for a single Nuxt page and override any page or layout transitions that are defined globally in `nuxt.config` file.

pages/some-page.vue

```
<script setup lang="ts">

definePageMeta({

  pageTransition: {

    name: 'bounce',

    mode: 'out-in', // default

  },

})

</script>
```

## Disable Transitions

`pageTransition` and `layoutTransition` can be disabled for a specific route:

pages/some-page.vue

```
<script setup lang="ts">

definePageMeta({

  pageTransition: false,

  layoutTransition: false,

})

</script>
```

Or globally in the `nuxt.config`:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    pageTransition: false,

    layoutTransition: false,

  },

})
```

## JavaScript Hooks

For advanced use-cases, you can use JavaScript hooks to create highly dynamic and custom transitions for your Nuxt pages.

This way presents perfect use-cases for JavaScript animation libraries such as [GSAP](https://gsap.com/).

pages/some-page.vue

```
<script setup lang="ts">

definePageMeta({

  pageTransition: {

    name: 'custom-flip',

    mode: 'out-in',

    onBeforeEnter: (el) => {

      console.log('Before enter...')

    },

    onEnter: (el, done) => {},

    onAfterEnter: (el) => {},

  },

})

</script>
```

Learn more about additional [JavaScript hooks](https://vuejs.org/guide/built-ins/transition.html#javascript-hooks) available in the `Transition` component.

## Dynamic Transitions

To apply dynamic transitions using conditional logic, you can leverage inline [middleware](https://nuxt.com/docs/4.x/guide/directory-structure/app/middleware) to assign a different transition name to `to.meta.pageTransition`.

The page now applies the `slide-left` transition when going to the next id and `slide-right` for the previous:

<video controls=""><source src="https://res.cloudinary.com/nuxt/video/upload/v1665069410/nuxt3/nuxt-dynamic-page-transitions.mp4" type="video/mp4"></video>

## Transition with NuxtPage

When `<NuxtPage />` is used in `app.vue`, transitions can be configured with the `transition` prop to activate transitions globally.

app/app.vue

```
<template>

  <div>

    <NuxtLayout>

      <NuxtPage

        :transition="{

          name: 'bounce',

          mode: 'out-in',

        }"

      />

    </NuxtLayout>

  </div>

</template>
```

Remember, this page transition cannot be overridden with `definePageMeta` on individual pages.

## View Transitions API (experimental)

Nuxt ships with an experimental implementation of the [**View Transitions API**](https://developer.chrome.com/docs/web-platform/view-transitions) (see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)). This is an exciting new way to implement native browser transitions which (among other things) have the ability to transition between unrelated elements on different pages.

You can check a demo [on StackBlitz](https://stackblitz.com/edit/nuxt-view-transitions).

The Nuxt integration can be enabled with the `experimental.viewTransition` option in your configuration file:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  experimental: {

    viewTransition: true,

  },

})
```

The possible values are: `false`, `true`, or `'always'`.

If set to true, Nuxt will not apply transitions if the user's browser matches `prefers-reduced-motion: reduce` (recommended). If set to `always`, Nuxt will always apply the transition and it is up to you to respect the user's preference.

By default, view transitions are enabled for all [pages](https://nuxt.com/docs/4.x/guide/directory-structure/app/pages), but you can set a different global default.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  app: {

    // Disable view transitions globally, and opt-in on a per page basis

    viewTransition: false,

  },

})
```

It is possible to override the default `viewTransition` value for a page by setting the `viewTransition` key in [`definePageMeta`](https://nuxt.com/docs/4.x/api/utils/define-page-meta) of the page:

pages/about.vue

```
<script setup lang="ts">

definePageMeta({

  viewTransition: false,

})

</script>
```

Overriding view transitions on a per-page basis will only have an effect if you have enabled the `experimental.viewTransition` option.

If you are also using Vue transitions like `pageTransition` and `layoutTransition` (see above) to achieve the same result as the new View Transitions API, then you may wish to *disable* Vue transitions if the user's browser supports the newer, native web API. You can do this by creating `~/middleware/disable-vue-transitions.global.ts` with the following contents:

```ts
export default defineNuxtRouteMiddleware((to) => {

  if (import.meta.server || !document.startViewTransition) {

    return

  }

  // Disable built-in Vue transitions

  to.meta.pageTransition = false

  to.meta.layoutTransition = false

})
```

### Known Issues

- If you perform data fetching within your page setup functions, you may wish to reconsider using this feature for the moment. (By design, View Transitions completely freeze DOM updates whilst they are taking place.) We're looking at restricting the View Transition to the final moments before `<Suspense>` resolves, but in the interim you may want to consider carefully whether to adopt this feature if this describes you.

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/09.transitions.md)[SEO and Meta](https://nuxt.com/docs/4.x/getting-started/seo-meta)

[

Improve your Nuxt app's SEO with powerful head config, composables and components.

](https://nuxt.com/docs/4.x/getting-started/seo-meta)[

Data Fetching

Nuxt provides composables to handle data fetching within your application.

](https://nuxt.com/docs/4.x/getting-started/data-fetching)