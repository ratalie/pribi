---
title: text-decoration-thickness - Typography
source: https://tailwindcss.com/docs/text-decoration-thickness
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the thickness of text decorations.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-decoration-thickness

Typography

## text-decoration-thickness

Utilities for controlling the thickness of text decorations.

| Class | Styles |
| --- | --- |
| `decoration-<number>` | `text-decoration-thickness: <number>px;` |
| `decoration-from-font` | `text-decoration-thickness: from-font;` |
| `decoration-auto` | `text-decoration-thickness: auto;` |
| `decoration-(length:<custom-property>)` | `text-decoration-thickness: var(<custom-property>);` |
| `decoration-[<value>]` | `text-decoration-thickness: <value>;` |

Use `decoration-<number>` utilities like `decoration-2` and `decoration-4` to change the [text decoration](https://tailwindcss.com/docs/text-decoration-line) thickness of an element:

decoration-1

The quick brown fox jumps over the lazy dog.

decoration-2

The quick brown fox jumps over the lazy dog.

decoration-4

The quick brown fox jumps over the lazy dog.

```
<p class="underline decoration-1">The quick brown fox...</p>
<p class="underline decoration-2">The quick brown fox...</p>
<p class="underline decoration-4">The quick brown fox...</p>
```

Use the `decoration-[<value>]` syntaxto set the text decoration thickness based on a completely custom value:

```
<p class="decoration-[0.25rem] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `decoration-(length:<custom-property>)` syntax:

```
<p class="decoration-(length:--my-decoration-thickness) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `decoration-[length:var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `text-decoration-thickness` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="underline md:decoration-4 ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)