---
title: align-self - Flexbox & Grid
source: https://tailwindcss.com/docs/align-self
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## align-self

Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.

| Class | Styles |
| --- | --- |
| `self-auto` | `align-self: auto;` |
| `self-start` | `align-self: flex-start;` |
| `self-end` | `align-self: flex-end;` |
| `self-end-safe` | `align-self: safe flex-end;` |
| `self-center` | `align-self: center;` |
| `self-center-safe` | `align-self: safe center;` |
| `self-stretch` | `align-self: stretch;` |
| `self-baseline` | `align-self: baseline;` |
| `self-baseline-last` | `align-self: last baseline;` |

Use the `self-auto` utility to align an item based on the value of the container's `align-items` property:

01

02

03

```
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-auto ...">02</div>
  <div>03</div>
</div>
```

Use the `self-start` utility to align an item to the start of the container's cross axis, despite the container's `align-items` value:

01

02

03

```
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-start ...">02</div>
  <div>03</div>
</div>
```

Use the `self-center` utility to align an item along the center of the container's cross axis, despite the container's `align-items` value:

01

02

03

```
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-center ...">02</div>
  <div>03</div>
</div>
```

Use the `self-end` utility to align an item to the end of the container's cross axis, despite the container's `align-items` value:

01

02

03

```
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-end ...">02</div>
  <div>03</div>
</div>
```

Use the `self-stretch` utility to stretch an item to fill the container's cross axis, despite the container's `align-items` value:

01

02

03

```
<div class="flex items-stretch ...">
  <div>01</div>
  <div class="self-stretch ...">02</div>
  <div>03</div>
</div>
```

Use the `self-baseline` utility to align an item such that its baseline aligns with the baseline of the flex container's cross axis:

01

02

03

```
<div class="flex ...">
  <div class="self-baseline pt-2 pb-6">01</div>
  <div class="self-baseline pt-8 pb-12">02</div>
  <div class="self-baseline pt-12 pb-4">03</div>
</div>
```

Use the `self-baseline-last` utility to align an item along the container's cross axis such that its baseline aligns with the last baseline in the container:

Spencer Sharp

Working on the future of astronaut recruitment at Space Recruit.

[spacerecruit.com](https://tailwindcss.com/docs/#)

Alex Reed

A multidisciplinary designer.

[alex-reed.com](https://tailwindcss.com/docs/#)

```
<div class="grid grid-cols-[1fr_auto]">
  <div>
    <img src="img/spencer-sharp.jpg" />
    <h4>Spencer Sharp</h4>
    <p class="self-baseline-last">Working on the future of astronaut recruitment at Space Recruit.</p>
  </div>
  <p class="self-baseline-last">spacerecruit.com</p>
</div>
```

This is useful for ensuring that text items align with each other, even if they have different heights.

Prefix an `align-self` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="self-auto md:self-end ...">
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