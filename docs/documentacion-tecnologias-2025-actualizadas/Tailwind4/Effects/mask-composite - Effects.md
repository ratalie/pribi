---
title: mask-composite - Effects
source: https://tailwindcss.com/docs/mask-composite
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how multiple masks are combined together.
tags:
  - clippings
updated: 2025-10-14T00:21
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-composite

Effects

## mask-composite

Utilities for controlling how multiple masks are combined together.

| Class | Styles |
| --- | --- |
| `mask-add` | `mask-composite: add;` |
| `mask-subtract` | `mask-composite: subtract;` |
| `mask-intersect` | `mask-composite: intersect;` |
| `mask-exclude` | `mask-composite: exclude;` |

Use utilities like `mask-add` and `mask-intersect` to control how an element's masks are combined together:

mask-add

mask-subtract

mask-intersect

mask-exclude

```
<div class="mask-add mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-subtract mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-intersect mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-exclude mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
```

Prefix a `mask-composite` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-add md:mask-subtract ...">
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