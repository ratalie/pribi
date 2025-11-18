---
title: outline-style - Borders
source: https://tailwindcss.com/docs/outline-style
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the style of an element's outline.
tags:
  - clippings
updated: 2025-10-14T00:20
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Borders
2. outline-style

Borders

## outline-style

Utilities for controlling the style of an element's outline.

| Class | Styles |
| --- | --- |
| `outline-solid` | `outline-style: solid;` |
| `outline-dashed` | `outline-style: dashed;` |
| `outline-dotted` | `outline-style: dotted;` |
| `outline-double` | `outline-style: double;` |
| `outline-none` | `outline-style: none;` |
| `outline-hidden` | `outline: 2px solid transparent; outline-offset: 2px;` |

Use utilities like `outline-solid` and `outline-dashed` to set the style of an element's outline:

outline-solid

outline-dashed

outline-dotted

outline-double

```
<button class="outline-2 outline-offset-2 outline-solid ...">Button A</button>
<button class="outline-2 outline-offset-2 outline-dashed ...">Button B</button>
<button class="outline-2 outline-offset-2 outline-dotted ...">Button C</button>
<button class="outline-3 outline-offset-2 outline-double ...">Button D</button>
```

Use the `outline-hidden` utility to hide the default browser outline on focused elements, while still preserving the outline in forced colors mode:

Try emulating \`forced-colors: active\` in your developer tools to see the behavior

```
<input class="focus:border-indigo-600 focus:outline-hidden ..." type="text" />
```

It is highly recommended to apply your own focus styling for accessibility when using this utility.

Use the `outline-none` utility to completely remove the default browser outline on focused elements:

```
<div class="focus-within:outline-2 focus-within:outline-indigo-600 ...">
  <textarea class="outline-none ..." placeholder="Leave a comment..." />
  <button class="..." type="button">Post</button>
</div>
```

It is highly recommended to apply your own focus styling for accessibility when using this utility.

Prefix an `outline-style` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="outline md:outline-dashed ...">
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