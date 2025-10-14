---
title: scale - Transforms
source: https://tailwindcss.com/docs/scale
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for scaling elements.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. scale

Transforms

## scale

Utilities for scaling elements.

| Class | Styles |
| --- | --- |
| `scale-none` | `scale: none;` |
| `scale-<number>` | `scale: <number>% <number>%;` |
| `-scale-<number>` | `scale: calc(<number>% * -1) calc(<number>% * -1);` |
| `scale-(<custom-property>)` | `scale: var(<custom-property>) var(<custom-property>);` |
| `scale-[<value>]` | `scale: <value>;` |
| `scale-x-<number>` | `scale: <number>% var(--tw-scale-y);` |
| `-scale-x-<number>` | `scale: calc(<number>% * -1) var(--tw-scale-y);` |
| `scale-x-(<custom-property>)` | `scale: var(<custom-property>) var(--tw-scale-y);` |
| `scale-x-[<value>]` | `scale: <value> var(--tw-scale-y);` |
| `scale-y-<number>` | `scale: var(--tw-scale-x) <number>%;` |

Use `scale-<number>` utilities like `scale-75` and `scale-150` to scale an element by a percentage of its original size:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use the `scale-x-<number>` utilities like `scale-x-75` and `-scale-x-150` to scale an element on the x-axis by a percentage of its original width:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

scale-x-75

Use the `scale-y-<number>` utilities like `scale-y-75` and `scale-y-150` to scale an element on the y-axis by a percentage of its original height:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

scale-y-75

Use `-scale-<number>`, `-scale-x-<number>` or `-scale-y-<number>` utilities like `-scale-x-75` and `-scale-125` to mirror and scale down an element by a percentage of its original size:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-scale-x-75

Use the `scale-[<value>]` syntaxto set the scale based on a completely custom value:

```
<img class="scale-[1.7] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `scale-(<custom-property>)` syntax:

```
<img class="scale-(--my-scale) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `scale-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `scale` utility with a variant like `hover:*` to only apply the utility in that state:

```
<img class="scale-95 hover:scale-120 ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)