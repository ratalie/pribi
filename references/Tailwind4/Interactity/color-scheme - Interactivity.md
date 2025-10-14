---
title: color-scheme - Interactivity
source: https://tailwindcss.com/docs/color-scheme
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the color scheme of an element.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. color-scheme

Interactivity

## color-scheme

Utilities for controlling the color scheme of an element.

| Class | Styles |
| --- | --- |
| `scheme-normal` | `color-scheme: normal;` |
| `scheme-dark` | `color-scheme: dark;` |
| `scheme-light` | `color-scheme: light;` |
| `scheme-light-dark` | `color-scheme: light dark;` |
| `scheme-only-dark` | `color-scheme: only dark;` |
| `scheme-only-light` | `color-scheme: only light;` |

Use utilities like `scheme-light` and `scheme-light-dark` to control how element should be rendered:

Try switching your system color scheme to see the difference

scheme-light

scheme-dark

scheme-light-dark

```
<div class="scheme-light ...">
  <input type="date" />
</div>

<div class="scheme-dark ...">
  <input type="date" />
</div>

<div class="scheme-light-dark ...">
  <input type="date" />
</div>
```

Prefix a `color-scheme` utility with a variant like `dark:*` to only apply the utility in that state:

```
<html class="scheme-light dark:scheme-dark ...">
  <!-- ... -->
</html>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Basic example](https://tailwindcss.com/docs/#basic-example)
	- [Applying in dark mode](https://tailwindcss.com/docs/#applying-in-dark-mode)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)