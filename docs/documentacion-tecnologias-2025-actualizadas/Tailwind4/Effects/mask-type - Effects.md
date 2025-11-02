---
title: mask-type - Effects
source: https://tailwindcss.com/docs/mask-type
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an SVG mask is interpreted.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-type

Effects

## mask-type

Utilities for controlling how an SVG mask is interpreted.

| Class | Styles |
| --- | --- |
| `mask-type-alpha` | `mask-type: alpha;` |
| `mask-type-luminance` | `mask-type: luminance;` |

Use the `mask-type-alpha` and `mask-type-luminance` utilities to control the type of an SVG mask:

mask-type-alpha

mask-type-luminance

```
<svg>
  <mask id="blob1" class="mask-type-alpha fill-gray-700/70">
    <path d="..."></path>
  </mask>
  <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob1)" />
</svg>

<svg>
  <mask id="blob2" class="mask-type-luminance fill-gray-700/70">
    <path d="..."></path>
  </mask>
  <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob2)" />
</svg>
```

When using `mask-type-luminance` the luminance value of the SVG mask determines visibility, so sticking with grayscale colors will produce the most predictable results. With `mask-alpha`, the opacity of the SVG mask determines the visibility of the masked element.

Prefix a `mask-type` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<mask class="mask-type-alpha md:mask-type-luminance ...">
  <!-- ... -->
</mask>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)