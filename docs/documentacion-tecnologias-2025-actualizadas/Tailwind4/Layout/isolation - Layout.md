---
title: isolation - Layout
source: https://tailwindcss.com/docs/isolation
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling whether an element should explicitly create a new stacking context.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. isolation

Layout

## isolation

Utilities for controlling whether an element should explicitly create a new stacking context.

| Class | Styles |
| --- | --- |
| `isolate` | `isolation: isolate;` |
| `isolation-auto` | `isolation: auto;` |

Use the `isolate` and `isolation-auto` utilities to control whether an element should explicitly create a new stacking context:

```
<div class="isolate ...">
  <!-- ... -->
</div>
```

Prefix an `isolation` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="isolate md:isolation-auto ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)