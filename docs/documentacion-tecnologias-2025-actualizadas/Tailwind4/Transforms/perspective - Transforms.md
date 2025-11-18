---
title: perspective - Transforms
source: https://tailwindcss.com/docs/perspective
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's perspective when placed in 3D space.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. perspective

Transforms

## perspective

Utilities for controlling an element's perspective when placed in 3D space.

| Class | Styles |
| --- | --- |
| `perspective-dramatic` | `perspective: var(--perspective-dramatic); /* 100px */` |
| `perspective-near` | `perspective: var(--perspective-near); /* 300px */` |
| `perspective-normal` | `perspective: var(--perspective-normal); /* 500px */` |
| `perspective-midrange` | `perspective: var(--perspective-midrange); /* 800px */` |
| `perspective-distant` | `perspective: var(--perspective-distant); /* 1200px */` |
| `perspective-none` | `perspective: none;` |
| `perspective-(<custom-property>)` | `perspective: var(<custom-property>);` |
| `perspective-[<value>]` | `perspective: <value>;` |

Use utilities like `perspective-normal` and `perspective-distant` to control how close or how far away the z-plane is from the screen:

perspective-dramatic

1

2

3

4

5

6

perspective-normal

1

2

3

4

5

6

```
<div class="size-20 perspective-dramatic ...">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>

<div class="size-20 perspective-normal ...">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
  <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
  <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
  <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
  <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
  <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
```

This is like moving a camera closer to or further away from an object.

Use the `perspective-none` utility to remove a perspective transform from an element:

```
<div class="perspective-none ...">
  <!-- ... -->
</div>
```

Use the `perspective-[<value>]` syntaxto set the perspective based on a completely custom value:

```
<div class="perspective-[750px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `perspective-(<custom-property>)` syntax:

```
<div class="perspective-(--my-perspective) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `perspective-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `perspective` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="perspective-midrange md:perspective-dramatic ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--perspective-*` theme variables to customize the perspectiveutilities in your project:

```
@theme {
  --perspective-remote: 1800px; 
}
```

Now the `perspective-remote` utility can be used in your markup:

```
<div class="perspective-remote">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)