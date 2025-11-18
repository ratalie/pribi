---
title: background-repeat - Backgrounds
source: https://tailwindcss.com/docs/background-repeat
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the repetition of an element's background image.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-repeat

Backgrounds

## background-repeat

Utilities for controlling the repetition of an element's background image.

| Class | Styles |
| --- | --- |
| `bg-repeat` | `background-repeat: repeat;` |
| `bg-repeat-x` | `background-repeat: repeat-x;` |
| `bg-repeat-y` | `background-repeat: repeat-y;` |
| `bg-repeat-space` | `background-repeat: space;` |
| `bg-repeat-round` | `background-repeat: round;` |
| `bg-no-repeat` | `background-repeat: no-repeat;` |

Use the `bg-repeat` utility to repeat the background image both vertically and horizontally:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat ..."></div>
```

Use the `bg-repeat-x` utility to only repeat the background image horizontally:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-x ..."></div>
```

Use the `bg-repeat-y` utility to only repeat the background image vertically:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-y ..."></div>
```

Use the `bg-repeat-space` utility to repeat the background image without clipping:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-space ..."></div>
```

Use the `bg-repeat-round` utility to repeat the background image without clipping, stretching if needed to avoid gaps:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-round ..."></div>
```

Use the `bg-no-repeat` utility to prevent a background image from repeating:

```
<div class="bg-[url(/img/clouds.svg)] bg-center bg-no-repeat ..."></div>
```

Prefix a `background-repeat` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-repeat md:bg-repeat-x ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)