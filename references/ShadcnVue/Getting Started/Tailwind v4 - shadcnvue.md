---
title: Tailwind v4 - shadcn/vue
source: https://www.shadcn-vue.com/docs/tailwind-v4.html
author:
published:
created: 2025-10-13
description: How to use shadcn-vue with Tailwind v4.
tags:
  - clippings
updated: 2025-10-13T12:59
---
## Tailwind v4

How to use shadcn-vue with Tailwind v4.

It's here! Tailwind v4. Ready for you to try out. You can start using it today.

[Get Started](https://www.shadcn-vue.com/docs/#try-it-out) [See Demo](https://v4.shadcn-vue.com/)

## What's New

- The CLI can now initialize projects with Tailwind v4.
- Full support for the new `@theme` directive and `@theme inline` option.
- All components are updated for Tailwind v4.
- Every primitive now has a `data-slot` attribute for styling.
- We've fixed and cleaned up the style of the components.
- We're deprecating the `toast` component in favor of `sonner`.
- Buttons now use the default cursor.
- We're deprecating the `default` style. New projects will use `new-york`.
- HSL colors are now converted to OKLCH.

**Note: this is non-breaking. Your existing apps with Tailwind v3 will still work. When you add new components, they'll still be in v3 until you upgrade. Only new projects start with Tailwind v4.**

## See it Live

I put together a demo with all the updated components here: [https://v4.shadcn-vue.com](https://v4.shadcn-vue.com/)

Take a look and test the components. If you find any bugs, please let me know on [GitHub](https://github.com/unovue/shadcn-vue).

## Try It Out

See the framework specific guides below for how to get started.[Vite](https://www.shadcn-vue.com/docs/installation/vite)

[<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 900 900" fill="none"><title>Nuxt</title><path d="M504.908 750H839.476C850.103 750.001 860.542 747.229 869.745 741.963C878.948 736.696 886.589 729.121 891.9 719.999C897.211 710.876 900.005 700.529 900 689.997C899.995 679.465 897.193 669.12 891.873 660.002L667.187 274.289C661.876 265.169 654.237 257.595 645.036 252.329C635.835 247.064 625.398 244.291 614.773 244.291C604.149 244.291 593.711 247.064 584.511 252.329C575.31 257.595 567.67 265.169 562.36 274.289L504.908 372.979L392.581 179.993C387.266 170.874 379.623 163.301 370.42 158.036C361.216 152.772 350.777 150 340.151 150C329.525 150 319.086 152.772 309.883 158.036C300.679 163.301 293.036 170.874 287.721 179.993L8.12649 660.002C2.80743 669.12 0.00462935 679.465 5.72978e-06 689.997C-0.00461789 700.529 2.78909 710.876 8.10015 719.999C13.4112 729.121 21.0523 736.696 30.255 741.963C39.4576 747.229 49.8973 750.001 60.524 750H270.538C353.748 750 415.112 713.775 457.336 643.101L559.849 467.145L614.757 372.979L779.547 655.834H559.849L504.908 750ZM267.114 655.737L120.551 655.704L340.249 278.586L449.87 467.145L376.474 593.175C348.433 639.03 316.577 655.737 267.114 655.737Z" fill="currentColor"></path></svg>

Nuxt

](https://www.shadcn-vue.com/docs/installation/nuxt)[

Astro

](https://www.shadcn-vue.com/docs/installation/astro)[

Laravel

](https://www.shadcn-vue.com/docs/installation/laravel)[

Manual

](https://www.shadcn-vue.com/docs/installation/manual)

## Upgrade Your Project

**Important:** Before upgrading, please read the [Tailwind v4 Compatibility Docs](https://tailwindcss.com/docs/compatibility) and make sure your project is ready for the upgrade. Tailwind v4 uses bleeding-edge browser features and is designed for modern browsers.

One of the major advantages of using `shadcn-vue` is that the code you end up with is exactly what you'd write yourself. There are no hidden abstractions.

This means when a dependency has a new release, you can just follow the official upgrade paths.

Here's how to upgrade your existing projects (full docs are on the way):

### 1\. Follow the Tailwind v4 Upgrade Guide

- Upgrade to Tailwind v4 by following the official upgrade guide: [https://tailwindcss.com/docs/upgrade-guide](https://tailwindcss.com/docs/upgrade-guide)
- Use the `@tailwindcss/upgrade@next` codemod to remove deprecated utility classes and update tailwind config.

### 2\. Update your CSS variables

The codemod will migrate your CSS variables as references under the `@theme` directive.

This works. But to make it easier to work with colors and other variables, we'll need to move the `hsl` wrappers and use `@theme inline`.

Here's how you do it:

1. Move `:root` and `.dark` out of the `@layer` base.
2. Wrap the color values in `hsl()`
3. Add the `inline` option to `@theme` i.e `@theme inline`
4. Remove the `hsl()` wrappers from `@theme`

This change makes it much simpler to access your theme variables in both utility classes and outside of CSS for eg. using color values in JavaScript.

### 3\. Use new size-\* utility

The new `size-*` utility (added in Tailwind v3.4), is now fully supported by `tailwind-merge`. You can replace `w-* h-*` with the new `size-*` utility:

### 4\. Install and Update your dependencies

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/tailwind-v4.md)