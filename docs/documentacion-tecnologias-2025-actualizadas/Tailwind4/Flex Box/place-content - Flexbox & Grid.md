---
title: place-content - Flexbox & Grid
source: https://tailwindcss.com/docs/place-content
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how content is justified and aligned at the same time.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## place-content

Utilities for controlling how content is justified and aligned at the same time.

| Class | Styles |
| --- | --- |
| `place-content-center` | `place-content: center;` |
| `place-content-center-safe` | `place-content: safe center;` |
| `place-content-start` | `place-content: start;` |
| `place-content-end` | `place-content: end;` |
| `place-content-end-safe` | `place-content: safe end;` |
| `place-content-between` | `place-content: space-between;` |
| `place-content-around` | `place-content: space-around;` |
| `place-content-evenly` | `place-content: space-evenly;` |
| `place-content-baseline` | `place-content: baseline;` |
| `place-content-stretch` | `place-content: stretch;` |

Use `place-content-center` to pack items in the center of the inline and block axes:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-center gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-start` to pack items against the start of the inline and block axes:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-end` to pack items against the end of the inline and block axes:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-end gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-between` to distribute grid items along the inline and block axes so that there is an equal amount of space between each row and column on each axis respectively:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-between gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-around` to distribute grid items along the inline and block axes so that there is an equal amount of space around each row and column on each axis respectively:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-around gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-evenly` to distribute grid items such that they are evenly spaced on the inline and block axes:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-evenly gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Use `place-content-stretch` to stretch grid items along their grid areas on the inline and block axes:

01

02

03

04

```
<div class="grid h-48 grid-cols-2 place-content-stretch gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

Prefix a `place-content` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid place-content-start md:place-content-center ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)