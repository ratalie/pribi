---
title: CLI - shadcn/vue
source: https://www.shadcn-vue.com/docs/cli.html
author:
published:
created: 2025-10-13
description: Use the CLI to add components to your project.
tags:
  - clippings
updated: 2025-10-13T12:59
---
## CLI

Use the CLI to add components to your project.

## init

Use the `init` command to initialize configuration and dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
pnpm dlx shadcn-vue@latest init
```

You will be asked a few questions to configure `components.json`:

### Options

## add

Use the `add` command to add components and dependencies to your project.

```bash
pnpm dlx shadcn-vue@latest add [component]
```

You will be presented with a list of components to choose from:

### Options

## Monorepo

In a monorepo, you can specify the path to your workspace with the `-c` or `--cwd` option.

```bash
pnpm dlx shadcn-vue@latest init -c ./apps/www
```

or

```bash
pnpm dlx shadcn-vue@latest add alert-dialog -c ./apps/www
```

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/cli.md)

Original text

Rate this translation

Your feedback will be used to help improve Google Translate