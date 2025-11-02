---
title: grid-auto-rows - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-auto-rows
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the size of implicitly-created grid rows.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## grid-auto-rows

Utilities for controlling the size of implicitly-created grid rows.

| Class | Styles |
| --- | --- |
| `auto-rows-auto` | `grid-auto-rows: auto;` |
| `auto-rows-min` | `grid-auto-rows: min-content;` |
| `auto-rows-max` | `grid-auto-rows: max-content;` |
| `auto-rows-fr` | `grid-auto-rows: minmax(0, 1fr);` |
| `auto-rows-(<custom-property>)` | `grid-auto-rows: var(<custom-property>);` |
| `auto-rows-[<value>]` | `grid-auto-rows: <value>;` |

Use utilities like `auto-rows-min` and `auto-rows-max` to control the size of implicitly-created grid rows:

```
<div class="grid grid-flow-row auto-rows-max">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use the `auto-rows-[<value>]` syntaxto set the size of implicitly-created grid rows based on a completely custom value:

```
<div class="auto-rows-[minmax(0,2fr)] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `auto-rows-(<custom-property>)` syntax:

```
<div class="auto-rows-(--my-auto-rows) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `auto-rows-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `grid-auto-rows` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid grid-flow-row auto-rows-max md:auto-rows-min ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)