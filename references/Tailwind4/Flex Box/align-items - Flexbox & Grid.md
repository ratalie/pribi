---
title: align-items - Flexbox & Grid
source: https://tailwindcss.com/docs/align-items
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how flex and grid items are positioned along a container's cross axis.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## align-items

Utilities for controlling how flex and grid items are positioned along a container's cross axis.

| Class | Styles |
| --- | --- |
| `items-start` | `align-items: flex-start;` |
| `items-end` | `align-items: flex-end;` |
| `items-end-safe` | `align-items: safe flex-end;` |
| `items-center` | `align-items: center;` |
| `items-center-safe` | `align-items: safe center;` |
| `items-baseline` | `align-items: baseline;` |
| `items-baseline-last` | `align-items: last baseline;` |
| `items-stretch` | `align-items: stretch;` |

Use the `items-stretch` utility to stretch items to fill the container's cross axis:

01

02

03

```
<div class="flex items-stretch ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

Use the `items-start` utility to align items to the start of the container's cross axis:

01

02

03

```
<div class="flex items-start ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

Use the `items-center` utility to align items along the center of the container's cross axis:

01

02

03

```
<div class="flex items-center ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

Use the `items-end` utility to align items to the end of the container's cross axis:

01

02

03

```
<div class="flex items-end ...">
  <div class="py-4">01</div>
  <div class="py-12">02</div>
  <div class="py-8">03</div>
</div>
```

Use the `items-baseline` utility to align items along the container's cross axis such that all of their baselines align:

01

02

03

```
<div class="flex items-baseline ...">
  <div class="pt-2 pb-6">01</div>
  <div class="pt-8 pb-12">02</div>
  <div class="pt-12 pb-4">03</div>
</div>
```

Use the `items-baseline-last` utility to align items along the container's cross axis such that all of their baselines align with the last baseline in the container:

Spencer Sharp

Working on the future of astronaut recruitment at Space Recruit.

[spacerecruit.com](https://tailwindcss.com/docs/#)

Alex Reed

A multidisciplinary designer.

[alex-reed.com](https://tailwindcss.com/docs/#)

```
<div class="grid grid-cols-[1fr_auto] items-baseline-last">
  <div>
    <img src="img/spencer-sharp.jpg" />
    <h4>Spencer Sharp</h4>
    <p>Working on the future of astronaut recruitment at Space Recruit.</p>
  </div>
  <p>spacerecruit.com</p>
</div>
```

This is useful for ensuring that text items align with each other, even if they have different heights.

Prefix an `align-items` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="flex items-stretch md:items-center ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)