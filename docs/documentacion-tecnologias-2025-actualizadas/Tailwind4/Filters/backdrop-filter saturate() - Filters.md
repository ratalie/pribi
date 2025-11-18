---
title: "backdrop-filter: saturate() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-saturate
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop saturation filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. saturate

Filters

## backdrop-filter: saturate()

Utilities for applying backdrop saturation filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-saturate-<number>` | `backdrop-filter: saturate(<number>%);` |
| `backdrop-saturate-(<custom-property>)` | `backdrop-filter: saturate(var(<custom-property>));` |
| `backdrop-saturate-[<value>]` | `backdrop-filter: saturate(<value>);` |

Use utilities like `backdrop-saturate-50` and `backdrop-saturate-100` utilities to control the saturation of an element's backdrop:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-saturate-50

Use the `backdrop-saturate-[<value>]` syntaxto set the backdrop saturation based on a completely custom value:

```
<div class="backdrop-saturate-[.25] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-saturate-(<custom-property>)` syntax:

```
<div class="backdrop-saturate-(--my-backdrop-saturation) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-saturate-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: saturate()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-saturate-50 md:backdrop-saturate-150 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)