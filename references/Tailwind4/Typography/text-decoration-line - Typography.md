---
title: text-decoration-line - Typography
source: https://tailwindcss.com/docs/text-decoration-line
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the decoration of text.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-decoration-line

Typography

## text-decoration-line

Utilities for controlling the decoration of text.

| Class | Styles |
| --- | --- |
| `underline` | `text-decoration-line: underline;` |
| `overline` | `text-decoration-line: overline;` |
| `line-through` | `text-decoration-line: line-through;` |
| `no-underline` | `text-decoration-line: none;` |

Use the `underline` utility to add an underline to the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="underline">The quick brown fox...</p>
```

Use the `overline` utility to add an overline to the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="overline">The quick brown fox...</p>
```

Use the `line-through` utility to add a line through the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="line-through">The quick brown fox...</p>
```

Use the `no-underline` utility to remove a line from the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="no-underline">The quick brown fox...</p>
```

Prefix a `text-decoration-line` utility with a variant like `hover:*` to only apply the utility in that state:

Hover over the text to see the expected behavior

The [quick brown fox](https://en.wikipedia.org/wiki/The_quick_brown_fox_jumps_over_the_lazy_dog) jumps over the lazy dog.

```
<p>The <a href="..." class="no-underline hover:underline ...">quick brown fox</a> jumps over the lazy dog.</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Prefix a `text-decoration-line` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<a class="no-underline md:underline ..." href="...">
  <!-- ... -->
</a>
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