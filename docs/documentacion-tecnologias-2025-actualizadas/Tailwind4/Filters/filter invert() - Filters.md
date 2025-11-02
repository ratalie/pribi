---
title: "filter: invert() - Filters"
source: https://tailwindcss.com/docs/filter-invert
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying invert filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. invert

Filters

## filter: invert()

Utilities for applying invert filters to an element.

| Class | Styles |
| --- | --- |
| `invert` | `filter: invert(100%);` |
| `invert-<number>` | `filter: invert(<number>%);` |
| `invert-(<custom-property>)` | `filter: invert(var(<custom-property>));` |
| `invert-[<value>]` | `filter: invert(<value>);` |

Use utilities like `invert` and `invert-20` to control the color inversion of an element:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use the `invert-[<value>]` syntaxto set the color inversion based on a completely custom value:

```
<img class="invert-[.25] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `invert-(<custom-property>)` syntax:

```
<img class="invert-(--my-inversion) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `invert-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `filter: invert()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="invert md:invert-0 ..." src="/img/mountains.jpg" />
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