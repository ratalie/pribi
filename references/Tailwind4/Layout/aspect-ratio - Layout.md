---
title: aspect-ratio - Layout
source: https://tailwindcss.com/docs/aspect-ratio
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the aspect ratio of an element.
tags:
  - clippings
updated: 2025-10-14T00:03
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. aspect-ratio

Layout

## aspect-ratio

Utilities for controlling the aspect ratio of an element.

| Class | Styles |
| --- | --- |
| `aspect-<ratio>` | `aspect-ratio: <ratio>;` |
| `aspect-square` | `aspect-ratio: 1 / 1;` |
| `aspect-video` | `aspect-ratio: var(--aspect-video); /* 16 / 9 */` |
| `aspect-auto` | `aspect-ratio: auto;` |
| `aspect-(<custom-property>)` | `aspect-ratio: var(<custom-property>);` |
| `aspect-[<value>]` | `aspect-ratio: <value>;` |

Use `aspect-<ratio>` utilities like `aspect-3/2` to give an element a specific aspect ratio:

Resize the example to see the expected behavior

![](https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80)

![](https://tailwindcss.com/img/villas.jpg)

Use the `aspect-video` utility to give a video element a 16 / 9 aspect ratio:

Resize the example to see the expected behavior

![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

```
<iframe class="aspect-video ..." src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

Use the `aspect-[<value>]` syntaxto set the aspect ratio based on a completely custom value:

```
<img class="aspect-[calc(4*3+1)/3] ..." src="/img/villas.jpg" />
```

For CSS variables, you can also use the `aspect-(<custom-property>)` syntax:

```
<img class="aspect-(--my-aspect-ratio) ..." src="/img/villas.jpg" />
```

This is just a shorthand for `aspect-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix an `aspect-ratio` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<iframe class="aspect-video md:aspect-square ..." src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--aspect-*` theme variables to customize the aspect ratioutilities in your project:

```
@theme {
  --aspect-retro: 4 / 3; 
}
```

Now the `aspect-retro` utility can be used in your markup:

```
<iframe class="aspect-retro" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)