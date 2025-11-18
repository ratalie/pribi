---
title: grid-auto-flow - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-auto-flow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how elements in a grid are auto-placed.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## grid-auto-flow

Utilities for controlling how elements in a grid are auto-placed.

| Class | Styles |
| --- | --- |
| `grid-flow-row` | `grid-auto-flow: row;` |
| `grid-flow-col` | `grid-auto-flow: column;` |
| `grid-flow-dense` | `grid-auto-flow: dense;` |
| `grid-flow-row-dense` | `grid-auto-flow: row dense;` |
| `grid-flow-col-dense` | `grid-auto-flow: column dense;` |

Use utilities like `grid-flow-col` and `grid-flow-row-dense` to control how the auto-placement algorithm works for a grid layout:

01

02

03

04

05

```
<div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">
  <div class="col-span-2">01</div>
  <div class="col-span-2">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
</div>
```

Prefix a `grid-auto-flow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid grid-flow-col md:grid-flow-row ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)