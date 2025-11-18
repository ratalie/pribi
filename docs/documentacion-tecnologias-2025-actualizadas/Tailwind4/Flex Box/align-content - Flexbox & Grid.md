---
title: align-content - Flexbox & Grid
source: https://tailwindcss.com/docs/align-content
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how rows are positioned in multi-row flex and grid containers.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## align-content

Utilities for controlling how rows are positioned in multi-row flex and grid containers.

| Class | Styles |
| --- | --- |
| `content-normal` | `align-content: normal;` |
| `content-center` | `align-content: center;` |
| `content-start` | `align-content: flex-start;` |
| `content-end` | `align-content: flex-end;` |
| `content-between` | `align-content: space-between;` |
| `content-around` | `align-content: space-around;` |
| `content-evenly` | `align-content: space-evenly;` |
| `content-baseline` | `align-content: baseline;` |
| `content-stretch` | `align-content: stretch;` |

Use `content-start` to pack rows in a container against the start of the cross axis:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-start gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-center` to pack rows in a container in the center of the cross axis:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-center gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-end` to pack rows in a container against the end of the cross axis:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-end gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-between` to distribute rows in a container such that there is an equal amount of space between each line:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-between gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-around` to distribute rows in a container such that there is an equal amount of space around each line:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-around gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-evenly` to distribute rows in a container such that there is an equal amount of space around each item, but also accounting for the doubling of space you would normally see between each item when using `content-around`:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-evenly gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-stretch` to allow content items to fill the available space along the container’s cross axis:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-stretch gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Use `content-normal` to pack content items in their default position as if no `align-content` value was set:

01

02

03

04

05

```
<div class="grid h-56 grid-cols-3 content-normal gap-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Prefix an `align-content` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid content-start md:content-around ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)