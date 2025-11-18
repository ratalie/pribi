---
title: font-style - Typography
source: https://tailwindcss.com/docs/font-style
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the style of text.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. font-style

Typography

## font-style

Utilities for controlling the style of text.

| Class | Styles |
| --- | --- |
| `italic` | `font-style: italic;` |
| `not-italic` | `font-style: normal;` |

Use the `italic` utility to make text italic:

The quick brown fox jumps over the lazy dog.

```
<p class="italic ...">The quick brown fox ...</p>
```

Use the `not-italic` utility to display text normally:

The quick brown fox jumps over the lazy dog.

```
<p class="not-italic ...">The quick brown fox ...</p>
```

Prefix a `font-style` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="italic md:not-italic ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)