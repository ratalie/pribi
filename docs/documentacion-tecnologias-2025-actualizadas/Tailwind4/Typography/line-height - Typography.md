---
title: line-height - Typography
source: https://tailwindcss.com/docs/line-height
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the leading, or line height, of an element.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. line-height

Typography

## line-height

Utilities for controlling the leading, or line height, of an element.

| Class | Styles |
| --- | --- |
| `text-<size>/<number>` | `font-size: <size>; line-height: calc(var(--spacing) * <number>);` |
| `text-<size>/(<custom-property>)` | `font-size: <size>; line-height: var(<custom-property>);` |
| `text-<size>/[<value>]` | `font-size: <size>; line-height: <value>;` |
| `leading-none` | `line-height: 1;` |
| `leading-<number>` | `line-height: calc(var(--spacing) * <number>);` |
| `leading-(<custom-property>)` | `line-height: var(<custom-property>);` |
| `leading-[<value>]` | `line-height: <value>;` |

Use font size utilities like `text-sm/6` and `text-lg/7` to set the font size and line-height of an element at the same time:

text-sm/6

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

text-sm/7

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

text-sm/8

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

```
<p class="text-base/6 ...">So I started to walk into the water...</p>
<p class="text-base/7 ...">So I started to walk into the water...</p>
<p class="text-base/8 ...">So I started to walk into the water...</p>
```

Each font size utility also sets a default line height when one isn't provided. You can learn more about these values and how to customize them in the [font-size documentation](https://tailwindcss.com/docs/font-size).

Use `leading-<number>` utilities like `leading-6` and `leading-7` to set the line height of an element independent of the font-size:

leading-6

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

leading-7

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

leading-8

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

```
<p class="text-sm leading-6">So I started to walk into the water...</p>
<p class="text-sm leading-7">So I started to walk into the water...</p>
<p class="text-sm leading-8">So I started to walk into the water...</p>
```

Use the `leading-none` utility to set the line height of an element equal to its font size:

The quick brown fox jumps over the lazy dog.

```
<p class="text-2xl leading-none ...">The quick brown fox...</p>
```

Use the `leading-[<value>]` syntaxto set the line height based on a completely custom value:

```
<p class="leading-[1.5] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `leading-(<custom-property>)` syntax:

```
<p class="leading-(--my-line-height) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `leading-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `line-height` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="leading-5 md:leading-6 ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `leading-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

```
@theme {
  --spacing: 1px; 
}
```

Learn more about customizing the spacing scale in the [theme variable documentation](https://tailwindcss.com/docs/theme).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)