---
title: text-overflow - Typography
source: https://tailwindcss.com/docs/text-overflow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how the text of an element overflows.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-overflow

Typography

## text-overflow

Utilities for controlling how the text of an element overflows.

| Class | Styles |
| --- | --- |
| `truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` |
| `text-ellipsis` | `text-overflow: ellipsis;` |
| `text-clip` | `text-overflow: clip;` |

Use the `truncate` utility to prevent text from wrapping and truncate overflowing text with an ellipsis (…) if needed:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="truncate">The longest word in any of the major...</p>
```

Use the `text-ellipsis` utility to truncate overflowing text with an ellipsis (…) if needed:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="overflow-hidden text-ellipsis">The longest word in any of the major...</p>
```

Use the `text-clip` utility to truncate the text at the limit of the content area:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="overflow-hidden text-clip">The longest word in any of the major...</p>
```

This is the default browser behavior.

Prefix a `text-overflow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="text-ellipsis md:text-clip ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)