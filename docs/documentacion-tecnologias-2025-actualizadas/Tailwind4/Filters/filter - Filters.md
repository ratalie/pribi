---
title: filter - Filters
source: https://tailwindcss.com/docs/filter
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. filter

Filters

## filter

Utilities for applying filters to an element.

| Class | Styles |
| --- | --- |
| `filter-none` | `filter: none;` |
| `filter-(<custom-property>)` | `filter: var(<custom-property>);` |
| `filter-[<value>]` | `filter: <value>;` |

Use utilities like `blur-xs` and `grayscale` to apply filters to an element:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

You can combine the following filter utilities: [blur](https://tailwindcss.com/docs/filter-blur), [brightness](https://tailwindcss.com/docs/filter-brightness), [contrast](https://tailwindcss.com/docs/filter-contrast), [drop-shadow](https://tailwindcss.com/docs/filter-drop-shadow), [grayscale](https://tailwindcss.com/docs/filter-grayscale), [hue-rotate](https://tailwindcss.com/docs/filter-hue-rotate), [invert](https://tailwindcss.com/docs/filter-invert), [saturate](https://tailwindcss.com/docs/filter-saturate), and [sepia](https://tailwindcss.com/docs/filter-sepia).

Use the `filter-none` utility to remove all of the filters applied to an element:

```
<img class="blur-md brightness-150 invert md:filter-none" src="/img/mountains.jpg" />
```

Use the `filter-[<value>]` syntaxto set the filter based on a completely custom value:

```
<img class="filter-[url('filters.svg#filter-id')] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `filter-(<custom-property>)` syntax:

```
<img class="filter-(--my-filter) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `filter-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `filter` utility with a variant like `hover:*` to only apply the utility in that state:

```
<img class="blur-sm hover:filter-none ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Prefix a `filter` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="blur-sm md:filter-none ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)