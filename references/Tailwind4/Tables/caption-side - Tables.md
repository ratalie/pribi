---
title: caption-side - Tables
source: https://tailwindcss.com/docs/caption-side
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the alignment of a caption element inside of a table.
tags:
  - clippings
updated: 2025-10-14T00:25
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Tables
2. caption-side

Tables

## caption-side

Utilities for controlling the alignment of a caption element inside of a table.

| Class | Styles |
| --- | --- |
| `caption-top` | `caption-side: top;` |
| `caption-bottom` | `caption-side: bottom;` |

Use the `caption-top` utility to position a caption element at the top of a table:

| Wrestler | Signature Move(s) |
| --- | --- |
| "Stone Cold" Steve Austin | Stone Cold Stunner, Lou Thesz Press |
| Bret "The Hitman" Hart | The Sharpshooter |
| Razor Ramon | Razor's Edge, Fallaway Slam |

```
<table>
  <caption class="caption-top">
    Table 3.1: Professional wrestlers and their signature moves.
  </caption>
  <thead>
    <tr>
      <th>Wrestler</th>
      <th>Signature Move(s)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Stone Cold" Steve Austin</td>
      <td>Stone Cold Stunner, Lou Thesz Press</td>
    </tr>
    <tr>
      <td>Bret "The Hitman" Hart</td>
      <td>The Sharpshooter</td>
    </tr>
    <tr>
      <td>Razor Ramon</td>
      <td>Razor's Edge, Fallaway Slam</td>
    </tr>
  </tbody>
</table>
```

Use the `caption-bottom` utility to position a caption element at the bottom of a table:

| Wrestler | Signature Move(s) |
| --- | --- |
| "Stone Cold" Steve Austin | Stone Cold Stunner, Lou Thesz Press |
| Bret "The Hitman" Hart | The Sharpshooter |
| Razor Ramon | Razor's Edge, Fallaway Slam |

```
<table>
  <caption class="caption-bottom">
    Table 3.1: Professional wrestlers and their signature moves.
  </caption>
  <thead>
    <tr>
      <th>Wrestler</th>
      <th>Signature Move(s)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Stone Cold" Steve Austin</td>
      <td>Stone Cold Stunner, Lou Thesz Press</td>
    </tr>
    <tr>
      <td>Bret "The Hitman" Hart</td>
      <td>The Sharpshooter</td>
    </tr>
    <tr>
      <td>Razor Ramon</td>
      <td>Razor's Edge, Fallaway Slam</td>
    </tr>
  </tbody>
</table>
```

Prefix a `caption-side` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<caption class="caption-top md:caption-bottom ...">
  <!-- ... -->
</caption>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Placing at top of table](https://tailwindcss.com/docs/#placing-at-top-of-table)
	- [Placing at bottom of table](https://tailwindcss.com/docs/#placing-at-bottom-of-table)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)