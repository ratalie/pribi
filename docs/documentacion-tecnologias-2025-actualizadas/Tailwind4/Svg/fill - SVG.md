---
title: fill - SVG
source: https://tailwindcss.com/docs/fill
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for styling the fill of SVG elements.
tags:
  - clippings
updated: 2025-10-14T01:01
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. SVG
2. fill

SVG

## fill

Utilities for styling the fill of SVG elements.

| Class | Styles |
| --- | --- |
| `fill-none` | `fill: none;` |
| `fill-inherit` | `fill: inherit;` |
| `fill-current` | `fill: currentColor;` |
| `fill-transparent` | `fill: transparent;` |
| `fill-black` | `fill: var(--color-black); /* #000 */` |
| `fill-white` | `fill: var(--color-white); /* #fff */` |
| `fill-red-50` | `fill: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `fill-red-100` | `fill: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `fill-red-200` | `fill: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `fill-red-300` | `fill: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |

Use utilities like `fill-indigo-500` and `fill-lime-600` to change the fill color of an SVG:

```
<svg class="fill-blue-500 ...">
  <!-- ... -->
</svg>
```

This can be useful for styling icon sets like [Heroicons](https://heroicons.com/).

Use the `fill-current` utility to set the fill color to the current text color:

Hover over the button to see the fill color change

```
<button class="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white ...">
  <svg class="size-5 fill-current ...">
    <!-- ... -->
  </svg>
  Check for updates
</button>
```

Use the `fill-[<value>]` syntaxto set the fill color based on a completely custom value:

```
<svg class="fill-[#243c5a] ...">
  <!-- ... -->
</svg>
```

For CSS variables, you can also use the `fill-(<custom-property>)` syntax:

```
<svg class="fill-(--my-fill-color) ...">
  <!-- ... -->
</svg>
```

This is just a shorthand for `fill-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `fill` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<svg class="fill-cyan-500 md:fill-cyan-700 ...">
  <!-- ... -->
</svg>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now the `fill-regal-blue` utility can be used in your markup:

```
<svg class="fill-regal-blue">
  <!-- ... -->
</svg>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)