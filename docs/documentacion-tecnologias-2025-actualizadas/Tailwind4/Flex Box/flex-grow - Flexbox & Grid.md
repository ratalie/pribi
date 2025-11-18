---
title: flex-grow - Flexbox & Grid
source: https://tailwindcss.com/docs/flex-grow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how flex items grow.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## flex-grow

Utilities for controlling how flex items grow.

| Class | Styles |
| --- | --- |
| `grow` | `flex-grow: 1;` |
| `grow-<number>` | `flex-grow: <number>;` |
| `grow-[<value>]` | `flex-grow: <value>;` |
| `grow-(<custom-property>)` | `flex-grow: var(<custom-property>);` |

Use `grow` to allow a flex item to grow to fill any available space:

01

02

03

```
<div class="flex ...">
  <div class="size-14 flex-none ...">01</div>
  <div class="size-14 grow ...">02</div>
  <div class="size-14 flex-none ...">03</div>
</div>
```

Use `grow-<number>` utilities like `grow-3` to make flex items grow proportionally based on their growth factor, allowing them to fill the available space relative to each other:

01

02

03

```
<div class="flex ...">
  <div class="size-14 grow-3 ...">01</div>
  <div class="size-14 grow-7 ...">02</div>
  <div class="size-14 grow-3 ...">03</div>
</div>
```

Use `grow-0` to prevent a flex item from growing:

01

02

```
<div class="flex ...">
  <div class="size-14 grow ...">01</div>
  <div class="size-14 grow-0 ...">02</div>
  <div class="size-14 grow ...">03</div>
</div>
```

Use the `grow-[<value>]` syntaxto set the flex grow factor based on a completely custom value:

```
<div class="grow-[25vw] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `grow-(<custom-property>)` syntax:

```
<div class="grow-(--my-grow) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `grow-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `flex-grow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grow md:grow-0 ...">
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