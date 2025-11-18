---
title: stroke - SVG
source: https://tailwindcss.com/docs/stroke
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for styling the stroke of SVG elements.
tags:
  - clippings
updated: 2025-10-14T01:01
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. SVG
2. stroke

SVG

## stroke

Utilities for styling the stroke of SVG elements.

| Class | Styles |
| --- | --- |
| `stroke-none` | `stroke: none;` |
| `stroke-inherit` | `stroke: inherit;` |
| `stroke-current` | `stroke: currentColor;` |
| `stroke-transparent` | `stroke: transparent;` |
| `stroke-black` | `stroke: var(--color-black); /* #000 */` |
| `stroke-white` | `stroke: var(--color-white); /* #fff */` |
| `stroke-red-50` | `stroke: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `stroke-red-100` | `stroke: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `stroke-red-200` | `stroke: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `stroke-red-300` | `stroke: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |

Use utilities like `stroke-indigo-500` and `stroke-lime-600` to change the stroke color of an SVG:

```
<svg class="stroke-cyan-500 ...">
  <!-- ... -->
</svg>
```

This can be useful for styling icon sets like [Heroicons](https://heroicons.com/).

Use the `stroke-current` utility to set the stroke color to the current text color:

Hover over the button to see the stroke color change

```
<button class="bg-white text-pink-600 hover:bg-pink-600 hover:text-white ...">
  <svg class="size-5 stroke-current ..." fill="none">
    <!-- ... -->
  </svg>
  Download file
</button>
```

Use the `stroke-[<value>]` syntaxto set the stroke color based on a completely custom value:

```
<svg class="stroke-[#243c5a] ...">
  <!-- ... -->
</svg>
```

For CSS variables, you can also use the `stroke-(<custom-property>)` syntax:

```
<svg class="stroke-(--my-stroke-color) ...">
  <!-- ... -->
</svg>
```

This is just a shorthand for `stroke-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `stroke` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<svg class="stroke-cyan-500 md:stroke-cyan-700 ...">
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

Now the `stroke-regal-blue` utility can be used in your markup:

```
<svg class="stroke-regal-blue">
  <!-- ... -->
</svg>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)