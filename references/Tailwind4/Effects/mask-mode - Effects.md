---
title: mask-mode - Effects
source: https://tailwindcss.com/docs/mask-mode
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's mask mode.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. mask-mode

Effects

## mask-mode

Utilities for controlling an element's mask mode.

| Class | Styles |
| --- | --- |
| `mask-alpha` | `mask-mode: alpha;` |
| `mask-luminance` | `mask-mode: luminance;` |
| `mask-match` | `mask-mode: match-source;` |

Use the `mask-alpha`, `mask-luminance` and `mask-match` utilities to control the mode of an element's mask:

mask-alpha

mask-luminance

```
<div class="mask-alpha mask-r-from-black mask-r-from-50% mask-r-to-transparent bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-luminance mask-r-from-white mask-r-from-50% mask-r-to-black bg-[url(/img/mountains.jpg)] ..."></div>
```

When using `mask-luminance` the luminance value of the mask determines visibility, so sticking with grayscale colors will produce the most predictable results. With `mask-alpha`, the opacity of the mask determines the visibility of the masked element.

Prefix a `mask-mode` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="mask-alpha md:mask-luminance ...">
  <!-- ... -->
</div>
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