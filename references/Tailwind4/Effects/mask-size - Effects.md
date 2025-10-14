---
title: mask-size - Effects
source: https://tailwindcss.com/docs/mask-size
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the size of an element's mask image.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-size

Effects

## mask-size

Utilities for controlling the size of an element's mask image.

| Class | Styles |
| --- | --- |
| `mask-auto` | `mask-size: auto;` |
| `mask-cover` | `mask-size: cover;` |
| `mask-contain` | `mask-size: contain;` |
| `mask-size-(<custom-property>)` | `mask-size: var(<custom-property>);` |
| `mask-size-[<value>]` | `mask-size: <value>;` |

Use the `mask-cover` utility to scale the mask image until it fills the mask layer, cropping the image if needed:

```
<div class="mask-cover mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-contain` utility to scale the mask image to the outer edges without cropping or stretching:

```
<div class="mask-contain mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-auto` utility to display the mask image at its default size:

```
<div class="mask-auto mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
```

Use the `mask-size-[<value>]` syntaxto set the mask image size based on a completely custom value:

```
<div class="mask-size-[auto_100px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `mask-size-(<custom-property>)` syntax:

```
<div class="mask-size-(--my-mask-size) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `mask-size-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `mask-size` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-auto md:mask-contain ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)