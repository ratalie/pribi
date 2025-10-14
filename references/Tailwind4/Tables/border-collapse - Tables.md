---
title: border-collapse - Tables
source: https://tailwindcss.com/docs/border-collapse
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling whether table borders should collapse or be separated.
tags:
  - clippings
updated: 2025-10-14T00:25
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Tables
2. border-collapse

Tables

## border-collapse

Utilities for controlling whether table borders should collapse or be separated.

| Class | Styles |
| --- | --- |
| `border-collapse` | `border-collapse: collapse;` |
| `border-separate` | `border-collapse: separate;` |

Use the `border-collapse` utility to combine adjacent cell borders into a single border when possible:

| State | City |
| --- | --- |
| Indiana | Indianapolis |
| Ohio | Columbus |
| Michigan | Detroit |

```
<table class="border-collapse border border-gray-400 ...">
  <thead>
    <tr>
      <th class="border border-gray-300 ...">State</th>
      <th class="border border-gray-300 ...">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 ...">Indiana</td>
      <td class="border border-gray-300 ...">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-300 ...">Ohio</td>
      <td class="border border-gray-300 ...">Columbus</td>
    </tr>
    <tr>
      <td class="border border-gray-300 ...">Michigan</td>
      <td class="border border-gray-300 ...">Detroit</td>
    </tr>
  </tbody>
</table>
```

Note that this includes collapsing borders on the top-level `<table>` tag.

Use the `border-separate` utility to force each cell to display its own separate borders:

| State | City |
| --- | --- |
| Indiana | Indianapolis |
| Ohio | Columbus |
| Michigan | Detroit |

```
<table class="border-separate border border-gray-400 ...">
  <thead>
    <tr>
      <th class="border border-gray-300 ...">State</th>
      <th class="border border-gray-300 ...">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 ...">Indiana</td>
      <td class="border border-gray-300 ...">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-300 ...">Ohio</td>
      <td class="border border-gray-300 ...">Columbus</td>
    </tr>
    <tr>
      <td class="border border-gray-300 ...">Michigan</td>
      <td class="border border-gray-300 ...">Detroit</td>
    </tr>
  </tbody>
</table>
```

Prefix a `border-collapse` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<table class="border-collapse md:border-separate ...">
  <!-- ... -->
</table>
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