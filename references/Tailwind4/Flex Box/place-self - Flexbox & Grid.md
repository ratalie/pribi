---
title: place-self - Flexbox & Grid
source: https://tailwindcss.com/docs/place-self
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an individual item is justified and aligned at the same time.
tags:
  - clippings
updated: 2025-10-14T00:07
---
Flexbox & Grid

## place-self

Utilities for controlling how an individual item is justified and aligned at the same time.

| Class | Styles |
| --- | --- |
| `place-self-auto` | `place-self: auto;` |
| `place-self-start` | `place-self: start;` |
| `place-self-end` | `place-self: end;` |
| `place-self-end-safe` | `place-self: safe end;` |
| `place-self-center` | `place-self: center;` |
| `place-self-center-safe` | `place-self: safe center;` |
| `place-self-stretch` | `place-self: stretch;` |

Use `place-self-auto` to align an item based on the value of the container's `place-items` property:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-auto ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-self-start` to align an item to the start on both axes:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-start ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-self-center` to align an item at the center on both axes:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-center ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-self-end` to align an item to the end on both axes:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-end ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Use `place-self-stretch` to stretch an item on both axes:

01

02

03

04

05

06

```
<div class="grid grid-cols-3 gap-4 ...">
  <div>01</div>
  <div class="place-self-stretch ...">02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

Prefix a `place-self` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="place-self-start md:place-self-end ...">
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