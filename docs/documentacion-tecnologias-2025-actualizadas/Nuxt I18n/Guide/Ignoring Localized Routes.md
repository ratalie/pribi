---
title: Ignoring Localized Routes
source: https://i18n.nuxtjs.org/docs/guide/ignoring-localized-routes
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Customize localized route exclusions per page component.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Customize localized route exclusions per page component.

This feature is not supported when using the `'no_prefix'` [strategy](https://i18n.nuxtjs.org/docs/guide) unless you're also using [`differentDomains`](https://i18n.nuxtjs.org/docs/guide/different-domains).

If you'd like some pages to be available in some languages only, you can configure the list of supported languages to override the global settings. The options can be specified within either the page components themselves or globally, within the module configuration.

### Pick localized routes

```
// pages/about.vue

<script setup>

definePageMeta({

  i18n: { locales: ['fr', 'es'] }

})

</script>
```

### Disable localized routes

```
// pages/about.vue

<script setup>

definePageMeta({ i18n: false })

</script>
```[Custom Route Paths](https://i18n.nuxtjs.org/docs/guide/custom-paths)

[

Customize the names of the paths for specific locale.

](https://i18n.nuxtjs.org/docs/guide/custom-paths)[

Browser language detection

Detect user browser's language.

](https://i18n.nuxtjs.org/docs/guide/browser-language-detection)