---
title: mask-repeat - Effects
source: https://tailwindcss.com/docs/mask-repeat
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the repetition of an element's mask image.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-repeat

Effects

## mask-repeat

Utilities for controlling the repetition of an element's mask image.

| Class | Styles |
| --- | --- |
| `mask-repeat` | `mask-repeat: repeat;` |
| `mask-no-repeat` | `mask-repeat: no-repeat;` |
| `mask-repeat-x` | `mask-repeat: repeat-x;` |
| `mask-repeat-y` | `mask-repeat: repeat-y;` |
| `mask-repeat-space` | `mask-repeat: space;` |
| `mask-repeat-round` | `mask-repeat: round;` |

Use the `mask-repeat` utility to repeat the mask image both vertically and horizontally:

```
<div class="mask-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-repeat-x` utility to only repeat the mask image horizontally:

```
<div class="mask-repeat-x mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)]..."></div>
```

Use the `mask-repeat-y` utility to only repeat the mask image vertically:

```
<div class="mask-repeat-y mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)]..."></div>
```

Use the `mask-repeat-space` utility to repeat the mask image without clipping:

```
<div class="mask-repeat-space mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-repeat-round` utility to repeat the mask image without clipping, stretching if needed to avoid gaps:

```
<div class="mask-repeat-round mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-no-repeat` utility to prevent a mask image from repeating:

```
<div class="mask-no-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
```

Prefix a `mask-repeat` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-repeat md:mask-repeat-x ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)