---
title: vertical-align - Typography
source: https://tailwindcss.com/docs/vertical-align
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the vertical alignment of an inline or table-cell box.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. vertical-align

Typography

## vertical-align

Utilities for controlling the vertical alignment of an inline or table-cell box.

| Class | Styles |
| --- | --- |
| `align-baseline` | `vertical-align: baseline;` |
| `align-top` | `vertical-align: top;` |
| `align-middle` | `vertical-align: middle;` |
| `align-bottom` | `vertical-align: bottom;` |
| `align-text-top` | `vertical-align: text-top;` |
| `align-text-bottom` | `vertical-align: text-bottom;` |
| `align-sub` | `vertical-align: sub;` |
| `align-super` | `vertical-align: super;` |
| `align-(<custom-property>)` | `vertical-align: var(<custom-property>);` |
| `align-[<value>]` | `vertical-align: <value>;` |

Use the `align-baseline` utility to align the baseline of an element with the baseline of its parent:

```
<span class="inline-block align-baseline">The quick brown fox...</span>
```

Use the `align-top` utility to align the top of an element and its descendants with the top of the entire line:

```
<span class="inline-block align-top">The quick brown fox...</span>
```

Use the `align-middle` utility to align the middle of an element with the baseline plus half the x-height of the parent:

```
<span class="inline-block align-middle">The quick brown fox...</span>
```

Use the `align-bottom` utility to align the bottom of an element and its descendants with the bottom of the entire line:

```
<span class="inline-block align-bottom">The quick brown fox...</span>
```

Use the `align-text-top` utility to align the top of an element with the top of the parent element's font:

```
<span class="inline-block align-text-top">The quick brown fox...</span>
```

Use the `align-text-bottom` utility to align the bottom of an element with the bottom of the parent element's font:

```
<span class="inline-block align-text-bottom">The quick brown fox...</span>
```

Use the `align-[<value>]` syntaxto set the vertical alignment based on a completely custom value:

```
<span class="align-[4px] ...">
  <!-- ... -->
</span>
```

For CSS variables, you can also use the `align-(<custom-property>)` syntax:

```
<span class="align-(--my-alignment) ...">
  <!-- ... -->
</span>
```

This is just a shorthand for `align-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `vertical-align` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<span class="align-middle md:align-top ...">
  <!-- ... -->
</span>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)