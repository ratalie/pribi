---
title: background-clip - Backgrounds
source: https://tailwindcss.com/docs/background-clip
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the bounding box of an element's background.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-clip

Backgrounds

## background-clip

Utilities for controlling the bounding box of an element's background.

| Class | Styles |
| --- | --- |
| `bg-clip-border` | `background-clip: border-box;` |
| `bg-clip-padding` | `background-clip: padding-box;` |
| `bg-clip-content` | `background-clip: content-box;` |
| `bg-clip-text` | `background-clip: text;` |

Use the `bg-clip-border`, `bg-clip-padding`, and `bg-clip-content` utilities to control the bounding box of an element's background:

bg-clip-border

bg-clip-padding

bg-clip-content

```
<div class="border-4 bg-indigo-500 bg-clip-border p-3"></div>
<div class="border-4 bg-indigo-500 bg-clip-padding p-3"></div>
<div class="border-4 bg-indigo-500 bg-clip-content p-3"></div>
```

Use the `bg-clip-text` utility to crop an element's background to match the shape of the text:

Hello world

```
<p class="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent ...">
  Hello world
</p>
```

Prefix a `background-clip` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-clip-border md:bg-clip-padding ...">
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