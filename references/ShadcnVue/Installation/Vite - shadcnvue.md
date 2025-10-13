---
title: Vite - shadcn/vue
source: https://www.shadcn-vue.com/docs/installation/vite.html
author:
published:
created: 2025-10-13
description: Install and configure Vite.
tags:
  - clippings
updated: 2025-10-13T13:08
---
## Vite

Install and configure Vite.

### Create project

Start by creating a new Vue project using `vite`:

```bash
pnpm create vite@latest my-vue-app --template vue-ts
```

### Add Tailwind CSS

```bash
pnpm add tailwindcss @tailwindcss/vite
```

Replace everything in `src/style.css` with the following:

src/style.css

```
css@import "tailwindcss";
```

### Edit tsconfig.json file

The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the `baseUrl` and `paths` properties to the `compilerOptions` section of the `tsconfig.json` and `tsconfig.app.json` files:

### Edit tsconfig.app.json file

Add the following code to the `tsconfig.app.json` file to resolve paths, for your IDE:

### Update vite.config.ts

Add the following code to the vite.config.ts so your app can resolve paths without error:

```bash
pnpm add -D @types/node
```
  

### Run the CLI

Run the `shadcn-vue` init command to setup your project:

```bash
pnpm dlx shadcn-vue@latest init
```

You will be asked a few questions to configure `components.json`.

### Add Components

You can now start adding components to your project.

```bash
pnpm dlx shadcn-vue@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/installation/vite.md)