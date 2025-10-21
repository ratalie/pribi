---
title: Nuxt integration
source: https://vee-validate.logaretm.com/v4/integrations/nuxt/
author:
published:
created: 2025-10-21
description: VeeValidate Nuxt module
tags:
  - clippings
updated: 2025-10-21T08:18
---
## @vee-validate/nuxt

![](https://github.com/logaretm/vee-validate/raw/main/logo.png)

[![](https://sponsors.logaretm.com/sponsors.svg)](https://github.com/sponsors/logaretm)

Official vee-validate’s Nuxt module

## Features

- Auto import of vee-validate components
- Auto import of vee-validate composables
- Detecting if you are using `zod` or `yup` and exposing the `toTypedSchema` suitable for either.

warn

No types are exposed by default to avoid having conflicts with other libraries, aside from vee-validate’s main API components/composables. You can still import them via `vee-validate`.

## Getting Started

In your nuxt project install the vee-validate nuxt module:

```
sh# npm

npm i @vee-validate/nuxt

# pnpm

pnpm add @vee-validate/nuxt

# yarn

yarn add @vee-validate/nuxt
```

Then add the module to your `modules` config in `nuxt.config.ts`:

```
tsexport default defineNuxtConfig({

  // ...

  modules: [

    //...

    '@vee-validate/nuxt',

  ],

});
```

## Configuration

You can configure a few aspects of the `@vee-validate/nuxt` module. Here is the config interface:

```
tsexport default defineNuxtConfig({

  // ...

  modules: [

    //...

    [

      '@vee-validate/nuxt',

      {

        // disable or enable auto imports

        autoImports: true,

        // Use different names for components

        componentNames: {

          Form: 'VeeForm',

          Field: 'VeeField',

          FieldArray: 'VeeFieldArray',

          ErrorMessage: 'VeeErrorMessage',

        },

      },

    ],

  ],

});
```

You can also use the `veeValidate` config key instead of the array syntax:

```
tsexport default defineNuxtConfig({

  // ...

  modules: [

    //...

    '@vee-validate/nuxt',

  ],

  veeValidate: {

    // disable or enable auto imports

    autoImports: true,

    // Use different names for components

    componentNames: {

      Form: 'VeeForm',

      Field: 'VeeField',

      FieldArray: 'VeeFieldArray',

      ErrorMessage: 'VeeErrorMessage',

    },

  },

});
```

[Edit This Page on GitHub](https://github.com/logaretm/vee-validate/edit/main/docs/src/pages/integrations/nuxt.mdx)

[Sponsor](https://github.com/sponsors/logaretm)