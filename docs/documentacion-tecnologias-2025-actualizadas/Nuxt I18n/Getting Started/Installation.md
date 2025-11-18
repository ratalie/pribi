---
title: Installation
source: https://i18n.nuxtjs.org/docs/getting-started
author:
  - "[[@nuxtjs/i18n]]"
published:
created: 2025-10-15
description: Get started with Nuxt i18n module.
tags:
  - clippings
updated: 2025-10-15T22:00
---
Get started with Nuxt i18n module.

Nuxt i18n module configures **Vue I18n v11** for your project, see the [Vue i18n documentation](https://vue-i18n.intlify.dev/) for in depth guides on the functionalities it provides.

## Quick Start

1. Install `@nuxtjs/i18n` as a dev dependency to your project:

```bash
npx nuxi@latest module add @nuxtjs/i18n
```

1. Add `@nuxtjs/i18n` to your `nuxt.config` modules:

nuxt.config.ts

```ts
export default defineNuxtConfig({

  modules: ['@nuxtjs/i18n']

})
```

## Configuration

You can set the module options by using the `i18n` property in `nuxt.config` root.

nuxt.config.ts

```ts
export default defineNuxtConfig({

  modules: ['@nuxtjs/i18n'],

  i18n: {

    // Module Options

  }

})
```

## Edge Channel

### Opting in

You can opt in to the latest commits on the `main` branch to avoid waiting for the next release and helping the module by beta testing changes.

Update `@nuxtjs/i18n` dependency in your `package.json`:

package.json

```
{

  "devDependencies": {

-   "@nuxtjs/i18n": "^9.0.0"

+   "@nuxtjs/i18n": "npm:@nuxtjs/i18n-edge"

  }

}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.

### Opting out

Update `@nuxtjs/i18n` dependency in your `package.json`:

package.json

```
{

  "devDependencies": {

-   "@nuxtjs/i18n": "npm:@nuxtjs/i18n-edge"

+   "@nuxtjs/i18n": "^9.0.0"

  }

}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.[Usage](https://i18n.nuxtjs.org/docs/getting-started/usage)

[

The basics to get started with the Nuxt i18n module

](https://i18n.nuxtjs.org/docs/getting-started/usage)