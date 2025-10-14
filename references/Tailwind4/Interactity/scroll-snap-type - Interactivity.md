---
title: scroll-snap-type - Interactivity
source: https://tailwindcss.com/docs/scroll-snap-type
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how strictly snap points are enforced in a snap container.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. scroll-snap-type

Interactivity

## scroll-snap-type

Utilities for controlling how strictly snap points are enforced in a snap container.

| Class | Styles |
| --- | --- |
| `snap-none` | `scroll-snap-type: none;` |
| `snap-x` | `scroll-snap-type: x var(--tw-scroll-snap-strictness);` |
| `snap-y` | `scroll-snap-type: y var(--tw-scroll-snap-strictness);` |
| `snap-both` | `scroll-snap-type: both var(--tw-scroll-snap-strictness);` |
| `snap-mandatory` | `--tw-scroll-snap-strictness: mandatory;` |
| `snap-proximity` | `--tw-scroll-snap-strictness: proximity;` |

Use the `snap-x` utility to enable horizontal scroll snapping within an element:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

For scroll snapping to work, you need to also set the [scroll snap alignment](https://tailwindcss.com/docs/scroll-snap-align) on the children.

Use the `snap-mandatory` utility to force a snap container to always come to rest on a snap point:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Use the `snap-proximity` utility to make a snap container come to rest on snap points that are close in proximity:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Prefix a `scroll-snap-type` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="snap-none md:snap-x ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)