---
title: flex - Flexbox & Grid
source: https://tailwindcss.com/docs/flex
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how flex items both grow and shrink.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## flex

Utilities for controlling how flex items both grow and shrink.

| Class | Styles |
| --- | --- |
| `flex-<number>` | `flex: <number>;` |
| `flex-<fraction>` | `flex: calc(<fraction> * 100%);` |
| `flex-auto` | `flex: auto;` |
| `flex-initial` | `flex: 0 auto;` |
| `flex-none` | `flex: none;` |
| `flex-(<custom-property>)` | `flex: var(<custom-property>);` |
| `flex-[<value>]` | `flex: <value>;` |

Use `flex-<number>` utilities like `flex-1` to allow a flex item to grow and shrink as needed, ignoring its initial size:

01

02

03

```
<div class="flex">
  <div class="w-14 flex-none ...">01</div>
  <div class="w-64 flex-1 ...">02</div>
  <div class="w-32 flex-1 ...">03</div>
</div>
```

Use `flex-initial` to allow a flex item to shrink but not grow, taking into account its initial size:

01

02

03

```
<div class="flex">
  <div class="w-14 flex-none ...">01</div>
  <div class="w-64 flex-initial ...">02</div>
  <div class="w-32 flex-initial ...">03</div>
</div>
```

Use `flex-auto` to allow a flex item to grow and shrink, taking into account its initial size:

01

02

03

```
<div class="flex ...">
  <div class="w-14 flex-none ...">01</div>
  <div class="w-64 flex-auto ...">02</div>
  <div class="w-32 flex-auto ...">03</div>
</div>
```

Use `flex-none` to prevent a flex item from growing or shrinking:

01

02

03

```
<div class="flex ...">
  <div class="w-14 flex-none ...">01</div>
  <div class="w-32 flex-none ...">02</div>
  <div class="flex-1 ...">03</div>
</div>
```

Use the `flex-[<value>]` syntaxto set the flex shorthand property based on a completely custom value:

```
<div class="flex-[3_1_auto] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `flex-(<custom-property>)` syntax:

```
<div class="flex-(--my-flex) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `flex-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `flex` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="flex-none md:flex-1 ...">
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