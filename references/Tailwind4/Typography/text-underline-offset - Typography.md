---
title: text-underline-offset - Typography
source: https://tailwindcss.com/docs/text-underline-offset
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the offset of a text underline.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-underline-offset

Typography

## text-underline-offset

Utilities for controlling the offset of a text underline.

| Class | Styles |
| --- | --- |
| `underline-offset-<number>` | `text-underline-offset: <number>px;` |
| `-underline-offset-<number>` | `text-underline-offset: calc(<number>px * -1);` |
| `underline-offset-auto` | `text-underline-offset: auto;` |
| `underline-offset-(<custom-property>)` | `text-underline-offset: var(<custom-property>);` |
| `underline-offset-[<value>]` | `text-underline-offset: <value>;` |

Use `underline-offset-<number>` utilities like `underline-offset-2` and `underline-offset-4` to change the offset of a text underline:

underline-offset-1

The quick brown fox jumps over the lazy dog.

underline-offset-2

The quick brown fox jumps over the lazy dog.

underline-offset-4

The quick brown fox jumps over the lazy dog.

underline-offset-8

The quick brown fox jumps over the lazy dog.

```
<p class="underline underline-offset-1">The quick brown fox...</p>
<p class="underline underline-offset-2">The quick brown fox...</p>
<p class="underline underline-offset-4">The quick brown fox...</p>
<p class="underline underline-offset-8">The quick brown fox...</p>
```

Use the `underline-offset-[<value>]` syntaxto set the text underline offset based on a completely custom value:

```
<p class="underline-offset-[3px] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `underline-offset-(<custom-property>)` syntax:

```
<p class="underline-offset-(--my-underline-offset) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `underline-offset-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `text-underline-offset` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="underline md:underline-offset-4 ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)