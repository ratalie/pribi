---
title: border-width - Borders
source: https://tailwindcss.com/docs/border-width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the width of an element's borders.
tags:
  - clippings
updated: 2025-10-14T00:17
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. border-width

Borders

## border-width

Utilities for controlling the width of an element's borders.

| Class | Styles |
| --- | --- |
| `border` | `border-width: 1px;` |
| `border-<number>` | `border-width: <number>px;` |
| `border-(length:<custom-property>)` | `border-width: var(<custom-property>);` |
| `border-[<value>]` | `border-width: <value>;` |
| `border-x` | `border-inline-width: 1px;` |
| `border-x-<number>` | `border-inline-width: <number>px;` |
| `border-x-(length:<custom-property>)` | `border-inline-width: var(<custom-property>);` |
| `border-x-[<value>]` | `border-inline-width: <value>;` |
| `border-y` | `border-block-width: 1px;` |
| `border-y-<number>` | `border-block-width: <number>px;` |

Use `border` or `border-<number>` utilities like `border-2` and `border-4` to set the border width for all sides of an element:

border

border-2

border-4

border-8

```
<div class="border border-indigo-600 ..."></div>
<div class="border-2 border-indigo-600 ..."></div>
<div class="border-4 border-indigo-600 ..."></div>
<div class="border-8 border-indigo-600 ..."></div>
```

Use utilities like `border-r` and `border-t-4` to set the border width for one side of an element:

border-t-4

border-r-4

border-b-4

border-l-4

```
<div class="border-t-4 border-indigo-500 ..."></div>
<div class="border-r-4 border-indigo-500 ..."></div>
<div class="border-b-4 border-indigo-500 ..."></div>
<div class="border-l-4 border-indigo-500 ..."></div>
```

Use utilities like `border-x` and `border-y-4` to set the border width on two sides of an element at the same time:

border-x-4

border-y-4

```
<div class="border-x-4 border-indigo-500 ..."></div>
<div class="border-y-4 border-indigo-500 ..."></div>
```

Use utilities like `border-s` and `border-e-4` to set the `border-inline-start-width` and `border-inline-end-width` [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts), which map to either the left or right border based on the text direction:

Left-to-right

Right-to-left

```
<div dir="ltr">
  <div class="border-s-4 ..."></div>
</div>
<div dir="rtl">
  <div class="border-s-4 ..."></div>
</div>
```

Use utilities like `divide-x` and `divide-y-4` to add borders between child elements:

01

02

03

```
<div class="grid grid-cols-3 divide-x-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

If your elements are in reverse order (using say `flex-row-reverse` or `flex-col-reverse`), use the `divide-x-reverse` or `divide-y-reverse` utilities to ensure the border is added to the correct side of each element:

01

02

03

```
<div class="flex flex-col-reverse divide-y-4 divide-y-reverse divide-gray-200">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Use the `border-[<value>]` syntaxto set the border width based on a completely custom value:

```
<div class="border-[2vw] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `border-(length:<custom-property>)` syntax:

```
<div class="border-(length:--my-border-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `border-[length:var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `border-width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="border-2 md:border-t-4 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)