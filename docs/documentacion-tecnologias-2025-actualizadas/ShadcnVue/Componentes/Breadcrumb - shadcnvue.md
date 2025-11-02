---
title: Breadcrumb - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/breadcrumb.html
author:
published:
created: 2025-10-13
description: Displays the path to the current resource using a hierarchy of links.
tags:
  - clippings
updated: 2025-10-13T14:25
---
## Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Installation

```bash
npx shadcn-vue@latest add breadcrumb
```

## Usage

## Examples

### Custom separator

Use a custom component as `slot` for `<BreadcrumbSeparator />` to create a custom separator.

---

### Dropdown

You can compose `<BreadcrumbItem />` with a `<DropdownMenu />` to create a dropdown in the breadcrumb.

---

### Collapsed

We provide a `<BreadcrumbEllipsis />` component to show a collapsed state when the breadcrumb is too long.

---

### Link component

To use a custom link component from your routing library, you can use the `asChild` prop on `<BreadcrumbLink />`.

---

### Responsive

Here's an example of a responsive breadcrumb that composes `<BreadcrumbItem />` with `<BreadcrumbEllipsis />`, `<DropdownMenu />`, and `<Drawer />`.

It displays a dropdown on desktop and a drawer on mobile.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/breadcrumb.md)