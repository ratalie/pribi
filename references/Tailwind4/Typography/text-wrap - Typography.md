---
title: text-wrap - Typography
source: https://tailwindcss.com/docs/text-wrap
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how text wraps within an element.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-wrap

Typography

## text-wrap

Utilities for controlling how text wraps within an element.

| Class | Styles |
| --- | --- |
| `text-wrap` | `text-wrap: wrap;` |
| `text-nowrap` | `text-wrap: nowrap;` |
| `text-balance` | `text-wrap: balance;` |
| `text-pretty` | `text-wrap: pretty;` |

Use the `text-wrap` utility to wrap overflowing text onto multiple lines at logical points in the text:

Beloved Manhattan soup stand closes

New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.

```
<article class="text-wrap">
  <h3>Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill...</p>
</article>
```

Use the `text-nowrap` utility to prevent text from wrapping, allowing it to overflow if necessary:

Beloved Manhattan soup stand closes

New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.

```
<article class="text-nowrap">
  <h3>Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill...</p>
</article>
```

Use the `text-balance` utility to distribute the text evenly across each line:

Beloved Manhattan soup stand closes

New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.

```
<article>
  <h3 class="text-balance">Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill...</p>
</article>
```

For performance reasons browsers limit text balancing to blocks that are ~6 lines or less, making it best suited for headings.

Use the `text-pretty` utility to prefer better text wrapping and layout at the expense of speed. Behavior varies across browsers but often involves approaches like preventing orphans (a single word on its own line) at the end of a text block:

Beloved Manhattan soup stand closes

New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.

```
<article>
  <h3 class="text-pretty">Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill...</p>
</article>
```

Prefix a `text-wrap` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<h1 class="text-pretty md:text-balance ...">
  <!-- ... -->
</h1>
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