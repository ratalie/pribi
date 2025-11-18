---
title: break-before - Layout
source: https://tailwindcss.com/docs/break-before
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how a column or page should break before an element.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. break-before

Layout

## break-before

Utilities for controlling how a column or page should break before an element.

| Class | Styles |
| --- | --- |
| `break-before-auto` | `break-before: auto;` |
| `break-before-avoid` | `break-before: avoid;` |
| `break-before-all` | `break-before: all;` |
| `break-before-avoid-page` | `break-before: avoid-page;` |
| `break-before-page` | `break-before: page;` |
| `break-before-left` | `break-before: left;` |
| `break-before-right` | `break-before: right;` |
| `break-before-column` | `break-before: column;` |

Use utilities like `break-before-column` and `break-before-page` to control how a column or page break should behave before an element:

```
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

Prefix a `break-before` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="break-before-column md:break-before-auto ...">
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