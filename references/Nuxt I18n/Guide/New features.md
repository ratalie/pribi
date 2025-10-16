---
title: New features
source: https://i18n.nuxtjs.org/docs/guide/new-features
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: What's new in v10
tags:
  - clippings
updated: 2025-10-15T22:02
---
What's new in v10

### Custom routes via definePageMeta()

We have added support for setting custom routes for pages using the `definePageMeta()` API, which is now the recommended way to set custom routes for pages. This method is enabled by setting `customRoutes: 'meta'` in the module options.

To migrate from the `defineI18nRoute()` macro, you can simply replace it with `definePageMeta()` and set the `i18n` property with the same options:

pages/about.vue

```ts
<script setup>

definePageMeta({

  i18n: {

    paths: {

      en: '/about-us',

      fr: '/a-propos',

    }

  }

})

</script>
```

### Nitro-side language detection and redirection

Language detection and redirection has been reimplemented to be handled from the Nitro server, this allows us to redirect requests earlier in the request lifecycle which improves performance.

The previous implementation did not work correctly when combined with prerendering which this new implementation does.

While this change makes detection and redirection more accurate and should better match the documented behavior, if this causes issues in your project it can be disabled by setting `experimental.nitroContextDetection: false` in the module options. The option to disable this feature is temporary and will be removed in a future version.

### Experimental strict SEO mode

We have added a new experimental option `strictSeo` that enables strict SEO mode, which changes the way i18n head tags are handled.

With strict SEO mode enabled, the i18n head tags are managed internally, this allows for some much requested improvements:

- The module will no longer add alternate tags for unsupported locales when setting localized dynamic route params.
- Unsupported locale links used with `<SwitchLocalePathLink>` are disabled, their links will be set to `'#'` and will have a `data-i18n-disabled` attribute for styling purposes.
- The `useLocaleHead()` is no longer needed in strict SEO mode, i18n tags are automatically set by the module and usage will throw an error.
- Canonical query parameters are configured globally with `experimental.strictSeo.canonicalQueryParams`.
- The `useSetI18nParams()` inherits the global canonical query parameter config which can be overridden through its options parameter.

If this mode proves stable it will become the default in v11, please try it out and report any issues you encounter.[Migration Guide](https://i18n.nuxtjs.org/docs/guide/migrating)

[

Follow this guide to upgrade from v9.x to v10.x

](https://i18n.nuxtjs.org/docs/guide/migrating)[

Options

All the options you can use to configure Nuxt I18n.

](https://i18n.nuxtjs.org/docs/api/options)