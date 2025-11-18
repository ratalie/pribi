---
title: "backdrop-filter: hue-rotate() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-hue-rotate
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop hue-rotate filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. hue-rotate

Filters

## backdrop-filter: hue-rotate()

Utilities for applying backdrop hue-rotate filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-hue-rotate-<number>` | `backdrop-filter: hue-rotate(<number>deg);` |
| `-backdrop-hue-rotate-<number>` | `backdrop-filter: hue-rotate(calc(<number>deg * -1));` |
| `backdrop-hue-rotate-(<custom-property>)` | `backdrop-filter: hue-rotate(var(<custom-property>));` |
| `backdrop-hue-rotate-[<value>]` | `backdrop-filter: hue-rotate(<value>);` |

Use utilities like `backdrop-hue-rotate-90` and `backdrop-hue-rotate-180` to rotate the hue of an element's backdrop:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-hue-rotate-90

Use utilities like `-backdrop-hue-rotate-90` and `-backdrop-hue-rotate-180` to set a negative backdrop hue rotation value:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-backdrop-hue-rotate-15

Use the `backdrop-hue-rotate-[<value>]` syntaxto set the backdrop hue rotation based on a completely custom value:

```
<div class="backdrop-hue-rotate-[3.142rad] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-hue-rotate-(<custom-property>)` syntax:

```
<div class="backdrop-hue-rotate-(--my-backdrop-hue-rotation) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-hue-rotate-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: hue-rotate()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-hue-rotate-15 md:backdrop-hue-rotate-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)