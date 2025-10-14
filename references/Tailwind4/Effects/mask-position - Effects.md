---
title: mask-position - Effects
source: https://tailwindcss.com/docs/mask-position
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the position of an element's mask image.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-position

Effects

## mask-position

Utilities for controlling the position of an element's mask image.

| Class | Styles |
| --- | --- |
| `mask-top-left` | `mask-position: top left;` |
| `mask-top` | `mask-position: top;` |
| `mask-top-right` | `mask-position: top right;` |
| `mask-left` | `mask-position: left;` |
| `mask-center` | `mask-position: center;` |
| `mask-right` | `mask-position: right;` |
| `mask-bottom-left` | `mask-position: bottom left;` |
| `mask-bottom` | `mask-position: bottom;` |
| `mask-bottom-right` | `mask-position: bottom right;` |
| `mask-position-(<custom-property>)` | `mask-position: var(<custom-property>);` |
| `mask-position-[<value>]` | `mask-position: <value>;` |

Use utilities like `mask-center`, `mask-right`, and `mask-left-top` to control the position of an element's mask image:

mask-top-left

mask-top

mask-top-right

mask-left

mask-center

mask-right

mask-bottom-left

mask-bottom

mask-bottom-right

```
<div class="mask-top-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-top mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-top-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-center mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-position-[<value>]` syntaxto set the mask position based on a completely custom value:

```
<div class="mask-position-[center_top_1rem] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `mask-position-(<custom-property>)` syntax:

```
<div class="mask-position-(--my-mask-position) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `mask-position-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `mask-position` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-center md:mask-top ...">
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