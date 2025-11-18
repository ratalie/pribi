---
title: box-decoration-break - Layout
source: https://tailwindcss.com/docs/box-decoration-break
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. box-decoration-break

Layout

## box-decoration-break

Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.

| Class | Styles |
| --- | --- |
| `box-decoration-clone` | `box-decoration-break: clone;` |
| `box-decoration-slice` | `box-decoration-break: slice;` |

Use the `box-decoration-slice` and `box-decoration-clone` utilities to control whether properties like background, border, border-image, box-shadow, clip-path, margin, and padding should be rendered as if the element were one continuous fragment, or distinct blocks:

box-decoration-slice

Hello  
World

box-decoration-clone

Hello  
World

```
<span class="box-decoration-slice bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white ...">
  Hello<br />World
</span>
<span class="box-decoration-clone bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white ...">
  Hello<br />World
</span>
```

Prefix a `box-decoration-break` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="box-decoration-clone md:box-decoration-slice ...">
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