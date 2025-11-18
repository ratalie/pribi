---
title: stroke-width - SVG
source: https://tailwindcss.com/docs/stroke-width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for styling the stroke width of SVG elements.
tags:
  - clippings
updated: 2025-10-14T01:01
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. SVG
2. stroke-width

SVG

## stroke-width

Utilities for styling the stroke width of SVG elements.

| Class | Styles |
| --- | --- |
| `stroke-<number>` | `stroke-width: <number>;` |
| `stroke-(length:<custom-property>)` | `stroke-width: var(<custom-property>);` |
| `stroke-[<value>]` | `stroke-width: <value>;` |

Use `stroke-<number>` utilities like `stroke-1` and `stroke-2` to set the stroke width of an SVG:

```
<svg class="stroke-1 ..."></svg>
<svg class="stroke-2 ..."></svg>
```

This can be useful for styling icon sets like [Heroicons](https://heroicons.com/).

Use the `stroke-[<value>]` syntaxto set the stroke width based on a completely custom value:

```
<div class="stroke-[1.5] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `stroke-(length:<custom-property>)` syntax:

```
<div class="stroke-(length:--my-stroke-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `stroke-[length:var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `stroke-width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="stroke-1 md:stroke-2 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)