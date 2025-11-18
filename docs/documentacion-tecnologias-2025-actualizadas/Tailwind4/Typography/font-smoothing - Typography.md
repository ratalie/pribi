---
title: font-smoothing - Typography
source: https://tailwindcss.com/docs/font-smoothing
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the font smoothing of an element.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. font-smoothing

Typography

## font-smoothing

Utilities for controlling the font smoothing of an element.

| Class | Styles |
| --- | --- |
| `antialiased` | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` |
| `subpixel-antialiased` | `-webkit-font-smoothing: auto; -moz-osx-font-smoothing: auto;` |

Use the `antialiased` utility to render text using grayscale antialiasing:

The quick brown fox jumps over the lazy dog.

```
<p class="antialiased ...">The quick brown fox ...</p>
```

Use the `subpixel-antialiased` utility to render text using subpixel antialiasing:

The quick brown fox jumps over the lazy dog.

```
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
```

Prefix `-webkit-font-smoothing` and `-moz-osx-font-smoothing` utilitieswith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="antialiased md:subpixel-antialiased ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)