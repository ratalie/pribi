---
title: flex-direction - Flexbox & Grid
source: https://tailwindcss.com/docs/flex-direction
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the direction of flex items.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## flex-direction

Utilities for controlling the direction of flex items.

| Class | Styles |
| --- | --- |
| `flex-row` | `flex-direction: row;` |
| `flex-row-reverse` | `flex-direction: row-reverse;` |
| `flex-col` | `flex-direction: column;` |
| `flex-col-reverse` | `flex-direction: column-reverse;` |

Use `flex-row` to position flex items horizontally in the same direction as text:

01

02

03

```
<div class="flex flex-row ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use `flex-row-reverse` to position flex items horizontally in the opposite direction:

01

02

03

```
<div class="flex flex-row-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use `flex-col` to position flex items vertically:

01

02

03

```
<div class="flex flex-col ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use `flex-col-reverse` to position flex items vertically in the opposite direction:

01

02

03

```
<div class="flex flex-col-reverse ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Prefix a `flex-direction` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="flex flex-col md:flex-row ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)