---
title: text-transform - Typography
source: https://tailwindcss.com/docs/text-transform
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the capitalization of text.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-transform

Typography

## text-transform

Utilities for controlling the capitalization of text.

| Class | Styles |
| --- | --- |
| `uppercase` | `text-transform: uppercase;` |
| `lowercase` | `text-transform: lowercase;` |
| `capitalize` | `text-transform: capitalize;` |
| `normal-case` | `text-transform: none;` |

Use the `uppercase` utility to uppercase the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="uppercase">The quick brown fox ...</p>
```

Use the `lowercase` utility to lowercase the text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="lowercase">The quick brown fox ...</p>
```

Use the `capitalize` utility to capitalize text of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="capitalize">The quick brown fox ...</p>
```

Use the `normal-case` utility to preserve the original text casing of an element—typically used to reset capitalization at different breakpoints:

The quick brown fox jumps over the lazy dog.

```
<p class="normal-case">The quick brown fox ...</p>
```

Prefix a `text-transform` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="capitalize md:uppercase ...">
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