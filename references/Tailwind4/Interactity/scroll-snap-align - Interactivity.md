---
title: scroll-snap-align - Interactivity
source: https://tailwindcss.com/docs/scroll-snap-align
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the scroll snap alignment of an element.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. scroll-snap-align

Interactivity

## scroll-snap-align

Utilities for controlling the scroll snap alignment of an element.

| Class | Styles |
| --- | --- |
| `snap-start` | `scroll-snap-align: start;` |
| `snap-end` | `scroll-snap-align: end;` |
| `snap-center` | `scroll-snap-align: center;` |
| `snap-align-none` | `scroll-snap-align: none;` |

Use the `snap-center` utility to snap an element to its center when being scrolled inside a snap container:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Use the `snap-start` utility to snap an element to its start when being scrolled inside a snap container:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Use the `snap-end` utility to snap an element to its end when being scrolled inside a snap container:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Prefix a `scroll-snap-align` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="snap-center md:snap-start ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Snapping to the center](https://tailwindcss.com/docs/#snapping-to-the-center)
	- [Snapping to the start](https://tailwindcss.com/docs/#snapping-to-the-start)
	- [Snapping to the end](https://tailwindcss.com/docs/#snapping-to-the-end)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)