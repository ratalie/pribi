---
title: opacity - Effects
source: https://tailwindcss.com/docs/opacity
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the opacity of an element.
tags:
  - clippings
updated: 2025-10-14T00:21
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. opacity

Effects

## opacity

Utilities for controlling the opacity of an element.

| Class | Styles |
| --- | --- |
| `opacity-<number>` | `opacity: <number>%;` |
| `opacity-(<custom-property>)` | `opacity: var(<custom-property>);` |
| `opacity-[<value>]` | `opacity: <value>;` |

Use `opacity-<number>` utilities like `opacity-25` and `opacity-100` to set the opacity of an element:

opacity-100

opacity-75

opacity-50

opacity-25

```
<button class="bg-indigo-500 opacity-100 ..."></button>
<button class="bg-indigo-500 opacity-75 ..."></button>
<button class="bg-indigo-500 opacity-50 ..."></button>
<button class="bg-indigo-500 opacity-25 ..."></button>
```

Prefix an `opacity` utility with a variant like `disabled:*` to only apply the utility in that state:

```
<input class="opacity-100 disabled:opacity-75 ..." type="text" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `opacity-[<value>]` syntaxto set the opacity based on a completely custom value:

```
<button class="opacity-[.67] ...">
  <!-- ... -->
</button>
```

For CSS variables, you can also use the `opacity-(<custom-property>)` syntax:

```
<button class="opacity-(--my-opacity) ...">
  <!-- ... -->
</button>
```

This is just a shorthand for `opacity-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `opacity` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<button class="opacity-50 md:opacity-100 ...">
  <!-- ... -->
</button>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)