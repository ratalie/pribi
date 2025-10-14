---
title: transform - Transforms
source: https://tailwindcss.com/docs/transform
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for transforming elements.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. transform

Transforms

## transform

Utilities for transforming elements.

| Class | Styles |
| --- | --- |
| `transform-(<custom-property>)` | `transform: var(<custom-property>);` |
| `transform-[<value>]` | `transform: <value>;` |
| `transform-none` | `transform: none;` |
| `transform-gpu` | `transform: translateZ(0) var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);` |
| `transform-cpu` | `transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);` |

If your transition performs better when rendered by the GPU instead of the CPU, you can force hardware acceleration by adding the `transform-gpu` utility:

```
<div class="scale-150 transform-gpu">
  <!-- ... -->
</div>
```

Use the `transform-cpu` utility to force things back to the CPU if you need to undo this conditionally.

Use the `transform-none` utility to remove all of the transforms on an element at once:

```
<div class="skew-y-3 md:transform-none">
  <!-- ... -->
</div>
```

Use the `transform-[<value>]` syntaxto set the transform based on a completely custom value:

```
<div class="transform-[matrix(1,2,3,4,5,6)] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `transform-(<custom-property>)` syntax:

```
<div class="transform-(--my-transform) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `transform-[var(<custom-property>)]` that adds the `var()` function for you automatically.

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)