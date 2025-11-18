---
title: visibility - Layout
source: https://tailwindcss.com/docs/visibility
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the visibility of an element.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. visibility

Layout

## visibility

Utilities for controlling the visibility of an element.

| Class | Styles |
| --- | --- |
| `visible` | `visibility: visible;` |
| `invisible` | `visibility: hidden;` |
| `collapse` | `visibility: collapse;` |

Use the `invisible` utility to hide an element, but still maintain its place in the document, affecting the layout of other elements:

01

03

```
<div class="grid grid-cols-3 gap-4">
  <div>01</div>
  <div class="invisible ...">02</div>
  <div>03</div>
</div>
```

To completely remove an element from the document, use the [display](https://tailwindcss.com/docs/display#hidden) property instead.

Use the `collapse` utility to hide table rows, row groups, columns, and column groups as if they were set to `display: none`, but without impacting the size of other rows and columns:

Showing all rows

| Invoice # | Client | Amount |
| --- | --- | --- |
| #100 | Pendant Publishing | $2,000.00 |
| #101 | Kruger Industrial Smoothing | $545.00 |
| #102 | J. Peterman | $10,000.25 |

Hiding a row using `` `collapse` ``

| Invoice # | Client | Amount |
| --- | --- | --- |
| #100 | Pendant Publishing | $2,000.00 |
| #101 | Kruger Industrial Smoothing | $545.00 |
| #102 | J. Peterman | $10,000.25 |

Hiding a row using `` `hidden` ``

| Invoice # | Client | Amount |
| --- | --- | --- |
| #100 | Pendant Publishing | $2,000.00 |
| #102 | J. Peterman | $10,000.25 |

```
<table>
  <thead>
    <tr>
      <th>Invoice #</th>
      <th>Client</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>#100</td>
      <td>Pendant Publishing</td>
      <td>$2,000.00</td>
    </tr>
    <tr class="collapse">
      <td>#101</td>
      <td>Kruger Industrial Smoothing</td>
      <td>$545.00</td>
    </tr>
    <tr>
      <td>#102</td>
      <td>J. Peterman</td>
      <td>$10,000.25</td>
    </tr>
  </tbody>
</table>
```

This makes it possible to dynamically toggle rows and columns without affecting the table layout.

Use the `visible` utility to make an element visible:

01

02

03

```
<div class="grid grid-cols-3 gap-4">
  <div>01</div>
  <div class="visible ...">02</div>
  <div>03</div>
</div>
```

This is mostly useful for undoing the `invisible` utility at different screen sizes.

Prefix a `visibility` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="visible md:invisible ...">
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