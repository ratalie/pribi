---
title: outline-offset - Borders
source: https://tailwindcss.com/docs/outline-offset
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the offset of an element's outline.
tags:
  - clippings
updated: 2025-10-14T00:20
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. outline-offset

Borders

## outline-offset

Utilities for controlling the offset of an element's outline.

| Class | Styles |
| --- | --- |
| `outline-offset-<number>` | `outline-offset: <number>px;` |
| `-outline-offset-<number>` | `outline-offset: calc(<number>px * -1);` |
| `outline-offset-(<custom-property>)` | `outline-offset: var(<custom-property>);` |
| `outline-offset-[<value>]` | `outline-offset: <value>;` |

Use utilities like `outline-offset-2` and `outline-offset-4` to change the offset of an element's outline:

outline-offset-0

outline-offset-2

outline-offset-4

```
<button class="outline-2 outline-offset-0 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-2 outline-offset-4 ...">Button C</button>
```

Use the `outline-offset-[<value>]` syntaxto set the outline offset based on a completely custom value:

```
<div class="outline-offset-[2vw] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `outline-offset-(<custom-property>)` syntax:

```
<div class="outline-offset-(--my-outline-offset) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `outline-offset-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `outline-offset` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="outline md:outline-offset-2 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)