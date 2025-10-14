---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/state-management
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
Nuxt provides the [`useState`](https://nuxt.com/docs/4.x/api/composables/use-state) composable to create a reactive and SSR-friendly shared state across components.

[`useState`](https://nuxt.com/docs/4.x/api/composables/use-state) is an SSR-friendly [`ref`](https://vuejs.org/api/reactivity-core.html#ref) replacement. Its value will be preserved after server-side rendering (during client-side hydration) and shared across all components using a unique key.

Because the data inside [`useState`](https://nuxt.com/docs/4.x/api/composables/use-state) will be serialized to JSON, it is important that it does not contain anything that cannot be serialized, such as classes, functions or symbols.

Read more about `useState` composable.

## Best Practices

Never define `const state = ref()` outside of `<script setup>` or `setup()` function.  
For example, doing `export myState = ref({})` would result in state shared across requests on the server and can lead to memory leaks.

Instead use `const useX = () => useState('x')`

## Examples

### Basic Usage

In this example, we use a component-local counter state. Any other component that uses `useState('counter')` shares the same reactive state.

app/app.vue

```
<script setup lang="ts">

const counter = useState('counter', () => Math.round(Math.random() * 1000))

</script>

<template>

  <div>

    Counter: {{ counter }}

    <button @click="counter++">

      +

    </button>

    <button @click="counter--">

      -

    </button>

  </div>

</template>
```

Read and edit a live example in [Docs > 4 X > Examples > Features > State Management](https://nuxt.com/docs/4.x/examples/features/state-management).

To globally invalidate cached state, see [`clearNuxtState`](https://nuxt.com/docs/4.x/api/utils/clear-nuxt-state) util.

### Initializing State

Most of the time, you will want to initialize your state with data that resolves asynchronously. You can use the [`app.vue`](https://nuxt.com/docs/4.x/guide/directory-structure/app) component with the [`callOnce`](https://nuxt.com/docs/4.x/api/utils/call-once) util to do so.

app/app.vue

```
<script setup lang="ts">

const websiteConfig = useState('config')

await callOnce(async () => {

  websiteConfig.value = await $fetch('https://my-cms.com/api/website-config')

})

</script>
```

This is similar to the [`nuxtServerInit` action](https://v2.nuxt.com/docs/directory-structure/store/#the-nuxtserverinit-action) in Nuxt 2, which allows filling the initial state of your store server-side before rendering the page.

Read more in Docs > 4 X > API > Utils > Call Once.

### Usage with Pinia

In this example, we leverage the [Pinia module](https://nuxt.com/modules/pinia) to create a global store and use it across the app.

Make sure to install the Pinia module with `npx nuxt module add pinia` or follow the [module's installation steps](https://pinia.vuejs.org/ssr/nuxt.html#Installation).

## Advanced Usage

Read and edit a live example in [Docs > 4 X > Examples > Advanced > Locale](https://nuxt.com/docs/4.x/examples/advanced/locale).

## Shared State

By using [auto-imported composables](https://nuxt.com/docs/4.x/guide/directory-structure/app/composables) we can define global type-safe states and import them across the app.

composables/states.ts

```ts
export const useColor = () => useState<string>('color', () => 'pink')
```

app/app.vue

```
<script setup lang="ts">

// ---cut-start---

const useColor = () => useState<string>('color', () => 'pink')

// ---cut-end---

const color = useColor() // Same as useState('color')

</script>

<template>

  <p>Current color: {{ color }}</p>

</template>
```

## Using third-party libraries

Nuxt **used to rely** on the Vuex library to provide global state management. If you are migrating from Nuxt 2, please head to [the migration guide](https://nuxt.com/docs/4.x/migration/configuration#vuex).

Nuxt is not opinionated about state management, so feel free to choose the right solution for your needs. There are multiple integrations with the most popular state management libraries, including:

- [Pinia](https://nuxt.com/modules/pinia) - the official Vue recommendation
- [Harlem](https://nuxt.com/modules/harlem) - immutable global state management
- [XState](https://nuxt.com/modules/xstate) - state machine approach with tools for visualizing and testing your state logic

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/11.state-management.md)[Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)

[

Nuxt provides composables to handle data fetching within your application.

](https://nuxt.com/docs/4.x/getting-started/data-fetching)[

Error Handling

Learn how to catch and handle errors in Nuxt.

](https://nuxt.com/docs/4.x/getting-started/error-handling)