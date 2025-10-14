---
title: grid-template-rows - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-template-rows
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for specifying the rows in a grid layout.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## grid-template-rows

Utilities for specifying the rows in a grid layout.

| Class | Styles |
| --- | --- |
| `grid-rows-<number>` | `grid-template-rows: repeat(<number>, minmax(0, 1fr));` |
| `grid-rows-none` | `grid-template-rows: none;` |
| `grid-rows-subgrid` | `grid-template-rows: subgrid;` |
| `grid-rows-[<value>]` | `grid-template-rows: <value>;` |
| `grid-rows-(<custom-property>)` | `grid-template-rows: var(<custom-property>);` |

Use `grid-rows-<number>` utilities like `grid-rows-2` and `grid-rows-4` to create grids with *n* equally sized rows:

01

02

03

04

05

06

07

08

09

```
<div class="grid grid-flow-col grid-rows-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>09</div>
</div>
```

Use the `grid-rows-subgrid` utility to adopt the row tracks defined by the item's parent:

01

02

03

04

05

06

07

08

09

10

```
<div class="grid grid-flow-col grid-rows-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>05</div>
  <div class="row-span-3 grid grid-rows-subgrid gap-4">
    <div class="row-start-2">06</div>
  </div>
  <div>07</div>
  <!-- ... -->
  <div>10</div>
</div>
```

Use the `grid-rows-[<value>]` syntaxto set the rows based on a completely custom value:

```
<div class="grid-rows-[200px_minmax(900px,1fr)_100px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `grid-rows-(<custom-property>)` syntax:

```
<div class="grid-rows-(--my-grid-rows) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `grid-rows-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `grid-template-rows` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid grid-rows-2 md:grid-rows-6 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Specifying the grid rows](https://tailwindcss.com/docs/#specifying-the-grid-rows)
	- [Implementing a subgrid](https://tailwindcss.com/docs/#implementing-a-subgrid)
	- [Using a custom value](https://tailwindcss.com/docs/#using-a-custom-value)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)