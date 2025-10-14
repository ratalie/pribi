---
title: user-select - Interactivity
source: https://tailwindcss.com/docs/user-select
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling whether the user can select text in an element.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. user-select

Interactivity

## user-select

Utilities for controlling whether the user can select text in an element.

| Class | Styles |
| --- | --- |
| `select-none` | `user-select: none;` |
| `select-text` | `user-select: text;` |
| `select-all` | `user-select: all;` |
| `select-auto` | `user-select: auto;` |

Use the `select-none` utility to prevent selecting text in an element and its children:

Try selecting the text to see the expected behavior

The quick brown fox jumps over the lazy dog.

```
<div class="select-none ...">The quick brown fox jumps over the lazy dog.</div>
```

Use the `select-text` utility to allow selecting text in an element and its children:

Try selecting the text to see the expected behavior

The quick brown fox jumps over the lazy dog.

```
<div class="select-text ...">The quick brown fox jumps over the lazy dog.</div>
```

Use the `select-all` utility to automatically select all the text in an element when a user clicks:

Try clicking the text to see the expected behavior

The quick brown fox jumps over the lazy dog.

```
<div class="select-all ...">The quick brown fox jumps over the lazy dog.</div>
```

Use the `select-auto` utility to use the default browser behavior for selecting text:

Try selecting the text to see the expected behavior

The quick brown fox jumps over the lazy dog.

```
<div class="select-auto ...">The quick brown fox jumps over the lazy dog.</div>
```

Prefix an `user-select` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="select-none md:select-all ...">
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