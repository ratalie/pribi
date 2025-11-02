---
title: background-position - Backgrounds
source: https://tailwindcss.com/docs/background-position
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the position of an element's background image.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-position

Backgrounds

## background-position

Utilities for controlling the position of an element's background image.

| Class | Styles |
| --- | --- |
| `bg-top-left` | `background-position: top left;` |
| `bg-top` | `background-position: top;` |
| `bg-top-right` | `background-position: top right;` |
| `bg-left` | `background-position: left;` |
| `bg-center` | `background-position: center;` |
| `bg-right` | `background-position: right;` |
| `bg-bottom-left` | `background-position: bottom left;` |
| `bg-bottom` | `background-position: bottom;` |
| `bg-bottom-right` | `background-position: bottom right;` |
| `bg-position-(<custom-property>)` | `background-position: var(<custom-property>);` |
| `bg-position-[<value>]` | `background-position: <value>;` |

Use utilities like `bg-center`, `bg-right`, and `bg-top-left` to control the position of an element's background image:

Hover over these examples to see the full image

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

bg-top-left

Use the `bg-position-[<value>]` syntaxto set the background position based on a completely custom value:

```
<div class="bg-position-[center_top_1rem] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `bg-position-(<custom-property>)` syntax:

```
<div class="bg-position-(--my-bg-position) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `bg-position-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `background-position` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-center md:bg-top ...">
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