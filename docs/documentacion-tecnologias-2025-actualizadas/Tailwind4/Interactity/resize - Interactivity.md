---
title: resize - Interactivity
source: https://tailwindcss.com/docs/resize
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element can be resized.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. resize

Interactivity

## resize

Utilities for controlling how an element can be resized.

| Class | Styles |
| --- | --- |
| `resize-none` | `resize: none;` |
| `resize` | `resize: both;` |
| `resize-y` | `resize: vertical;` |
| `resize-x` | `resize: horizontal;` |

Use `resize` to make an element horizontally and vertically resizable:

Drag the textarea handle in the demo to see the expected behavior

```
<textarea class="resize rounded-md ..."></textarea>
```

Use `resize-y` to make an element vertically resizable:

Drag the textarea handle in the demo to see the expected behavior

```
<textarea class="resize-y rounded-md ..."></textarea>
```

Use `resize-x` to make an element horizontally resizable:

Drag the textarea handle in the demo to see the expected behavior

```
<textarea class="resize-x rounded-md ..."></textarea>
```

Use `resize-none` to prevent an element from being resizable:

Notice that the textarea handle is gone

```
<textarea class="resize-none rounded-md"></textarea>
```

Prefix a `resize` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="resize-none md:resize ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)