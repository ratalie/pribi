---
title: backdrop-filter - Filters
source: https://tailwindcss.com/docs/backdrop-filter
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. backdrop-filter

Filters

## backdrop-filter

Utilities for applying backdrop filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-filter-none` | `backdrop-filter: none;` |
| `backdrop-filter-(<custom-property>)` | `backdrop-filter: var(<custom-property>);` |
| `backdrop-filter-[<value>]` | `backdrop-filter: <value>;` |

Use utilities like `backdrop-blur-xs` and `backdrop-grayscale` to apply filters to an element's backdrop:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-blur-xs

You can combine the following backdrop filter utilities: [blur](https://tailwindcss.com/docs/backdrop-filter-blur), [brightness](https://tailwindcss.com/docs/backdrop-filter-brightness), [contrast](https://tailwindcss.com/docs/backdrop-filter-contrast), [grayscale](https://tailwindcss.com/docs/backdrop-filter-grayscale), [hue-rotate](https://tailwindcss.com/docs/backdrop-filter-hue-rotate), [invert](https://tailwindcss.com/docs/backdrop-filter-invert), [opacity](https://tailwindcss.com/docs/backdrop-filter-opacity), [saturate](https://tailwindcss.com/docs/backdrop-filter-saturate), and [sepia](https://tailwindcss.com/docs/backdrop-filter-sepia).

Use the `backdrop-filter-none` utility to remove all of the backdrop filters applied to an element:

```
<div class="backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none"></div>
```

Use the `backdrop-filter-[<value>]` syntaxto set the backdrop filter based on a completely custom value:

```
<div class="backdrop-filter-[url('filters.svg#filter-id')] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-filter-(<custom-property>)` syntax:

```
<div class="backdrop-filter-(--my-backdrop-filter) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-filter-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter` utility with a variant like `hover:*` to only apply the utility in that state:

```
<div class="backdrop-blur-sm hover:backdrop-filter-none ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Prefix a `backdrop-filter` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-blur-sm md:backdrop-filter-none ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)