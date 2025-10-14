---
title: color - Typography
source: https://tailwindcss.com/docs/color
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the text color of an element.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. color

Typography

## color

Utilities for controlling the text color of an element.

| Class | Styles |
| --- | --- |
| `text-inherit` | `color: inherit;` |
| `text-current` | `color: currentColor;` |
| `text-transparent` | `color: transparent;` |
| `text-black` | `color: var(--color-black); /* #000 */` |
| `text-white` | `color: var(--color-white); /* #fff */` |
| `text-red-50` | `color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `text-red-100` | `color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `text-red-200` | `color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `text-red-300` | `color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |
| `text-red-400` | `color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */` |

Use utilities like `text-blue-600` and `text-sky-400` to control the text color of an element:

The quick brown fox jumps over the lazy dog.

```
<p class="text-blue-600 dark:text-sky-400">The quick brown fox...</p>
```

Use the color opacity modifier to control the text color opacity of an element:

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

```
<p class="text-blue-600/100 dark:text-sky-400/100">The quick brown fox...</p>
<p class="text-blue-600/75 dark:text-sky-400/75">The quick brown fox...</p>
<p class="text-blue-600/50 dark:text-sky-400/50">The quick brown fox...</p>
<p class="text-blue-600/25 dark:text-sky-400/25">The quick brown fox...</p>
```

Use the `text-[<value>]` syntaxto set the text color based on a completely custom value:

```
<p class="text-[#50d71e] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `text-(<custom-property>)` syntax:

```
<p class="text-(--my-color) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `text-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `color` utility with a variant like `hover:*` to only apply the utility in that state:

Hover over the text to see the expected behavior

Oh I gotta get on that [internet](https://en.wikipedia.org/wiki/Internet), I'm late on everything!

```
<p class="...">
  Oh I gotta get on that
  <a class="underline hover:text-blue-600 dark:hover:text-blue-400" href="https://en.wikipedia.org/wiki/Internet">internet</a>,
  I'm late on everything!
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Prefix a `color` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="text-blue-600 md:text-green-600 ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now the `text-regal-blue` utility can be used in your markup:

```
<p class="text-regal-blue">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)