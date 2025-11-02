---
title: justify-self - Flexbox & Grid
source: https://tailwindcss.com/docs/justify-self
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an individual grid item is aligned along its inline axis.
tags:
  - clippings
updated: 2025-10-14T00:06
---
Flexbox & Grid

## justify-self

Utilities for controlling how an individual grid item is aligned along its inline axis.

| Class | Styles |
| --- | --- |
| `justify-self-auto` | `justify-self: auto;` |
| `justify-self-start` | `justify-self: start;` |
| `justify-self-center` | `justify-self: center;` |
| `justify-self-center-safe` | `justify-self: safe center;` |
| `justify-self-end` | `justify-self: end;` |
| `justify-self-end-safe` | `justify-self: safe end;` |
| `justify-self-stretch` | `justify-self: stretch;` |

Use the `justify-self-auto` utility to align an item based on the value of the grid's `justify-items` property:

01

02

03

04

05

06

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-auto ...">02</div>
  <!-- ... -->
</div>
```

Use the `justify-self-start` utility to align a grid item to the start of its inline axis:

01

02

03

04

05

06

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-start ...">02</div>
  <!-- ... -->
</div>
```

Use the `justify-self-center` or `justify-self-center-safe` utilities to align a grid item along the center of its inline axis:

Resize the container to see the alignment behavior

justify-self-center

01

02

03

justify-self-center-safe

01

02

03

justify-self-center

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-center ...">02</div>
  <!-- ... -->
</div>
```

justify-self-center-safe

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-center-safe ...">02</div>
  <!-- ... -->
</div>
```

When there is not enough space available, the `justify-self-center-safe` utility will align the item to the start of the container instead of the end.

Use the `justify-self-end` or `justify-self-end-safe` utilities to align a grid item to the end of its inline axis:

Resize the container to see the alignment behavior

justify-self-end

01

02

03

justify-self-end-safe

01

02

03

justify-self-end

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-end ...">02</div>
  <!-- ... -->
</div>
```

justify-self-end-safe

```
<div class="grid justify-items-stretch ...">
  <!-- ... -->
  <div class="justify-self-end-safe ...">02</div>
  <!-- ... -->
</div>
```

When there is not enough space available, the `justify-self-end-safe` utility will align the item to the start of the container instead of the end.

Use the `justify-self-stretch` utility to stretch a grid item to fill the grid area on its inline axis:

01

02

03

04

05

06

```
<div class="grid justify-items-start ...">
  <!-- ... -->
  <div class="justify-self-stretch ...">02</div>
  <!-- ... -->
</div>
```

Prefix a `justify-self` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="justify-self-start md:justify-self-end ...">
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