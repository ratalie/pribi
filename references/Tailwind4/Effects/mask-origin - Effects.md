---
title: mask-origin - Effects
source: https://tailwindcss.com/docs/mask-origin
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element's mask image is positioned relative to borders, padding, and content.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-origin

Effects

## mask-origin

Utilities for controlling how an element's mask image is positioned relative to borders, padding, and content.

| Class | Styles |
| --- | --- |
| `mask-origin-border` | `mask-origin: border-box;` |
| `mask-origin-padding` | `mask-origin: padding-box;` |
| `mask-origin-content` | `mask-origin: content-box;` |
| `mask-origin-fill` | `mask-origin: fill-box;` |
| `mask-origin-stroke` | `mask-origin: stroke-box;` |
| `mask-origin-view` | `mask-origin: view-box;` |

Use utilities like `mask-origin-border`, `mask-origin-padding`, and `mask-origin-content` to control where an element's mask is rendered:

mask-origin-border

mask-origin-padding

mask-origin-content

```
<div class="mask-origin-border border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-origin-padding border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-origin-content border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

Prefix a `mask-origin` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-origin-border md:mask-origin-padding ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)