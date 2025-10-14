---
title: "Nuxt: The Progressive Web Framework"
source: https://nuxt.com/docs/4.x/getting-started/data-fetching
author:
  - "[[Nuxt]]"
published:
created: 2025-10-13
description: Create high-quality web applications with Nuxt, the open source framework that makes full-stack development with Vue.js intuitive.
tags:
  - clippings
updated: 2025-10-13T00:18
---
## Data Fetching

Nuxt provides composables to handle data fetching within your application.

Nuxt comes with two composables and a built-in library to perform data-fetching in browser or server environments: `useFetch`, [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) and `$fetch`.

In a nutshell:

- [`$fetch`](https://nuxt.com/docs/4.x/api/utils/dollarfetch) is the simplest way to make a network request.
- [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) is a wrapper around `$fetch` that fetches data only once in [universal rendering](https://nuxt.com/docs/4.x/guide/concepts/rendering#universal-rendering).
- [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) is similar to `useFetch` but offers more fine-grained control.

Both `useFetch` and `useAsyncData` share a common set of options and patterns that we will detail in the last sections.

## The need for useFetch and useAsyncData

Nuxt is a framework which can run isomorphic (or universal) code in both server and client environments. If the [`$fetch` function](https://nuxt.com/docs/4.x/api/utils/dollarfetch) is used to perform data fetching in the setup function of a Vue component, this may cause data to be fetched twice, once on the server (to render the HTML) and once again on the client (when the HTML is hydrated). This can cause hydration issues, increase the time to interactivity and cause unpredictable behavior.

The [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) and [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) composables solve this problem by ensuring that if an API call is made on the server, the data is forwarded to the client in the payload.

The payload is a JavaScript object accessible through [`useNuxtApp().payload`](https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload). It is used on the client to avoid refetching the same data when the code is executed in the browser [during hydration](https://nuxt.com/docs/4.x/guide/concepts/rendering#universal-rendering).

Use the [Nuxt DevTools](https://devtools.nuxt.com/) to inspect this data in the **Payload tab**.

app/app.vue

```
<script setup lang="ts">

const { data } = await useFetch('/api/data')

async function handleFormSubmit () {

  const res = await $fetch('/api/submit', {

    method: 'POST',

    body: {

      // My form data

    },

  })

}

</script>

<template>

  <div v-if="data == undefined">

    No data

  </div>

  <div v-else>

    <form @submit="handleFormSubmit">

      <!-- form input tags -->

    </form>

  </div>

</template>
```

In the example above, `useFetch` would make sure that the request would occur in the server and is properly forwarded to the browser. `$fetch` has no such mechanism and is a better option to use when the request is solely made from the browser.

### Suspense

Nuxt uses Vue's [`<Suspense>`](https://vuejs.org/guide/built-ins/suspense) component under the hood to prevent navigation before every async data is available to the view. The data fetching composables can help you leverage this feature and use what suits best on a per-call basis.

You can add the [`<NuxtLoadingIndicator>`](https://nuxt.com/docs/4.x/api/components/nuxt-loading-indicator) to add a progress bar between page navigations.

## $fetch

Nuxt includes the [ofetch](https://github.com/unjs/ofetch) library, and is auto-imported as the `$fetch` alias globally across your application.

pages/todos.vue

```
<script setup lang="ts">

async function addTodo () {

  const todo = await $fetch('/api/todos', {

    method: 'POST',

    body: {

      // My todo data

    },

  })

}

</script>
```

Beware that using only `$fetch` will not provide [network calls de-duplication and navigation prevention](https://nuxt.com/docs/4.x/getting-started/data-fetching#the-need-for-usefetch-and-useasyncdata).  
It is recommended to use `$fetch` for client-side interactions (event-based) or combined with [`useAsyncData`](https://nuxt.com/docs/4.x/getting-started/data-fetching#useasyncdata) when fetching the initial component data.

Read more about `$fetch`.

### Pass Client Headers to the API

When calling `useFetch` on the server, Nuxt will use [`useRequestFetch`](https://nuxt.com/docs/4.x/api/composables/use-request-fetch) to proxy client headers and cookies (with the exception of headers not meant to be forwarded, like `host`).

```
<script setup lang="ts">

const { data } = await useFetch('/api/echo')

</script>
```

Alternatively, the example below shows how to use [`useRequestHeaders`](https://nuxt.com/docs/4.x/api/composables/use-request-headers) to access and send cookies to the API from a server-side request (originating on the client). Using an isomorphic `$fetch` call, we ensure that the API endpoint has access to the same `cookie` header originally sent by the user's browser. This is only necessary if you aren't using `useFetch`.

You can also use [`useRequestFetch`](https://nuxt.com/docs/4.x/api/composables/use-request-fetch) to proxy headers to the call automatically.

## useFetch

The [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) composable uses `$fetch` under-the-hood to make SSR-safe network calls in the setup function.

app/app.vue

```
<script setup lang="ts">

const { data: count } = await useFetch('/api/count')

</script>

<template>

  <p>Page visits: {{ count }}</p>

</template>
```

This composable is a wrapper around the [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) composable and `$fetch` utility.

Read more in Docs > 4 X > API > Composables > Use Fetch.

Read and edit a live example in [Docs > 4 X > Examples > Features > Data Fetching](https://nuxt.com/docs/4.x/examples/features/data-fetching).

## useAsyncData

The `useAsyncData` composable is responsible for wrapping async logic and returning the result once it is resolved.

`useFetch(url)` is nearly equivalent to `useAsyncData(url, () => event.$fetch(url))`.  
It's developer experience sugar for the most common use case. (You can find out more about `event.fetch` at [`useRequestFetch`](https://nuxt.com/docs/4.x/api/composables/use-request-fetch).)

There are some cases when using the [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) composable is not appropriate, for example when a CMS or a third-party provide their own query layer. In this case, you can use [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) to wrap your calls and still keep the benefits provided by the composable.

app/pages/users.vue

```
<script setup lang="ts">

const { data, error } = await useAsyncData('users', () => myGetFunction('users'))

// This is also possible:

const { data, error } = await useAsyncData(() => myGetFunction('users'))

</script>
```

The first argument of [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) is a unique key used to cache the response of the second argument, the querying function. This key can be ignored by directly passing the querying function, the key will be auto-generated.  
  
Since the autogenerated key only takes into account the file and line where `useAsyncData` is invoked, it is recommended to always create your own key to avoid unwanted behavior, like when you are creating your own custom composable wrapping `useAsyncData`.  
  
Setting a key can be useful to share the same data between components using [`useNuxtData`](https://nuxt.com/docs/4.x/api/composables/use-nuxt-data) or to [refresh specific data](https://nuxt.com/docs/4.x/api/utils/refresh-nuxt-data#refresh-specific-data).

app/pages/users/\[id\].vue

```
<script setup lang="ts">

const { id } = useRoute().params

const { data, error } = await useAsyncData(\`user:${id}\`, () => {

  return myGetFunction('users', { id })

})

</script>
```

The `useAsyncData` composable is a great way to wrap and wait for multiple `$fetch` requests to be completed, and then process the results.

```
<script setup lang="ts">

const { data: discounts, status } = await useAsyncData('cart-discount', async () => {

  const [coupons, offers] = await Promise.all([

    $fetch('/cart/coupons'),

    $fetch('/cart/offers'),

  ])

  return { coupons, offers }

})

// discounts.value.coupons

// discounts.value.offers

</script>
```

`useAsyncData` is for fetching and caching data, not triggering side effects like calling Pinia actions, as this can cause unintended behavior such as repeated executions with nullish values. If you need to trigger side effects, use the [`callOnce`](https://nuxt.com/docs/4.x/api/utils/call-once) utility to do so.

```
<script setup lang="ts">

const offersStore = useOffersStore()

// you can't do this

await useAsyncData(() => offersStore.getOffer(route.params.slug))

</script>
```

Read more about `useAsyncData`.

## Return Values

`useFetch` and `useAsyncData` have the same return values listed below.

- `data`: the result of the asynchronous function that is passed in.
- `refresh` / `execute`: a function that can be used to refresh the data returned by the `handler` function.
- `clear`: a function that can be used to set `data` to `undefined` (or the value of `options.default()` if provided), set `error` to `undefined`, set `status` to `idle`, and mark any currently pending requests as cancelled.
- `error`: an error object if the data fetching failed.
- `status`: a string indicating the status of the data request (`"idle"`, `"pending"`, `"success"`, `"error"`).

`data`, `error` and `status` are Vue refs accessible with `.value` in `<script setup>`

By default, Nuxt waits until a `refresh` is finished before it can be executed again.

If you have not fetched data on the server (for example, with `server: false`), then the data *will not* be fetched until hydration completes. This means even if you await `useFetch` on client-side, `data` will remain null within `<script setup>`.

## Options

[`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) and [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) return the same object type and accept a common set of options as their last argument. They can help you control the composables behavior, such as navigation blocking, caching or execution.

### Lazy

By default, data fetching composables will wait for the resolution of their asynchronous function before navigating to a new page by using Vue's Suspense. This feature can be ignored on client-side navigation with the `lazy` option. In that case, you will have to manually handle loading state using the `status` value.

app/app.vue

```
<script setup lang="ts">

const { status, data: posts } = useFetch('/api/posts', {

  lazy: true,

})

</script>

<template>

  <!-- you will need to handle a loading state -->

  <div v-if="status === 'pending'">

    Loading ...

  </div>

  <div v-else>

    <div v-for="post in posts">

      <!-- do something -->

    </div>

  </div>

</template>
```

You can alternatively use [`useLazyFetch`](https://nuxt.com/docs/4.x/api/composables/use-lazy-fetch) and `useLazyAsyncData` as convenient methods to perform the same.

```
<script setup lang="ts">

const { status, data: posts } = useLazyFetch('/api/posts')

</script>
```

Read more about `useLazyFetch`.

Read more about `useLazyAsyncData`.

### Client-only fetching

By default, data fetching composables will perform their asynchronous function on both client and server environments. Set the `server` option to `false` to only perform the call on the client-side. On initial load, the data will not be fetched before hydration is complete so you have to handle a pending state, though on subsequent client-side navigation the data will be awaited before loading the page.

Combined with the `lazy` option, this can be useful for data that is not needed on the first render (for example, non-SEO sensitive data).

The `useFetch` composable is meant to be invoked in setup method or called directly at the top level of a function in lifecycle hooks, otherwise you should use [`$fetch` method](https://nuxt.com/docs/4.x/getting-started/data-fetching#fetch).

### Minimize payload size

The `pick` option helps you to minimize the payload size stored in your HTML document by only selecting the fields that you want returned from the composables.

```
<script setup lang="ts">

/* only pick the fields used in your template */

const { data: mountain } = await useFetch('/api/mountains/everest', {

  pick: ['title', 'description'],

})

</script>

<template>

  <h1>{{ mountain.title }}</h1>

  <p>{{ mountain.description }}</p>

</template>
```

If you need more control or map over several objects, you can use the `transform` function to alter the result of the query.

```ts
const { data: mountains } = await useFetch('/api/mountains', {

  transform: (mountains) => {

    return mountains.map(mountain => ({ title: mountain.title, description: mountain.description }))

  },

})
```

Both `pick` and `transform` don't prevent the unwanted data from being fetched initially. But they will prevent unwanted data from being added to the payload transferred from server to client.

### Caching and refetching

#### Keys

[`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) and [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) use keys to prevent refetching the same data.

- [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) uses the provided URL as a key. Alternatively, a `key` value can be provided in the `options` object passed as a last argument.
- [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) uses its first argument as a key if it is a string. If the first argument is the handler function that performs the query, then a key that is unique to the file name and line number of the instance of `useAsyncData` will be generated for you.

To get the cached data by key, you can use [`useNuxtData`](https://nuxt.com/docs/4.x/api/composables/use-nuxt-data)

#### Shared State and Option Consistency

When multiple components use the same key with `useAsyncData` or `useFetch`, they will share the same `data`, `error` and `status` refs. This ensures consistency across components but requires some options to be consistent.

The following options **must be consistent** across all calls with the same key:

- `handler` function
- `deep` option
- `transform` function
- `pick` array
- `getCachedData` function
- `default` value

```ts
// ❌ This will trigger a development warning

const { data: users1 } = useAsyncData('users', () => $fetch('/api/users'), { deep: false })

const { data: users2 } = useAsyncData('users', () => $fetch('/api/users'), { deep: true })
```

The following options **can safely differ** without triggering warnings:

- `server`
- `lazy`
- `immediate`
- `dedupe`
- `watch`

```ts
// ✅ This is allowed

const { data: users1 } = useAsyncData('users', () => $fetch('/api/users'), { immediate: true })

const { data: users2 } = useAsyncData('users', () => $fetch('/api/users'), { immediate: false })
```

If you need independent instances, use different keys:

```ts
// These are completely independent instances

const { data: users1 } = useAsyncData('users-1', () => $fetch('/api/users'))

const { data: users2 } = useAsyncData('users-2', () => $fetch('/api/users'))
```

#### Reactive Keys

You can use computed refs, plain refs or getter functions as keys, allowing for dynamic data fetching that automatically updates when dependencies change:

```ts
// Using a computed property as a key

const userId = ref('123')

const { data: user } = useAsyncData(

  computed(() => \`user-${userId.value}\`),

  () => fetchUser(userId.value),

)

// When userId changes, the data will be automatically refetched

// and the old data will be cleaned up if no other components use it

userId.value = '456'
```

#### Refresh and execute

If you want to fetch or refresh data manually, use the `execute` or `refresh` function provided by the composables.

```
<script setup lang="ts">

const { data, error, execute, refresh } = await useFetch('/api/users')

</script>

<template>

  <div>

    <p>{{ data }}</p>

    <button @click="() => refresh()">

      Refresh data

    </button>

  </div>

</template>
```

The `execute` function is an alias for `refresh` that works in exactly the same way but is more semantic for cases when the fetch is [not immediate](https://nuxt.com/docs/4.x/getting-started/data-fetching#not-immediate).

To globally refetch or invalidate cached data, see [`clearNuxtData`](https://nuxt.com/docs/4.x/api/utils/clear-nuxt-data) and [`refreshNuxtData`](https://nuxt.com/docs/4.x/api/utils/refresh-nuxt-data).

#### Clear

If you want to clear the data provided, for whatever reason, without needing to know the specific key to pass to `clearNuxtData`, you can use the `clear` function provided by the composables.

```
<script setup lang="ts">

const { data, clear } = await useFetch('/api/users')

const route = useRoute()

watch(() => route.path, (path) => {

  if (path === '/') {

    clear()

  }

})

</script>
```

#### Watch

To re-run your fetching function each time other reactive values in your application change, use the `watch` option. You can use it for one or multiple *watchable* elements.

```
<script setup lang="ts">

const id = ref(1)

const { data, error, refresh } = await useFetch('/api/users', {

  /* Changing the id will trigger a refetch */

  watch: [id],

})

</script>
```

Note that **watching a reactive value won't change the URL fetched**. For example, this will keep fetching the same initial ID of the user because the URL is constructed at the moment the function is invoked.

```
<script setup lang="ts">

const id = ref(1)

const { data, error, refresh } = await useFetch(\`/api/users/${id.value}\`, {

  watch: [id],

})

</script>
```

If you need to change the URL based on a reactive value, you may want to use a [computed URL](https://nuxt.com/docs/4.x/getting-started/data-fetching#computed-url) instead.

When reactive fetch options are provided, they'll be automatically watched and trigger refetches. In some cases, it can be useful to opt-out of this behavior by specifying `watch: false`.

```ts
const id = ref(1)

// Won't automatically refetch when id changes

const { data, execute } = await useFetch('/api/users', {

  query: { id }, // id is watched by default

  watch: false, // disables automatic watching of id

})

// doesn't trigger refetch

id.value = 2
```

#### Computed URL

Sometimes you may need to compute a URL from reactive values, and refresh the data each time these change. Instead of juggling your way around, you can attach each param as a reactive value. Nuxt will automatically use the reactive value and re-fetch each time it changes.

```
<script setup lang="ts">

const id = ref(null)

const { data, status } = useLazyFetch('/api/user', {

  query: {

    user_id: id,

  },

})

</script>
```

In the case of more complex URL construction, you may use a callback as a [computed getter](https://vuejs.org/guide/essentials/computed.html) that returns the URL string.

Every time a dependency changes, the data will be fetched using the newly constructed URL. Combine this with [not-immediate](https://nuxt.com/docs/4.x/getting-started/data-fetching#not-immediate), and you can wait until the reactive element changes before fetching.

```
<script setup lang="ts">

const id = ref(null)

const { data, status } = useLazyFetch(() => \`/api/users/${id.value}\`, {

  immediate: false,

})

const pending = computed(() => status.value === 'pending')

</script>

<template>

  <div>

    <!-- disable the input while fetching -->

    <input

      v-model="id"

      type="number"

      :disabled="pending"

    >

    <div v-if="status === 'idle'">

      Type an user ID

    </div>

    <div v-else-if="pending">

      Loading ...

    </div>

    <div v-else>

      {{ data }}

    </div>

  </div>

</template>
```

If you need to force a refresh when other reactive values change, you can also [watch other values](https://nuxt.com/docs/4.x/getting-started/data-fetching#watch).

### Not immediate

The `useFetch` composable will start fetching data the moment is invoked. You may prevent this by setting `immediate: false`, for example, to wait for user interaction.

With that, you will need both the `status` to handle the fetch lifecycle, and `execute` to start the data fetch.

For finer control, the `status` variable can be:

- `idle` when the fetch hasn't started
- `pending` when a fetch has started but not yet completed
- `error` when the fetch fails
- `success` when the fetch is completed successfully

## Passing Headers and Cookies

When we call `$fetch` in the browser, user headers like `cookie` will be directly sent to the API.

Normally, during server-side-rendering, due to security considerations, the `$fetch` wouldn't include the user's browser cookies, nor pass on cookies from the fetch response.

However, when calling `useFetch` with a relative URL on the server, Nuxt will use [`useRequestFetch`](https://nuxt.com/docs/4.x/api/composables/use-request-fetch) to proxy headers and cookies (with the exception of headers not meant to be forwarded, like `host`).

### Pass Cookies From Server-side API Calls on SSR Response

If you want to pass on/proxy cookies in the other direction, from an internal request back to the client, you will need to handle this yourself.

app/composables/fetch.ts

```ts
import { appendResponseHeader } from 'h3'

import type { H3Event } from 'h3'

export const fetchWithCookie = async (event: H3Event, url: string) => {

  /* Get the response from the server endpoint */

  const res = await $fetch.raw(url)

  /* Get the cookies from the response */

  const cookies = res.headers.getSetCookie()

  /* Attach each cookie to our incoming Request */

  for (const cookie of cookies) {

    appendResponseHeader(event, 'set-cookie', cookie)

  }

  /* Return the data of the response */

  return res._data

}
```

## Options API Support

Nuxt provides a way to perform `asyncData` fetching within the Options API. You must wrap your component definition within `defineNuxtComponent` for this to work.

```
<script>

export default defineNuxtComponent({

  /* Use the fetchKey option to provide a unique key */

  fetchKey: 'hello',

  async asyncData () {

    return {

      hello: await $fetch('/api/hello'),

    }

  },

})

</script>
```

Using `<script setup>` or `<script setup lang="ts">` are the recommended way of declaring Vue components in Nuxt.

Read more in Docs > 4 X > API > Utils > Define Nuxt Component.

## Serializing Data From Server to Client

When using `useAsyncData` and `useLazyAsyncData` to transfer data fetched on server to the client (as well as anything else that utilizes [the Nuxt payload](https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload)), the payload is serialized with [`devalue`](https://github.com/Rich-Harris/devalue). This allows us to transfer not just basic JSON but also to serialize and revive/deserialize more advanced kinds of data, such as regular expressions, Dates, Map and Set, `ref`, `reactive`, `shallowRef`, `shallowReactive` and `NuxtError` - and more.

It is also possible to define your own serializer/deserializer for types that are not supported by Nuxt. You can read more in the [`useNuxtApp`](https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload) docs.

Note that this *does not apply* to data passed from your server routes when fetched with `$fetch` or `useFetch` - see the next section for more information.

## Serializing Data From API Routes

When fetching data from the `server` directory, the response is serialized using `JSON.stringify`. However, since serialization is limited to only JavaScript primitive types, Nuxt does its best to convert the return type of `$fetch` and [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) to match the actual value.

Learn more about `JSON.stringify` limitations.

### Example

server/api/foo.ts

```ts
export default defineEventHandler(() => {

  return new Date()

})
```

app/app.vue

```
<script setup lang="ts">

// Type of \`data\` is inferred as string even though we returned a Date object

const { data } = await useFetch('/api/foo')

</script>
```

### Custom serializer function

To customize the serialization behavior, you can define a `toJSON` function on your returned object. If you define a `toJSON` method, Nuxt will respect the return type of the function and will not try to convert the types.

server/api/bar.ts

```ts
export default defineEventHandler(() => {

  const data = {

    createdAt: new Date(),

    toJSON () {

      return {

        createdAt: {

          year: this.createdAt.getFullYear(),

          month: this.createdAt.getMonth(),

          day: this.createdAt.getDate(),

        },

      }

    },

  }

  return data

})
```

app/app.vue

```
<script setup lang="ts">

// Type of \`data\` is inferred as

// {

//   createdAt: {

//     year: number

//     month: number

//     day: number

//   }

// }

const { data } = await useFetch('/api/bar')

</script>
```

### Using an alternative serializer

Nuxt does not currently support an alternative serializer to `JSON.stringify`. However, you can return your payload as a normal string and utilize the `toJSON` method to maintain type safety.

In the example below, we use [superjson](https://github.com/blitz-js/superjson) as our serializer.

server/api/superjson.ts

```ts
import superjson from 'superjson'

export default defineEventHandler(() => {

  const data = {

    createdAt: new Date(),

    // Workaround the type conversion

    toJSON () {

      return this

    },

  }

  // Serialize the output to string, using superjson

  return superjson.stringify(data) as unknown as typeof data

})
```

app/app.vue

```
<script setup lang="ts">

import superjson from 'superjson'

// \`date\` is inferred as { createdAt: Date } and you can safely use the Date object methods

const { data } = await useFetch('/api/superjson', {

  transform: (value) => {

    return superjson.parse(value as unknown as string)

  },

})

</script>
```

## Recipes

### Consuming SSE (Server-Sent Events) via POST request

If you're consuming SSE via GET request, you can use [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or VueUse composable [`useEventSource`](https://vueuse.org/core/useEventSource/).

When consuming SSE via POST request, you need to handle the connection manually. Here's how you can do it:

```ts
// Make a POST request to the SSE endpoint

const response = await $fetch<ReadableStream>('/chats/ask-ai', {

  method: 'POST',

  body: {

    query: 'Hello AI, how are you?',

  },

  responseType: 'stream',

})

// Create a new ReadableStream from the response with TextDecoderStream to get the data as text

const reader = response.pipeThrough(new TextDecoderStream()).getReader()

// Read the chunk of data as we get it

while (true) {

  const { value, done } = await reader.read()

  if (done) { break }

  console.log('Received:', value)

}
```

### Making parallel requests

When requests don't rely on each other, you can make them in parallel with `Promise.all()` to boost performance.

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/main/docs/1.getting-started/10.data-fetching.md)[Transitions](https://nuxt.com/docs/4.x/getting-started/transitions)

[

Apply transitions between pages and layouts with Vue or native browser View Transitions.

](https://nuxt.com/docs/4.x/getting-started/transitions)[

State Management

Nuxt provides powerful state management libraries and the useState composable to create a reactive and SSR-friendly shared state.

](https://nuxt.com/docs/4.x/getting-started/state-management)