---
title: object-position - Layout
source: https://tailwindcss.com/docs/object-position
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how a replaced element's content should be positioned within its container.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. object-position

Layout

## object-position

Utilities for controlling how a replaced element's content should be positioned within its container.

| Class | Styles |
| --- | --- |
| `object-top-left` | `object-position: top left;` |
| `object-top` | `object-position: top;` |
| `object-top-right` | `object-position: top right;` |
| `object-left` | `object-position: left;` |
| `object-center` | `object-position: center;` |
| `object-right` | `object-position: right;` |
| `object-bottom-left` | `object-position: bottom left;` |
| `object-bottom` | `object-position: bottom;` |
| `object-bottom-right` | `object-position: bottom right;` |
| `object-(<custom-property>)` | `object-position: var(<custom-property>);` |
| `object-[<value>]` | `object-position: <value>;` |

Use utilities like `object-left` and `object-bottom-right` to specify how a replaced element's content should be positioned within its container:

Hover over examples to see the full image

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

object-top-left

Use the `object-[<value>]` syntaxto set the object position based on a completely custom value:

```
<img class="object-[25%_75%] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `object-(<custom-property>)` syntax:

```
<img class="object-(--my-object) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `object-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `object-position` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="object-center md:object-top ..." src="/img/mountains.jpg" />
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