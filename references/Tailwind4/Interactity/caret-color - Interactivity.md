---
title: caret-color - Interactivity
source: https://tailwindcss.com/docs/caret-color
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the color of the text input cursor.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. caret-color

Interactivity

## caret-color

Utilities for controlling the color of the text input cursor.

| Class | Styles |
| --- | --- |
| `caret-inherit` | `caret-color: inherit;` |
| `caret-current` | `caret-color: currentColor;` |
| `caret-transparent` | `caret-color: transparent;` |
| `caret-black` | `caret-color: var(--color-black); /* #000 */` |
| `caret-white` | `caret-color: var(--color-white); /* #fff */` |
| `caret-red-50` | `caret-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `caret-red-100` | `caret-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `caret-red-200` | `caret-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `caret-red-300` | `caret-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |
| `caret-red-400` | `caret-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */` |

Use utilities like `caret-rose-500` and `caret-lime-600` to change the color of the text input cursor:

Focus the textarea to see the new caret color

```
<textarea class="caret-pink-500 ..."></textarea>
```

Use the `caret-[<value>]` syntaxto set the caret color based on a completely custom value:

```
<textarea class="caret-[#50d71e] ..."></textarea>
```

For CSS variables, you can also use the `caret-(<custom-property>)` syntax:

```
<textarea class="caret-(--my-caret-color) ..."></textarea>
```

This is just a shorthand for `caret-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `caret-color` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<textarea class="caret-rose-500 md:caret-lime-600 ..."></textarea>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now the `caret-regal-blue` utility can be used in your markup:

```
<textarea class="caret-regal-blue"></textarea>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)