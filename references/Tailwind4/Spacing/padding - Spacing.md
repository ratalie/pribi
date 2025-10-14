---
title: padding - Spacing
source: https://tailwindcss.com/docs/padding
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's padding.
tags:
  - clippings
updated: 2025-10-14T00:07
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Spacing
2. padding

Spacing

## padding

Utilities for controlling an element's padding.

| Class | Styles |
| --- | --- |
| `p-<number>` | `padding: calc(var(--spacing) * <number>);` |
| `p-px` | `padding: 1px;` |
| `p-(<custom-property>)` | `padding: var(<custom-property>);` |
| `p-[<value>]` | `padding: <value>;` |
| `px-<number>` | `padding-inline: calc(var(--spacing) * <number>);` |
| `px-px` | `padding-inline: 1px;` |
| `px-(<custom-property>)` | `padding-inline: var(<custom-property>);` |
| `px-[<value>]` | `padding-inline: <value>;` |
| `py-<number>` | `padding-block: calc(var(--spacing) * <number>);` |
| `py-px` | `padding-block: 1px;` |

Use `p-<number>` utilities like `p-4` and `p-8` to control the padding on all sides of an element:

p-8

```
<div class="p-8 ...">p-8</div>
```

Use `pt-<number>`, `pr-<number>`, `pb-<number>`, and `pl-<number>` utilities like `pt-6` and `pr-4` to control the padding on one side of an element:

pt-6

pr-4

pb-8

pl-2

```
<div class="pt-6 ...">pt-6</div>
<div class="pr-4 ...">pr-4</div>
<div class="pb-8 ...">pb-8</div>
<div class="pl-2 ...">pl-2</div>
```

Use `px-<number>` utilities like `px-4` and `px-8` to control the horizontal padding of an element:

px-8

```
<div class="px-8 ...">px-8</div>
```

Use `py-<number>` utilities like `py-4` and `py-8` to control the vertical padding of an element:

py-8

```
<div class="py-8 ...">py-8</div>
```

Use `ps-<number>` or `pe-<number>` utilities like `ps-4` and `pe-8` to set the `padding-inline-start` and `padding-inline-end` logical properties, which map to either the left or right side based on the text direction:

Left-to-right

ps-8

pe-8

Right-to-left

ps-8

pe-8

```
<div>
  <div dir="ltr">
    <div class="ps-8 ...">ps-8</div>
    <div class="pe-8 ...">pe-8</div>
  </div>
  <div dir="rtl">
    <div class="ps-8 ...">ps-8</div>
    <div class="pe-8 ...">pe-8</div>
  </div>
</div>
```

For more control, you can also use the [LTR and RTL modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support) to conditionally apply specific styles depending on the current text direction.

Use utilities like `p-[<value>]`,`px-[<value>]`, and `pb-[<value>]` to set the padding based on a completely custom value:

```
<div class="p-[5px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `p-(<custom-property>)` syntax:

```
<div class="p-(--my-padding) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `p-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `padding` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="py-4 md:py-8 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `p-<number>`,`px-<number>`,`py-<number>`,`ps-<number>`,`pe-<number>`,`pt-<number>`,`pr-<number>`,`pb-<number>`, and `pl-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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