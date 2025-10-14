---
title: background-size - Backgrounds
source: https://tailwindcss.com/docs/background-size
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the background size of an element's background image.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-size

Backgrounds

## background-size

Utilities for controlling the background size of an element's background image.

| Class | Styles |
| --- | --- |
| `bg-auto` | `background-size: auto;` |
| `bg-cover` | `background-size: cover;` |
| `bg-contain` | `background-size: contain;` |
| `bg-size-(<custom-property>)` | `background-size: var(<custom-property>);` |
| `bg-size-[<value>]` | `background-size: <value>;` |

Use the `bg-cover` utility to scale the background image until it fills the background layer, cropping the image if needed:

```
<div class="bg-[url(/img/mountains.jpg)] bg-cover bg-center"></div>
```

Use the `bg-contain` utility to scale the background image to the outer edges without cropping or stretching:

```
<div class="bg-[url(/img/mountains.jpg)] bg-contain bg-center"></div>
```

Use the `bg-auto` utility to display the background image at its default size:

```
<div class="bg-[url(/img/mountains.jpg)] bg-auto bg-center bg-no-repeat"></div>
```

Use the `bg-size-[<value>]` syntaxto set the background size based on a completely custom value:

```
<div class="bg-size-[auto_100px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `bg-size-(<custom-property>)` syntax:

```
<div class="bg-size-(--my-image-size) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `bg-size-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `background-size` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-auto md:bg-contain ...">
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