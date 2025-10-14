---
title: "filter: hue-rotate() - Filters"
source: https://tailwindcss.com/docs/filter-hue-rotate
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying hue-rotate filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. hue-rotate

Filters

## filter: hue-rotate()

Utilities for applying hue-rotate filters to an element.

| Class | Styles |
| --- | --- |
| `hue-rotate-<number>` | `filter: hue-rotate(<number>deg);` |
| `-hue-rotate-<number>` | `filter: hue-rotate(calc(<number>deg * -1));` |
| `hue-rotate-(<custom-property>)` | `filter: hue-rotate(var(<custom-property>));` |
| `hue-rotate-[<value>]` | `filter: hue-rotate(<value>);` |

Use utilities like `hue-rotate-90` and `hue-rotate-180` to rotate the hue of an element by degrees:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

hue-rotate-15

Use utilities like `-hue-rotate-15` and `-hue-rotate-45` to set a negative hue rotate value:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-hue-rotate-15

Use the `hue-rotate-[<value>]` syntaxto set the hue rotation based on a completely custom value:

```
<img class="hue-rotate-[3.142rad] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `hue-rotate-(<custom-property>)` syntax:

```
<img class="hue-rotate-(--my-hue-rotate) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `hue-rotate-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `filter: hue-rotate()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="hue-rotate-60 md:hue-rotate-0 ..." src="/img/mountains.jpg" />
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