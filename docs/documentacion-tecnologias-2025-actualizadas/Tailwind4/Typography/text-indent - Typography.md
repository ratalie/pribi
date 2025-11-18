---
title: text-indent - Typography
source: https://tailwindcss.com/docs/text-indent
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the amount of empty space shown before text in a block.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. text-indent

Typography

## text-indent

Utilities for controlling the amount of empty space shown before text in a block.

| Class | Styles |
| --- | --- |
| `indent-<number>` | `text-indent: calc(var(--spacing) * <number>);` |
| `-indent-<number>` | `text-indent: calc(var(--spacing) * -<number>);` |
| `indent-px` | `text-indent: 1px;` |
| `-indent-px` | `text-indent: -1px;` |
| `indent-(<custom-property>)` | `text-indent: var(<custom-property>);` |
| `indent-[<value>]` | `text-indent: <value>;` |

Use `indent-<number>` utilities like `indent-2` and `indent-8` to set the amount of empty space (indentation) that's shown before text in a block:

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

```
<p class="indent-8">So I started to walk into the water...</p>
```

To use a negative text indent value, prefix the class name with a dash to convert it to a negative value:

So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I *was* a marine biologist.

```
<p class="-indent-8">So I started to walk into the water...</p>
```

Use the `indent-[<value>]` syntaxto set the text indentation based on a completely custom value:

```
<p class="indent-[50%] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `indent-(<custom-property>)` syntax:

```
<p class="indent-(--my-indentation) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `indent-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `text-indent` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="indent-4 md:indent-8 ...">
  Lorem ipsum dolor sit amet...
</p>
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