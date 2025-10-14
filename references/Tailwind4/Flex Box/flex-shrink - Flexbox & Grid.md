---
title: flex-shrink - Flexbox & Grid
source: https://tailwindcss.com/docs/flex-shrink
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how flex items shrink.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## flex-shrink

Utilities for controlling how flex items shrink.

| Class | Styles |
| --- | --- |
| `shrink` | `flex-shrink: 1;` |
| `shrink-<number>` | `flex-shrink: <number>;` |
| `shrink-[<value>]` | `flex-shrink: <value>;` |
| `shrink-(<custom-property>)` | `flex-shrink: var(<custom-property>);` |

Use `shrink` to allow a flex item to shrink if needed:

01

02

```
<div class="flex ...">
  <div class="h-14 w-14 flex-none ...">01</div>
  <div class="h-14 w-64 shrink ...">02</div>
  <div class="h-14 w-14 flex-none ...">03</div>
</div>
```

Use `shrink-0` to prevent a flex item from shrinking:

01

02

```
<div class="flex ...">
  <div class="h-16 flex-1 ...">01</div>
  <div class="h-16 w-32 shrink-0 ...">02</div>
  <div class="h-16 flex-1 ...">03</div>
</div>
```

Use the `shrink-[<value>]` syntaxto set the flex shrink factor based on a completely custom value:

For CSS variables, you can also use the `shrink-(<custom-property>)` syntax:

```
<div class="shrink-(--my-shrink) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `shrink-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `flex-shrink` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="shrink md:shrink-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Allowing flex items to shrink](https://tailwindcss.com/docs/#allowing-flex-items-to-shrink)
	- [Preventing items from shrinking](https://tailwindcss.com/docs/#preventing-items-from-shrinking)
	- [Using a custom value](https://tailwindcss.com/docs/#using-a-custom-value)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)