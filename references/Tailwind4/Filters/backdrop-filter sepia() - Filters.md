---
title: "backdrop-filter: sepia() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-sepia
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop sepia filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. sepia

Filters

## backdrop-filter: sepia()

Utilities for applying backdrop sepia filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-sepia` | `backdrop-filter: sepia(100%);` |
| `backdrop-sepia-<number>` | `backdrop-filter: sepia(<number>%);` |
| `backdrop-sepia-(<custom-property>)` | `backdrop-filter: sepia(var(<custom-property>));` |
| `backdrop-sepia-[<value>]` | `backdrop-filter: sepia(<value>);` |

Use utilities like `backdrop-sepia` and `backdrop-sepia-50` to control the sepia effect applied to an element's backdrop:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-sepia-0

Use the `backdrop-sepia-[<value>]` syntaxto set the backdrop sepia based on a completely custom value:

```
<div class="backdrop-sepia-[.25] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-sepia-(<custom-property>)` syntax:

```
<div class="backdrop-sepia-(--my-backdrop-sepia) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-sepia-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: sepia()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-sepia md:backdrop-sepia-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)