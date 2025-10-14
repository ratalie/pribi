---
title: "filter: sepia() - Filters"
source: https://tailwindcss.com/docs/filter-sepia
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying sepia filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. sepia

Filters

## filter: sepia()

Utilities for applying sepia filters to an element.

| Class | Styles |
| --- | --- |
| `sepia` | `filter: sepia(100%);` |
| `sepia-<number>` | `filter: sepia(<number>%);` |
| `sepia-(<custom-property>)` | `filter: sepia(var(<custom-property>));` |
| `sepia-[<value>]` | `filter: sepia(<value>);` |

Use utilities like `sepia` and `sepia-50` to control the sepia effect applied to an element:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use the `sepia-[<value>]` syntaxto set the sepia amount based on a completely custom value:

```
<img class="sepia-[.25] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `sepia-(<custom-property>)` syntax:

```
<img class="sepia-(--my-sepia) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `sepia-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `filter: sepia()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="sepia md:sepia-0 ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)