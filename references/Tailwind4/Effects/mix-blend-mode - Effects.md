---
title: mix-blend-mode - Effects
source: https://tailwindcss.com/docs/mix-blend-mode
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element should blend with the background.
tags:
  - clippings
updated: 2025-10-14T00:21
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mix-blend-mode

Effects

## mix-blend-mode

Utilities for controlling how an element should blend with the background.

| Class | Styles |
| --- | --- |
| `mix-blend-normal` | `mix-blend-mode: normal;` |
| `mix-blend-multiply` | `mix-blend-mode: multiply;` |
| `mix-blend-screen` | `mix-blend-mode: screen;` |
| `mix-blend-overlay` | `mix-blend-mode: overlay;` |
| `mix-blend-darken` | `mix-blend-mode: darken;` |
| `mix-blend-lighten` | `mix-blend-mode: lighten;` |
| `mix-blend-color-dodge` | `mix-blend-mode: color-dodge;` |
| `mix-blend-color-burn` | `mix-blend-mode: color-burn;` |
| `mix-blend-hard-light` | `mix-blend-mode: hard-light;` |
| `mix-blend-soft-light` | `mix-blend-mode: soft-light;` |

Use utilities like `mix-blend-overlay` and `mix-blend-soft-light` to control how an element's content and background is blended with other content in the same stacking context:

```
<div class="flex justify-center -space-x-14">
  <div class="bg-blue-500 mix-blend-multiply ..."></div>
  <div class="bg-pink-500 mix-blend-multiply ..."></div>
</div>
```

Use the `isolate` utility on the parent element to create a new stacking context and prevent blending with content behind it:

```
<div class="isolate flex justify-center -space-x-14">
  <div class="bg-yellow-500 mix-blend-multiply ..."></div>
  <div class="bg-green-500 mix-blend-multiply ..."></div>
</div>

<div class="flex justify-center -space-x-14">
  <div class="bg-yellow-500 mix-blend-multiply ..."></div>
  <div class="bg-green-500 mix-blend-multiply ..."></div>
</div>
```

Prefix a `mix-blend-mode` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mix-blend-multiply md:mix-blend-overlay ...">
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