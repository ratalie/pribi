---
title: place-items - Flexbox & Grid
source: https://tailwindcss.com/docs/place-items
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how items are justified and aligned at the same time.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## place-items

Utilities for controlling how items are justified and aligned at the same time.

| Class | Styles |
| --- | --- |
| `place-items-start` | `place-items: start;` |
| `place-items-end` | `place-items: end;` |
| `place-items-end-safe` | `place-items: safe end;` |
| `place-items-center` | `place-items: center;` |
| `place-items-center-safe` | `place-items: safe center;` |
| `place-items-baseline` | `place-items: baseline;` |
| `place-items-stretch` | `place-items: stretch;` |

Use `place-items-start` to place grid items on the start of their grid areas on both axes:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 place-items-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-items-end` to place grid items on the end of their grid areas on both axes:

01

02

03

04

05

06

```
<div class="grid h-56 grid-cols-3 place-items-end gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-items-center` to place grid items on the center of their grid areas on both axes:

01

02

03

04

05

06

```
<div class="grid h-56 grid-cols-3 place-items-center gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-items-stretch` to stretch items along their grid areas on both axes:

01

02

03

04

05

06

```
<div class="grid h-56 grid-cols-3 place-items-stretch gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Prefix a `place-items` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid place-items-start md:place-items-center ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)