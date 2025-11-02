---
title: table-layout - Tables
source: https://tailwindcss.com/docs/table-layout
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the table layout algorithm.
tags:
  - clippings
updated: 2025-10-14T00:25
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Tables
2. table-layout

Tables

## table-layout

Utilities for controlling the table layout algorithm.

| Class | Styles |
| --- | --- |
| `table-auto` | `table-layout: auto;` |
| `table-fixed` | `table-layout: fixed;` |

Use the `table-auto` utility to automatically size table columns to fit the contents of its cells:

| Song | Artist | Year |
| --- | --- | --- |
| The Sliding Mr. Bones (Next Stop, Pottersville) | Malcolm Lockyer | 1961 |
| Witchy Woman | The Eagles | 1972 |
| Shining Star | Earth, Wind, and Fire | 1975 |

```
<table class="table-auto">
  <thead>
    <tr>
      <th>Song</th>
      <th>Artist</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
      <td>Malcolm Lockyer</td>
      <td>1961</td>
    </tr>
    <tr>
      <td>Witchy Woman</td>
      <td>The Eagles</td>
      <td>1972</td>
    </tr>
    <tr>
      <td>Shining Star</td>
      <td>Earth, Wind, and Fire</td>
      <td>1975</td>
    </tr>
  </tbody>
</table>
```

Use the `table-fixed` utility to ignore the content of the table cells and use fixed widths for each column:

| Song | Artist | Year |
| --- | --- | --- |
| The Sliding Mr. Bones (Next Stop, Pottersville) | Malcolm Lockyer | 1961 |
| Witchy Woman | The Eagles | 1972 |
| Shining Star | Earth, Wind, and Fire | 1975 |

```
<table class="table-fixed">
  <thead>
    <tr>
      <th>Song</th>
      <th>Artist</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
      <td>Malcolm Lockyer</td>
      <td>1961</td>
    </tr>
    <tr>
      <td>Witchy Woman</td>
      <td>The Eagles</td>
      <td>1972</td>
    </tr>
    <tr>
      <td>Shining Star</td>
      <td>Earth, Wind, and Fire</td>
      <td>1975</td>
    </tr>
  </tbody>
</table>
```

You can manually set the widths for some columns and the rest of the available width will be divided evenly amongst columns without an explicit width. The widths set in the first row will set the column width for the whole table.

Prefix a `table-layout` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="table-auto md:table-fixed ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Sizing columns automatically](https://tailwindcss.com/docs/#sizing-columns-automatically)
	- [Using fixed column widths](https://tailwindcss.com/docs/#using-fixed-column-widths)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)