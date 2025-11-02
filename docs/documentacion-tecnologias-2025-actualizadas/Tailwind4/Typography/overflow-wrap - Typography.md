---
title: overflow-wrap - Typography
source: https://tailwindcss.com/docs/overflow-wrap
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling line breaks within words in an overflowing element.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. overflow-wrap

Typography

## overflow-wrap

Utilities for controlling line breaks within words in an overflowing element.

| Class | Styles |
| --- | --- |
| `wrap-break-word` | `overflow-wrap: break-word;` |
| `wrap-anywhere` | `overflow-wrap: anywhere;` |
| `wrap-normal` | `overflow-wrap: normal;` |

Use the `wrap-break-word` utility to allow line breaks between letters in a word if needed:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="wrap-break-word">The longest word in any of the major...</p>
```

The `wrap-anywhere` utility behaves similarly to `wrap-break-word`, except that the browser factors in mid-word line breaks when calculating the intrinsic size of the element:

![](https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80)

wrap-break-word

This is useful for wrapping text inside of `flex` containers, where you would usually need to set `min-width: 0` on the child element to allow it to shrink below its content size.

Use the `wrap-normal` utility to only allow line breaks at natural wrapping points, like spaces, hyphens, and punctuation:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="wrap-normal">The longest word in any of the major...</p>
```

Prefix an `overflow-wrap` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="wrap-normal md:wrap-break-word ...">
  Lorem ipsum dolor sit amet...
</p>
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