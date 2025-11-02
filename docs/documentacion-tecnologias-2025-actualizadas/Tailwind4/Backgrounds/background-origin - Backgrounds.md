---
title: background-origin - Backgrounds
source: https://tailwindcss.com/docs/background-origin
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element's background is positioned relative to borders, padding, and content.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-origin

Backgrounds

## background-origin

Utilities for controlling how an element's background is positioned relative to borders, padding, and content.

| Class | Styles |
| --- | --- |
| `bg-origin-border` | `background-origin: border-box;` |
| `bg-origin-padding` | `background-origin: padding-box;` |
| `bg-origin-content` | `background-origin: content-box;` |

Use the `bg-origin-border`, `bg-origin-padding`, and `bg-origin-content` utilities to control where an element's background is rendered:

bg-origin-border

bg-origin-padding

bg-origin-content

```
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-border p-3 ..."></div>
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-padding p-3 ..."></div>
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-content p-3 ..."></div>
```

Prefix a `background-origin` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-origin-border md:bg-origin-padding ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)