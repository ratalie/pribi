---
title: Per-Component Translations
source: https://i18n.nuxtjs.org/docs/guide/per-component-translations
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Inline your translation messages within your components.
tags:
  - clippings
updated: 2025-10-15T22:01
---
Inline your translation messages within your components.

If you'd like to define translations per-page or per-component you can take advantage of the i18n custom block.

You can now define translations using i18n custom blocks in your Vue files:

page.vue

```
<script setup lang="ts">

const { t } = useI18n({

  useScope: 'local'

})

</script>

<template>

  <p>{{ t('hello') }}</p>

</template>

<i18n lang="json">

{

  "en": {

    "hello": "hello world!"

  },

  "ja": {

    "hello": "こんにちは、世界!"

  }

}

</i18n>
```

or using the Yaml syntax:

page.vue

```
<!-- same script and template as above  -->

<i18n lang="yaml">

en:

  hello: 'hello world!'

ja:

  hello: 'こんにちは、世界!'

</i18n>
```

Read more about [i18n custom blocks](https://vue-i18n.intlify.dev/guide/advanced/sfc.html)

When you use per-component translations, you will need to use `t()` exported by `useI18n()`, **not `$t()`**. To read more about `$t()` which isn't used in per-component translation, see the ["implicit with injected properties and functions" section of Vue I18n docs](https://vue-i18n.intlify.dev/guide/advanced/composition.html#implicit-with-injected-properties-and-functions).[Locale fallback](https://i18n.nuxtjs.org/docs/guide/locale-fallback)

[

How a fallback gets selected when a translation is missing.

](https://i18n.nuxtjs.org/docs/guide/locale-fallback)[

Extending messages hook

Nuxt hooks to extend i18n messages in your project.

](https://i18n.nuxtjs.org/docs/guide/extend-messages)