---
title: outline-color - Borders
source: https://tailwindcss.com/docs/outline-color
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the color of an element's outline.
tags:
  - clippings
updated: 2025-10-14T00:14
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. outline-color

Borders

## outline-color

Utilities for controlling the color of an element's outline.

| Class | Styles |
| --- | --- |
| `outline-inherit` | `outline-color: inherit;` |
| `outline-current` | `outline-color: currentColor;` |
| `outline-transparent` | `outline-color: transparent;` |
| `outline-black` | `outline-color: var(--color-black); /* #000 */` |
| `outline-white` | `outline-color: var(--color-white); /* #fff */` |
| `outline-red-50` | `outline-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `outline-red-100` | `outline-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `outline-red-200` | `outline-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `outline-red-300` | `outline-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |
| `outline-red-400` | `outline-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */` |

Use utilities like `outline-rose-500` and `outline-lime-100` to control the color of an element's outline:

outline-blue-500

outline-cyan-500

outline-pink-500

```
<button class="outline-2 outline-offset-2 outline-blue-500 ...">Button A</button>
<button class="outline-2 outline-offset-2 outline-cyan-500 ...">Button B</button>
<button class="outline-2 outline-offset-2 outline-pink-500 ...">Button C</button>
```

Use the color opacity modifier to control the opacity of an element's outline color:

outline-blue-500/100

outline-blue-500/75

outline-blue-500/50

```
<button class="outline-2 outline-blue-500/100 ...">Button A</button>
<button class="outline-2 outline-blue-500/75 ...">Button B</button>
<button class="outline-2 outline-blue-500/50 ...">Button C</button>
```

Use the `outline-[<value>]` syntaxto set the outline color based on a completely custom value:

```
<div class="outline-[#243c5a] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `outline-(<custom-property>)` syntax:

```
<div class="outline-(--my-color) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `outline-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `outline-color` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="outline md:outline-blue-400 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now the `outline-regal-blue` utility can be used in your markup:

```
<div class="outline-regal-blue">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)