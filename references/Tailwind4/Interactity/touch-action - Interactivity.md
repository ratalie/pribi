---
title: touch-action - Interactivity
source: https://tailwindcss.com/docs/touch-action
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element can be scrolled and zoomed on touchscreens.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. touch-action

Interactivity

## touch-action

Utilities for controlling how an element can be scrolled and zoomed on touchscreens.

| Class | Styles |
| --- | --- |
| `touch-auto` | `touch-action: auto;` |
| `touch-none` | `touch-action: none;` |
| `touch-pan-x` | `touch-action: pan-x;` |
| `touch-pan-left` | `touch-action: pan-left;` |
| `touch-pan-right` | `touch-action: pan-right;` |
| `touch-pan-y` | `touch-action: pan-y;` |
| `touch-pan-up` | `touch-action: pan-up;` |
| `touch-pan-down` | `touch-action: pan-down;` |
| `touch-pinch-zoom` | `touch-action: pinch-zoom;` |
| `touch-manipulation` | `touch-action: manipulation;` |

Use utilities like `touch-pan-y` and `touch-pinch-zoom` to control how an element can be scrolled (panned) and zoomed (pinched) on touchscreens:

Try panning these images on a touchscreen

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80)

touch-auto

Prefix a `touch-action` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="touch-pan-x md:touch-auto ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)