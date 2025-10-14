---
title: grid-column - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-column
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how elements are sized and placed across grid columns.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## grid-column

Utilities for controlling how elements are sized and placed across grid columns.

| Class | Styles |
| --- | --- |
| `col-span-<number>` | `grid-column: span <number> / span <number>;` |
| `col-span-full` | `grid-column: 1 / -1;` |
| `col-span-(<custom-property>)` | `grid-column: span var(<custom-property>) / span var(<custom-property>);` |
| `col-span-[<value>]` | `grid-column: span <value> / span <value>;` |
| `col-start-<number>` | `grid-column-start: <number>;` |
| `-col-start-<number>` | `grid-column-start: calc(<number> * -1);` |
| `col-start-auto` | `grid-column-start: auto;` |
| `col-start-(<custom-property>)` | `grid-column-start: var(<custom-property>);` |
| `col-start-[<value>]` | `grid-column-start: <value>;` |
| `col-end-<number>` | `grid-column-end: <number>;` |

Use `col-span-<number>` utilities like `col-span-2` and `col-span-4` to make an element span *n* columns:

01

02

03

04

05

06

07

```
<div class="grid grid-cols-3 gap-4">
  <div class="...">01</div>
  <div class="...">02</div>
  <div class="...">03</div>
  <div class="col-span-2 ...">04</div>
  <div class="...">05</div>
  <div class="...">06</div>
  <div class="col-span-2 ...">07</div>
</div>
```

Use `col-start-<number>` or `col-end-<number>` utilities like `col-start-2` and `col-end-3` to make an element start or end at the *nth* grid line:

01

02

03

04

```
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-4 col-start-2 ...">01</div>
  <div class="col-start-1 col-end-3 ...">02</div>
  <div class="col-span-2 col-end-7 ...">03</div>
  <div class="col-start-1 col-end-7 ...">04</div>
</div>
```

These can also be combined with the `col-span-<number>` utilities to span a specific number of columns.

Use utilities like `col-[<value>]`,`col-span-[<value>]`,`col-start-[<value>]`, and `col-end-[<value>]` to set the grid column size and location based on a completely custom value:

```
<div class="col-[16_/_span_16] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `col-(<custom-property>)` syntax:

```
<div class="col-(--my-columns) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `col-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix `grid-column`,`grid-column-start`, and `grid-column-end` utilitieswith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="col-span-2 md:col-span-6 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Spanning columns](https://tailwindcss.com/docs/#spanning-columns)
	- [Starting and ending lines](https://tailwindcss.com/docs/#starting-and-ending-lines)
	- [Using a custom value](https://tailwindcss.com/docs/#using-a-custom-value)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)