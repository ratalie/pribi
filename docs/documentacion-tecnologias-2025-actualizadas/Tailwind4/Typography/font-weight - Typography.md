---
title: font-weight - Typography
source: https://tailwindcss.com/docs/font-weight
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the font weight of an element.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. font-weight

Typography

## font-weight

Utilities for controlling the font weight of an element.

| Class | Styles |
| --- | --- |
| `font-thin` | `font-weight: 100;` |
| `font-extralight` | `font-weight: 200;` |
| `font-light` | `font-weight: 300;` |
| `font-normal` | `font-weight: 400;` |
| `font-medium` | `font-weight: 500;` |
| `font-semibold` | `font-weight: 600;` |
| `font-bold` | `font-weight: 700;` |
| `font-extrabold` | `font-weight: 800;` |
| `font-black` | `font-weight: 900;` |
| `font-(<custom-property>)` | `font-weight: var(<custom-property>);` |
| `font-[<value>]` | `font-weight: <value>;` |

Use utilities like `font-thin` and `font-bold` to set the font weight of an element:

font-light

The quick brown fox jumps over the lazy dog.

font-normal

The quick brown fox jumps over the lazy dog.

font-medium

The quick brown fox jumps over the lazy dog.

font-semibold

The quick brown fox jumps over the lazy dog.

font-bold

The quick brown fox jumps over the lazy dog.

```
<p class="font-light ...">The quick brown fox ...</p>
<p class="font-normal ...">The quick brown fox ...</p>
<p class="font-medium ...">The quick brown fox ...</p>
<p class="font-semibold ...">The quick brown fox ...</p>
<p class="font-bold ...">The quick brown fox ...</p>
```

Use the `font-[<value>]` syntaxto set the font weight based on a completely custom value:

```
<p class="font-[1000] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `font-(weight:<custom-property>)` syntax:

```
<p class="font-(weight:--my-font-weight) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `font-[weight:var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `font-weight` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="font-normal md:font-bold ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--font-weight-*` theme variables to customize the font weightutilities in your project:

```
@theme {
  --font-weight-extrablack: 1000; 
}
```

Now the `font-extrablack` utility can be used in your markup:

```
<div class="font-extrablack">
  <!-- ... -->
</div>
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