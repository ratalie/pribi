---
title: border-style - Borders
source: https://tailwindcss.com/docs/border-style
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the style of an element's borders.
tags:
  - clippings
updated: 2025-10-14T00:15
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. border-style

Borders

## border-style

Utilities for controlling the style of an element's borders.

| Class | Styles |
| --- | --- |
| `border-solid` | `border-style: solid;` |
| `border-dashed` | `border-style: dashed;` |
| `border-dotted` | `border-style: dotted;` |
| `border-double` | `border-style: double;` |
| `border-hidden` | `border-style: hidden;` |
| `border-none` | `border-style: none;` |
| `divide-solid` | `& > :not(:last-child) {   border-style: solid; }` |
| `divide-dashed` | `& > :not(:last-child) {   border-style: dashed; }` |
| `divide-dotted` | `& > :not(:last-child) {   border-style: dotted; }` |
| `divide-double` | `& > :not(:last-child) {   border-style: double; }` |
| `divide-hidden` | `& > :not(:last-child) {   border-style: hidden; }` |
| `divide-none` | `& > :not(:last-child) {   border-style: none; }` |

Use utilities like `border-solid` and `border-dotted` to control an element's border style:

border-solid

border-dashed

border-dotted

border-double

```
<div class="border-2 border-solid ..."></div>
<div class="border-2 border-dashed ..."></div>
<div class="border-2 border-dotted ..."></div>
<div class="border-4 border-double ..."></div>
```

Use the `border-none` utility to remove an existing border from an element:

```
<button class="border-none ...">Save Changes</button>
```

This is most commonly used to remove a border style that was applied at a smaller breakpoint.

Use utilities like `divide-dashed` and `divide-dotted` to control the border style between child elements:

01

02

03

```
<div class="grid grid-cols-3 divide-x-3 divide-dashed divide-indigo-500">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

Prefix a `border-style` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="border-solid md:border-dotted ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)