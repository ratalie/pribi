---
title: flex-wrap - Flexbox & Grid
source: https://tailwindcss.com/docs/flex-wrap
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how flex items wrap.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## flex-wrap

Utilities for controlling how flex items wrap.

| Class | Styles |
| --- | --- |
| `flex-nowrap` | `flex-wrap: nowrap;` |
| `flex-wrap` | `flex-wrap: wrap;` |
| `flex-wrap-reverse` | `flex-wrap: wrap-reverse;` |

Use `flex-nowrap` to prevent flex items from wrapping, causing inflexible items to overflow the container if necessary:

01

02

03

```
<div class="flex flex-nowrap">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use `flex-wrap` to allow flex items to wrap:

01

02

03

```
<div class="flex flex-wrap">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use `flex-wrap-reverse` to wrap flex items in the reverse direction:

01

02

03

```
<div class="flex flex-wrap-reverse">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Prefix a `flex-wrap` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="flex flex-wrap md:flex-wrap-reverse ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)