---
title: text-decoration-style - Typography
source: https://tailwindcss.com/docs/text-decoration-style
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the style of text decorations.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-decoration-style

Typography

## text-decoration-style

Utilities for controlling the style of text decorations.

| Class | Styles |
| --- | --- |
| `decoration-solid` | `text-decoration-style: solid;` |
| `decoration-double` | `text-decoration-style: double;` |
| `decoration-dotted` | `text-decoration-style: dotted;` |
| `decoration-dashed` | `text-decoration-style: dashed;` |
| `decoration-wavy` | `text-decoration-style: wavy;` |

Use utilities like `decoration-dotted` and `decoration-dashed` to change the [text decoration](https://tailwindcss.com/docs/text-decoration-line) style of an element:

decoration-solid

The quick brown fox jumps over the lazy dog.

decoration-double

The quick brown fox jumps over the lazy dog.

decoration-dotted

The quick brown fox jumps over the lazy dog.

decoration-dashed

The quick brown fox jumps over the lazy dog.

decoration-wavy

The quick brown fox jumps over the lazy dog.

```
<p class="underline decoration-solid">The quick brown fox...</p>
<p class="underline decoration-double">The quick brown fox...</p>
<p class="underline decoration-dotted">The quick brown fox...</p>
<p class="underline decoration-dashed">The quick brown fox...</p>
<p class="underline decoration-wavy">The quick brown fox...</p>
```

Prefix a `text-decoration-style` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="underline md:decoration-dashed ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)