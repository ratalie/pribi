---
title: backface-visibility - Transforms
source: https://tailwindcss.com/docs/backface-visibility
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling if an element's backface is visible.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. backface-visibility

Transforms

## backface-visibility

Utilities for controlling if an element's backface is visible.

| Class | Styles |
| --- | --- |
| `backface-hidden` | `backface-visibility: hidden;` |
| `backface-visible` | `backface-visibility: visible;` |

Use the `backface-visible` utility to show the backface of an element, like a cube, even when it's rotated away from view:

backface-hidden

1

2

3

4

5

6

backface-visible

1

2

3

4

5

6

```
<div class="size-20 ...">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-hidden ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 backface-hidden ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 backface-hidden ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 backface-hidden ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 backface-hidden ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 backface-hidden ...">6</div>
</div>

<div class="size-20 ...">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-visible ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 backface-visible ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 backface-visible ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 backface-visible ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 backface-visible ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 backface-visible ...">6</div>
</div>
```

Prefix a `backface-visibility` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backface-visible md:backface-hidden ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)