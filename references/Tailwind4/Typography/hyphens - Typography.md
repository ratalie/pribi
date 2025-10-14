---
title: hyphens - Typography
source: https://tailwindcss.com/docs/hyphens
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how words should be hyphenated.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. hyphens

Typography

## hyphens

Utilities for controlling how words should be hyphenated.

| Class | Styles |
| --- | --- |
| `hyphens-none` | `hyphens: none;` |
| `hyphens-manual` | `hyphens: manual;` |
| `hyphens-auto` | `hyphens: auto;` |

Use the `hyphens-none` utility to prevent words from being hyphenated even if the line break suggestion `&shy;` is used:

Officially recognized by the Duden dictionary as the longest word in German,Kraftfahrzeug­haftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.

```
<p class="hyphens-none">
  ... Kraftfahrzeug&shy;haftpflichtversicherung is a ...
</p>
```

Use the `hyphens-manual` utility to only set hyphenation points where the line break suggestion `&shy;` is used:

Officially recognized by the Duden dictionary as the longest word in German,Kraftfahrzeug­haftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.

```
<p class="hyphens-manual">
  ... Kraftfahrzeug&shy;haftpflichtversicherung is a ...
</p>
```

This is the default browser behavior.

Use the `hyphens-auto` utility to allow the browser to automatically choose hyphenation points based on the language:

Officially recognized by the Duden dictionary as the longest word in German,Kraftfahrzeughaftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.

```
<p class="hyphens-auto" lang="de">
  ... Kraftfahrzeughaftpflichtversicherung is a ...
</p>
```

The line break suggestion `&shy;` will be preferred over automatic hyphenation points.

Prefix a `hyphens` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="hyphens-none md:hyphens-auto ...">
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