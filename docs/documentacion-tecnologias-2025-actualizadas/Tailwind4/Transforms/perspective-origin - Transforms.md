---
title: perspective-origin - Transforms
source: https://tailwindcss.com/docs/perspective-origin
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's perspective origin when placed in 3D space.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. perspective-origin

Transforms

## perspective-origin

Utilities for controlling an element's perspective origin when placed in 3D space.

| Class | Styles |
| --- | --- |
| `perspective-origin-center` | `perspective-origin: center;` |
| `perspective-origin-top` | `perspective-origin: top;` |
| `perspective-origin-top-right` | `perspective-origin: top right;` |
| `perspective-origin-right` | `perspective-origin: right;` |
| `perspective-origin-bottom-right` | `perspective-origin: bottom right;` |
| `perspective-origin-bottom` | `perspective-origin: bottom;` |
| `perspective-origin-bottom-left` | `perspective-origin: bottom left;` |
| `perspective-origin-left` | `perspective-origin: left;` |
| `perspective-origin-top-left` | `perspective-origin: top left;` |
| `perspective-origin-(<custom-property>)` | `perspective-origin: var(<custom-property>);` |
| `perspective-origin-[<value>]` | `perspective-origin: <value>;` |

Use utilities like `perspective-origin-top` and `perspective-origin-bottom-left` to control where the vanishing point of a perspective is located:

perspective-origin-top-left

1

2

3

4

5

6

perspective-origin-bottom-right

1

2

3

4

5

6

```
<div class="size-20 perspective-near perspective-origin-top-left ...">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>

<div class="size-20 perspective-near perspective-origin-bottom-right …">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
```

Use the `perspective-origin-[<value>]` syntaxto set the perspective origin based on a completely custom value:

```
<div class="perspective-origin-[200%_150%] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `perspective-origin-(<custom-property>)` syntax:

```
<div class="perspective-origin-(--my-perspective-origin) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `perspective-origin-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `perspective-origin` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="perspective-origin-center md:perspective-origin-bottom-left ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)