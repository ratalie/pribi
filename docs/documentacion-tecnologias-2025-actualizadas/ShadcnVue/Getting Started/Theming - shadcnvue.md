---
title: Theming - shadcn/vue
source: https://www.shadcn-vue.com/docs/theming.html
author:
published:
created: 2025-10-13
description: Use CSS Variables to customize the look and feel of your application.
tags:
  - clippings
updated: 2025-10-13T12:45
---
## Theming

Use CSS Variables to customize the look and feel of your application.

You can choose between using CSS variables or Tailwind CSS utility classes for theming.

## Utility classes

To use utility classes for theming set `tailwind.cssVariables` to `false` in your `components.json` file.

components.json

## CSS Variables

To use CSS variables for theming set `tailwind.cssVariables` to `true` in your `components.json` file.

components.json

### Convention

We use a simple `background` and `foreground` convention for colors. The `background` variable is used for the background color of the component and the `foreground` variable is used for the text color.

Given the following CSS variables:

The `background` color of the following component will be `hsl(var(--primary))` and the `foreground` color will be `hsl(var(--primary-foreground))`.

### List of variables

Here's the list of variables available for customization:

### Adding new colors

To add new colors, you need to add them to your CSS file and to your `tailwind.config.js` file.

assets/css/tailwind.css

tailwind.config.js

You can now use the `warning` utility class in your components.

### Other color formats

I recommend using [HSL colors](https://www.smashingmagazine.com/2021/07/hsl-colors-css/) for theming but you can also use other color formats if you prefer.

See the [Tailwind CSS documentation](https://tailwindcss.com/docs/customizing-colors#using-css-variables) for more information on using `rgb`, `rgba` or `hsl` colors.

## Hex -> Color Channel

You can use [this tool](https://htmlcolors.com/hex-to-hsl) to convert your HEX color to HSL without the color space function. Simply add your color in hex format, copy one of the generated values, then add them to the CSS variable.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/theming.md)