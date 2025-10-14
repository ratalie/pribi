---
title: outline-width - Borders
source: https://tailwindcss.com/docs/outline-width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the width of an element's outline.
tags:
  - clippings
updated: 2025-10-14T00:14
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. outline-width

Borders

## outline-width

Utilities for controlling the width of an element's outline.

| Class | Styles |
| --- | --- |
| `outline` | `outline-width: 1px;` |
| `outline-<number>` | `outline-width: <number>px;` |
| `outline-(length:<custom-property>)` | `outline-width: var(<custom-property>);` |
| `outline-[<value>]` | `outline-width: <value>;` |

Use `outline` or `outline-<number>` utilities like `outline-2` and `outline-4` to set the width of an element's outline:

outline

outline-2

outline-4

```
<button class="outline outline-offset-2 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-4 outline-offset-2 ...">Button C</button>
```

Prefix an `outline-width` utility with a variant like `focus:*` to only apply the utility in that state:

Focus the button to see the outline added

```
<button class="outline-offset-2 outline-sky-500 focus:outline-2 ...">Save Changes</button>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `outline-[<value>]` syntaxto set the outline width based on a completely custom value:

```
<div class="outline-[2vw] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `outline-(length:<custom-property>)` syntax:

```
<div class="outline-(length:--my-outline-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `outline-[length:var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `outline-width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="outline md:outline-2 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)