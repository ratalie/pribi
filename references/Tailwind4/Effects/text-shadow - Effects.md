---
title: text-shadow - Effects
source: https://tailwindcss.com/docs/text-shadow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the shadow of a text element.
tags:
  - clippings
updated: 2025-10-14T00:21
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. text-shadow

Effects

## text-shadow

Utilities for controlling the shadow of a text element.

| Class | Styles |
| --- | --- |
| `text-shadow-2xs` | `text-shadow: var(--text-shadow-2xs); /* 0px 1px 0px rgb(0 0 0 / 0.15) */` |
| `text-shadow-xs` | `text-shadow: var(--text-shadow-xs); /* 0px 1px 1px rgb(0 0 0 / 0.2) */` |
| `text-shadow-sm` | `text-shadow: var(--text-shadow-sm); /* 0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075) */` |
| `text-shadow-md` | `text-shadow: var(--text-shadow-md); /* 0px 1px 1px rgb(0 0 0 / 0.1), 0px 1px 2px rgb(0 0 0 / 0.1), 0px 2px 4px rgb(0 0 0 / 0.1) */` |
| `text-shadow-lg` | `text-shadow: var(--text-shadow-lg); /* 0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1) */` |
| `text-shadow-none` | `text-shadow: none;` |
| `text-shadow-(<custom-property>)` | `text-shadow: var(<custom-property>);` |
| `text-shadow-(color:<custom-property>)` | `--tw-shadow-color var(<custom-property>);` |
| `text-shadow-[<value>]` | `text-shadow: <value>;` |
| `text-shadow-inherit` | `--tw-shadow-color inherit;` |

Use utilities like `text-shadow-sm` and `shadow-lg` to apply different sized text shadows to a text element:

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

```
<p class="text-shadow-2xs ...">The quick brown fox...</p>
<p class="text-shadow-xs ...">The quick brown fox...</p>
<p class="text-shadow-sm ...">The quick brown fox...</p>
<p class="text-shadow-md ...">The quick brown fox...</p>
<p class="text-shadow-lg ...">The quick brown fox...</p>
```

Use the opacity modifier to adjust the opacity of the text shadow:

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

The quick brown fox jumps over the lazy dog.

```
<p class="text-shadow-lg ...">The quick brown fox...</p>
<p class="text-shadow-lg/20 ...">The quick brown fox...</p>
<p class="text-shadow-lg/30 ...">The quick brown fox...</p>
```

The default text shadow opacities are quite low (20% or less), so increasing the opacity (to like 50%) will make the text shadows more pronounced.

Use utilities like `text-shadow-indigo-500` and `text-shadow-cyan-500/50` to change the color of a text shadow:

```
<button class="text-sky-950 text-shadow-2xs text-shadow-sky-300 ...">Book a demo</button>
<button class="text-gray-950 dark:text-white dark:text-shadow-2xs ...">See pricing</button>
```

By default colored shadows have an opacity of 100% but you can adjust this using the opacity modifier.

Use the `text-shadow-none` utility to remove an existing text shadow from an element:

```
<p class="text-shadow-lg dark:text-shadow-none">
  <!-- ... -->
</p>
```

Use the `text-shadow-[<value>]` syntaxto set the text shadow based on a completely custom value:

```
<p class="text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `text-shadow-(<custom-property>)` syntax:

```
<p class="text-shadow-(--my-text-shadow) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `text-shadow-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `text-shadow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="text-shadow-none md:text-shadow-lg ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--text-shadow-*` theme variables to customize the text shadowutilities in your project:

```
@theme {
  --text-shadow-xl: 0 35px 35px rgb(0, 0, 0 / 0.25); 
}
```

Now the `text-shadow-xl` utility can be used in your markup:

```
<p class="text-shadow-xl">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now the `text-shadow-regal-blue` utility can be used in your markup:

```
<p class="text-shadow-regal-blue">
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