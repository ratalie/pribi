---
title: "backdrop-filter: opacity() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-opacity
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop opacity filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. opacity

Filters

## backdrop-filter: opacity()

Utilities for applying backdrop opacity filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-opacity-<number>` | `backdrop-filter: opacity(<number>%);` |
| `backdrop-opacity-(<custom-property>)` | `backdrop-filter: opacity(var(<custom-property>));` |
| `backdrop-opacity-[<value>]` | `backdrop-filter: opacity(<value>);` |

Use utilities like `backdrop-opacity-50` and `backdrop-opacity-75` to control the opacity of all the backdrop filters applied to an element:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-opacity-10

Use the `backdrop-opacity-[<value>]` syntaxto set the backdrop filter opacity based on a completely custom value:

```
<div class="backdrop-opacity-[.15] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-opacity-(<custom-property>)` syntax:

```
<div class="backdrop-opacity-(--my-backdrop-filter-opacity) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-opacity-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: opacity()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-opacity-100 md:backdrop-opacity-60 ...">
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