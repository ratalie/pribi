---
title: rotate - Transforms
source: https://tailwindcss.com/docs/rotate
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for rotating elements.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. rotate

Transforms

## rotate

Utilities for rotating elements.

| Class | Styles |
| --- | --- |
| `rotate-none` | `rotate: none;` |
| `rotate-<number>` | `rotate: <number>deg;` |
| `-rotate-<number>` | `rotate: calc(<number>deg * -1);` |
| `rotate-(<custom-property>)` | `rotate: var(<custom-property>);` |
| `rotate-[<value>]` | `rotate: <value>;` |
| `rotate-x-<number>` | `transform: rotateX(<number>deg) var(--tw-rotate-y);` |
| `-rotate-x-<number>` | `transform: rotateX(-<number>deg) var(--tw-rotate-y);` |
| `rotate-x-(<custom-property>)` | `transform: rotateX(var(<custom-property>)) var(--tw-rotate-y);` |
| `rotate-x-[<value>]` | `transform: rotateX(<value>) var(--tw-rotate-y);` |
| `rotate-y-<number>` | `transform: var(--tw-rotate-x) rotateY(<number>deg);` |

Use `rotate-<number>` utilities like `rotate-45` and `rotate-90` to rotate an element by degrees:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use `-rotate-<number>` utilities like `-rotate-45` and `-rotate-90` to rotate an element counterclockwise by degrees:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-rotate-45

Use `rotate-x-<number>`, `rotate-y-<number>`, and `rotate-z-<number>` utilities like `rotate-x-50`, `-rotate-y-30`, and `rotate-z-45` together to rotate an element in 3D space:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

rotate-x-50

Use the `rotate-[<value>]` syntaxto set the rotation based on a completely custom value:

```
<img class="rotate-[3.142rad] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `rotate-(<custom-property>)` syntax:

```
<img class="rotate-(--my-rotation) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `rotate-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `rotate` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="rotate-45 md:rotate-60 ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)