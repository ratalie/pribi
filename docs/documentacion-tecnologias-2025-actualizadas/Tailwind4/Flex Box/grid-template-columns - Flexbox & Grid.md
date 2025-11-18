---
title: grid-template-columns - Flexbox & Grid
source: https://tailwindcss.com/docs/grid-template-columns
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for specifying the columns in a grid layout.
tags:
  - clippings
updated: 2025-10-14T00:05
---
Flexbox & Grid

## grid-template-columns

Utilities for specifying the columns in a grid layout.

| Class | Styles |
| --- | --- |
| `grid-cols-<number>` | `grid-template-columns: repeat(<number>, minmax(0, 1fr));` |
| `grid-cols-none` | `grid-template-columns: none;` |
| `grid-cols-subgrid` | `grid-template-columns: subgrid;` |
| `grid-cols-[<value>]` | `grid-template-columns: <value>;` |
| `grid-cols-(<custom-property>)` | `grid-template-columns: var(<custom-property>);` |

Use `grid-cols-<number>` utilities like `grid-cols-2` and `grid-cols-4` to create grids with *n* equally sized columns:

01

02

03

04

05

06

07

08

09

```
<div class="grid grid-cols-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>09</div>
</div>
```

Use the `grid-cols-subgrid` utility to adopt the column tracks defined by the item's parent:

01

02

03

04

05

06

```
<div class="grid grid-cols-4 gap-4">
  <div>01</div>
  <!-- ... -->
  <div>05</div>
  <div class="col-span-3 grid grid-cols-subgrid gap-4">
    <div class="col-start-2">06</div>
  </div>
</div>
```

Use the `grid-cols-[<value>]` syntaxto set the columns based on a completely custom value:

```
<div class="grid-cols-[200px_minmax(900px,_1fr)_100px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `grid-cols-(<custom-property>)` syntax:

```
<div class="grid-cols-(--my-grid-cols) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `grid-cols-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `grid-template-columns` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="grid grid-cols-1 md:grid-cols-6 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Specifying the grid columns](https://tailwindcss.com/docs/#specifying-the-grid-columns)
	- [Implementing a subgrid](https://tailwindcss.com/docs/#implementing-a-subgrid)
	- [Using a custom value](https://tailwindcss.com/docs/#using-a-custom-value)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)

From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)