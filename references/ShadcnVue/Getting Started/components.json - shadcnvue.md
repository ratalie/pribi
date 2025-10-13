---
title: components.json - shadcn/vue
source: https://www.shadcn-vue.com/docs/components-json.html
author:
published:
created: 2025-10-13
description: Configuration for your project.
tags:
  - clippings
updated: 2025-10-13T12:43
---
## components.json

Configuration for your project.

The `components.json` file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

Note: The `components.json` file is optional and **only required if you're using the CLI** to add components to your project. If you're using the copy and paste method, you don't need this file.

You can create a `components.json` file in your project by running the following command:

See the [CLI section](https://www.shadcn-vue.com/docs/cli.html) for more information.

## $schema

You can see the JSON Schema for `components.json` [here](https://shadcn-vue.com/schema.json).

components.json

For the `shadcn-vue@radix` tag, the schema is located [here](https://radix.shadcn-vue.com/schema.json). See the [Changelog](https://www.shadcn-vue.com/docs/changelog.html) for details.

## style

The style for your components. **This cannot be changed after initialization.**

components.json

## Tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your project.

See the [installation section](https://www.shadcn-vue.com/docs/installation.html) for how to set up Tailwind CSS.

### tailwind.config

Path to where your `tailwind.config.js` file is located.

components.json

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

components.json

### tailwind.baseColor

This is used to generate the default color palette for your components. **This cannot be changed after initialization.**

components.json

### tailwind.cssVariables

You can choose between using CSS variables or Tailwind CSS utility classes for theming.

To use utility classes for theming set `tailwind.cssVariables` to `false`. For CSS variables, set `tailwind.cssVariables` to `true`.

components.json

For more information, see the [theming docs](https://www.shadcn-vue.com/docs/theming.html).

**This cannot be changed after initialization.** To switch between CSS variables and utility classes, you'll have to delete and re-install your components.

### tailwind.prefix

The prefix to use for your Tailwind CSS utility classes. Components will be added with this prefix.

components.json

## aliases

The CLI uses these values and the `paths` config from your `tsconfig.json` or `jsconfig.json` file to place generated components in the correct location.

Path aliases have to be set up in your `tsconfig.json` or `jsconfig.json` file.

> A fallback to `tsconfig.app.json` if no `paths` were found in `tsconfig.json`

### aliases.utils

Import alias for your utility functions.

components.json

### aliases.components

Import alias for your components.

components.json

### aliases.ui

Import alias for `ui` components.

The CLI will use the `aliases.ui` value to determine where to place your `ui` components. Use this config if you want to customize the installation directory for your `ui` components.

components.json

### aliases.lib

Import alias for `lib` functions such as `cn` or `valueUpdater`.

components.json

### aliases.composables

Import alias for `composables` such as `useMediaQuery` or `useToast`.

components.json

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components-json.md)