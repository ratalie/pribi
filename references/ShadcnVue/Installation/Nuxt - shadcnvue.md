---
title: Nuxt - shadcn/vue
source: https://www.shadcn-vue.com/docs/installation/nuxt.html
author:
published:
created: 2025-10-13
description: Install and configure Nuxt.
tags:
  - clippings
updated: 2025-10-13T13:08
---
## Nuxt

Install and configure Nuxt.

### Create project

Start by creating a new Nuxt project using `create-nuxt-app`:

If you encounter the error `ERROR: Cannot read properties of undefined (reading 'sys') (x4)`, please proceed to install TypeScript as a dependency, as advised in this [issue](https://github.com/nuxt/nuxt/issues/20936)

### Add Tailwind CSS

or install `@nuxtjs/tailwindcss@7.0.0-beta.1` or newer

For Nuxt v4: `app/assets/css/tailwind.css`  
For Nuxt v3: `assets/css/tailwind.css`  
  
Replace everything in `tailwind.css` with the following:

```
css@import "tailwindcss";
```

Update `nuxt.config.ts` with the following:

### Add Nuxt module

Skipping this step triggers numerous console warnings due to Nuxt's auto-import feature.

### Add a Nuxt Plugin for providing ssrWidth

Some components require a ssrWidth to be set through VueUse to avoid Hydration errors on mobile.

Add the following plugin to your Nuxt application:  
For Nuxt v4: `app/plugins/ssr-width.ts`  
For Nuxt v3: `plugins/ssr-width.ts`

Read more about [`useSSRWidth`](https://vueuse.org/core/useSSRWidth/)

### Configure nuxt.config.ts

### Run Nuxt Prepare

If you are initiating a new project, you need to run the command so that Nuxt generates the necessary `.nuxt` folder:

### Run the CLI

Run the `shadcn-vue` init command to setup your project:

You will be asked a few questions to configure `components.json`.

### Add Components

You can now start adding components to your project.

The command above will add the `Button` component to your project. Nuxt autoImport will handle importing the components, you can just use it as such:

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/installation/nuxt.md)