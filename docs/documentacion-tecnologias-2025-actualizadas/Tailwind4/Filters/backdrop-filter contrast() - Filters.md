---
title: "backdrop-filter: contrast() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-contrast
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop contrast filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. contrast

Filters

## backdrop-filter: contrast()

Utilities for applying backdrop contrast filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-contrast-<number>` | `backdrop-filter: contrast(<number>%);` |
| `backdrop-contrast-(<custom-property>)` | `backdrop-filter: contrast(var(<custom-property>));` |
| `backdrop-contrast-[<value>]` | `backdrop-filter: contrast(<value>);` |

Use utilities like `backdrop-contrast-50` and `backdrop-contrast-100` to control an element's backdrop contrast:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-contrast-50

Use the `backdrop-contrast-[<value>]` syntaxto set the backdrop contrast based on a completely custom value:

```
<div class="backdrop-contrast-[.25] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-contrast-(<custom-property>)` syntax:

```
<div class="backdrop-contrast-(--my-backdrop-contrast) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-contrast-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: contrast()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-contrast-125 md:backdrop-contrast-150 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)