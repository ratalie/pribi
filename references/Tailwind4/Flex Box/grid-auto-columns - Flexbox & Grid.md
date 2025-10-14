---
title: grid-auto-columns - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-auto-columns
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the size of implicitly-created grid columns.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## grid-auto-columns

Utilities for controlling the size of implicitly-created grid columns.

| Class | Styles |
| --- | --- |
| `auto-cols-auto` | `grid-auto-columns: auto;` |
| `auto-cols-min` | `grid-auto-columns: min-content;` |
| `auto-cols-max` | `grid-auto-columns: max-content;` |
| `auto-cols-fr` | `grid-auto-columns: minmax(0, 1fr);` |
| `auto-cols-(<custom-property>)` | `grid-auto-columns: var(<custom-property>);` |
| `auto-cols-[<value>]` | `grid-auto-columns: <value>;` |

Use utilities like `auto-cols-min` and `auto-cols-max` to control the size of implicitly-created grid columns:

```
<div class="grid auto-cols-max grid-flow-col">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use the `auto-cols-[<value>]` syntaxto set the size of implicitly-created grid columns based on a completely custom value:

```
<div class="auto-cols-[minmax(0,2fr)] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `auto-cols-(<custom-property>)` syntax:

```
<div class="auto-cols-(--my-auto-cols) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `auto-cols-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `grid-auto-columns` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid grid-flow-col auto-cols-max md:auto-cols-min ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)