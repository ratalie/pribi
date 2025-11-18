---
title: skew - Transforms
source: https://tailwindcss.com/docs/skew
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for skewing elements with transform.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. skew

Transforms

## skew

Utilities for skewing elements with transform.

| Class | Styles |
| --- | --- |
| `skew-<number>` | `transform: skewX(<number>deg) skewY(<number>deg);` |
| `-skew-<number>` | `transform: skewX(-<number>deg) skewY(-<number>deg);` |
| `skew-(<custom-property>)` | `transform: skewX(var(<custom-property>)) skewY(var(<custom-property>));` |
| `skew-[<value>]` | `transform: skewX(<value>) skewY(<value>);` |
| `skew-x-<number>` | `transform: skewX(<number>deg));` |
| `-skew-x-<number>` | `transform: skewX(-<number>deg));` |
| `skew-x-(<custom-property>)` | `transform: skewX(var(<custom-property>));` |
| `skew-x-[<value>]` | `transform: skewX(<value>));` |
| `skew-y-<number>` | `transform: skewY(<number>deg);` |
| `-skew-y-<number>` | `transform: skewY(-<number>deg);` |
| `skew-y-(<custom-property>)` | `transform: skewY(var(<custom-property>));` |
| `skew-y-[<value>]` | `transform: skewY(<value>);` |

Use `skew-<number>` utilities like `skew-4` and `skew-10` to skew an element on both axes:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use `-skew-<number>` utilities like `-skew-4` and `-skew-10` to skew an element on both axes:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use `skew-x-<number>` utilities like `skew-x-4` and `-skew-x-10` to skew an element on the x-axis:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-skew-x-12

Use `skew-y-<number>` utilities like `skew-y-4` and `-skew-y-10` to skew an element on the y-axis:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-skew-y-12

Use the `skew-[<value>]` syntaxto set the skew based on a completely custom value:

```
<img class="skew-[3.142rad] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `skew-(<custom-property>)` syntax:

```
<img class="skew-(--my-skew) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `skew-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix `skewX()` and `skewY()` utilitieswith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="skew-3 md:skew-12 ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)