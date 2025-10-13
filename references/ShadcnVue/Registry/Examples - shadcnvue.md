---
title: Examples - shadcn/vue
source: https://www.shadcn-vue.com/docs/registry/examples.html
author:
published:
created: 2025-10-13
description: "Examples of registry items: styles, components, css vars, etc."
tags:
  - clippings
updated: 2025-10-13T12:58
---
## Examples

Examples of registry items: styles, components, css vars, etc.

## registry:style

### Custom style that extends shadcn-vue

The following registry item is a custom style that extends shadcn-vue. On `npx shadcn-vue init`, it will:

- Install `@iconify/vue` as a dependency.
- Add the `Login01` block and `calendar` component to the project.
- Add the `editor` from a remote registry.
- Set the `font-sans` variable to `Inter, sans-serif`.
- Install a `brand` color in light and dark mode.

### Custom style from scratch

The following registry item is a custom style that doesn't extend shadcn-vue. See the `extends: none` field.

It can be used to create a new style from scratch i.e custom components, css vars, dependencies, etc.

On `npx shadcn-vue add`, the following will:

- Install `tailwind-merge` and `clsx` as dependencies.
- Add the `utils` registry item from the shadcn-vue registry.
- Add the `button`, `input`, `label`, and `select` components from a remote registry.
- Install new css vars: `main`, `bg`, `border`, `text`, `ring`.

example-style.json

## registry:theme

### Custom theme

### Custom colors

The following style will init using shadcn-vue defaults and then add a custom `brand` color.

example-style.json

## registry:block

### Custom block

This blocks installs the `Login01` block from the shadcn-vue registry.

### Install a block and override primitives

You can install a block fromt the shadcn-vue registry and override the primitives using your custom ones.

On `npx shadcn-vue add`, the following will:

- Add the `Login01` block from the shadcn-vue registry.
- Override the `button`, `input`, and `label` primitives with the ones from the remote registry.

## CSS Variables

### Custom Theme Variables

Add custom theme variables to the `theme` object.

example-theme.json

### Override Tailwind CSS variables

example-theme.json

## Add custom CSS

### Base styles

example-base.json

### Components

example-card.json

## Add custom utilities

### Simple utility

example-component.json

### Complex utility

example-utility.json

### Functional utilities

example-functional.json

## Add custom animations

Note: you need to define both `@keyframes` in css and `theme` in cssVars to use animations.

example-component.json

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/registry/examples.md)