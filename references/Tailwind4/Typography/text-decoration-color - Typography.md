---
title: text-decoration-color - Typography
source: https://tailwindcss.com/docs/text-decoration-color
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the color of text decorations.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-decoration-color

Typography

## text-decoration-color

Utilities for controlling the color of text decorations.

| Class | Styles |
| --- | --- |
| `decoration-inherit` | `text-decoration-color: inherit;` |
| `decoration-current` | `text-decoration-color: currentColor;` |
| `decoration-transparent` | `text-decoration-color: transparent;` |
| `decoration-black` | `text-decoration-color: var(--color-black); /* #000 */` |
| `decoration-white` | `text-decoration-color: var(--color-white); /* #fff */` |
| `decoration-red-50` | `text-decoration-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */` |
| `decoration-red-100` | `text-decoration-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */` |
| `decoration-red-200` | `text-decoration-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */` |
| `decoration-red-300` | `text-decoration-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */` |
| `decoration-red-400` | `text-decoration-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */` |

Use utilities like `decoration-sky-500` and `decoration-pink-500` to change the [text decoration](https://tailwindcss.com/docs/text-decoration-line) color of an element:

I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings at [My Company, Inc](https://tailwindcss.com/docs/#). Outside of work, I like to [watch pod-racing](https://tailwindcss.com/docs/#) and have [light-saber](https://tailwindcss.com/docs/#) fights.

```
<p>
  I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500">My Company, Inc</a>. Outside
  of work, I like to <a class="underline decoration-pink-500">watch pod-racing</a>
  and have <a class="underline decoration-indigo-500">light-saber</a> fights.
</p>
```

Use the color opacity modifier to control the text decoration color opacity of an element:

I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings at [My Company, Inc](https://tailwindcss.com/docs/#). Outside of work, I like to [watch pod-racing](https://tailwindcss.com/docs/#) and have [light-saber](https://tailwindcss.com/docs/#) fights.

```
<p>
  I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500/30">My Company, Inc</a>. Outside
  of work, I like to <a class="underline decoration-pink-500/30">watch pod-racing</a>
  and have <a class="underline decoration-indigo-500/30">light-saber</a> fights.
</p>
```

Use the `decoration-[<value>]` syntaxto set the text decoration color based on a completely custom value:

```
<p class="decoration-[#50d71e] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `decoration-(<custom-property>)` syntax:

```
<p class="decoration-(--my-color) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `decoration-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `text-decoration-color` utility with a variant like `hover:*` to only apply the utility in that state:

Hover over the text to see the expected behavior

The [quick brown fox](https://en.wikipedia.org/wiki/The_quick_brown_fox_jumps_over_the_lazy_dog) jumps over the lazy dog.

```
<p>The <a href="..." class="underline hover:decoration-pink-500 ...">quick brown fox</a> jumps over the lazy dog.</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Prefix a `text-decoration-color` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="underline decoration-sky-600 md:decoration-blue-400 ...">
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

Now the `decoration-regal-blue` utility can be used in your markup:

```
<p class="decoration-regal-blue">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)