---
title: list-style-position - Typography
source: https://tailwindcss.com/docs/list-style-position
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the position of bullets and numbers in lists.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. list-style-position

Typography

## list-style-position

Utilities for controlling the position of bullets and numbers in lists.

| Class | Styles |
| --- | --- |
| `list-inside` | `list-style-position: inside;` |
| `list-outside` | `list-style-position: outside;` |

Use utilities like `list-inside` and `list-outside` to control the position of the markers and text indentation in a list:

list-inside

- 5 cups chopped Porcini mushrooms
- 1/2 cup of olive oil
- 3lb of celery

list-outside

- 5 cups chopped Porcini mushrooms
- 1/2 cup of olive oil
- 3lb of celery

```
<ul class="list-inside">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>

<ul class="list-outside">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>
```

Prefix a `list-style-position` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<ul class="list-outside md:list-inside ...">
  <!-- ... -->
</ul>
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