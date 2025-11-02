---
title: scroll-padding - Interactivity
source: https://tailwindcss.com/docs/scroll-padding
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's scroll offset within a snap container.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. scroll-padding

Interactivity

## scroll-padding

Utilities for controlling an element's scroll offset within a snap container.

| Class | Styles |
| --- | --- |
| `scroll-p-<number>` | `scroll-padding: calc(var(--spacing) * <number>);` |
| `-scroll-p-<number>` | `scroll-padding: calc(var(--spacing) * -<number>);` |
| `scroll-p-(<custom-property>)` | `scroll-padding: var(<custom-property>);` |
| `scroll-p-[<value>]` | `scroll-padding: <value>;` |
| `scroll-px-<number>` | `scroll-padding-inline: calc(var(--spacing) * <number>);` |
| `-scroll-px-<number>` | `scroll-padding-inline: calc(var(--spacing) * -<number>);` |
| `scroll-px-(<custom-property>)` | `scroll-padding-inline: var(<custom-property>);` |
| `scroll-px-[<value>]` | `scroll-padding-inline: <value>;` |
| `scroll-py-<number>` | `scroll-padding-block: calc(var(--spacing) * <number>);` |
| `-scroll-py-<number>` | `scroll-padding-block: calc(var(--spacing) * -<number>);` |

Use the `scroll-pt-<number>`, `scroll-pr-<number>`, `scroll-pb-<number>`, and `scroll-pl-<number>` utilities like `scroll-pl-4` and `scroll-pt-6` to set the scroll offset of an element within a snap container:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

![](https://tailwindcss.com/img/vacation-01.jpg) ![](https://tailwindcss.com/img/vacation-02.jpg) ![](https://tailwindcss.com/img/vacation-03.jpg) ![](https://tailwindcss.com/img/vacation-04.jpg) ![](https://tailwindcss.com/img/vacation-05.jpg)

Use the `scroll-ps-<number>` and `scroll-pe-<number>` utilities to set the `scroll-padding-inline-start` and `scroll-padding-inline-end` logical properties, which map to either the left or right side based on the text direction:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

Left-to-right

To use a negative scroll padding value, prefix the class name with a dash to convert it to a negative value:

```
<div class="-scroll-ps-6 snap-x ...">
  <!-- ... -->
</div>
```

Use utilities like `scroll-pl-[<value>]` and `scroll-pe-[<value>]` to set the scroll padding based on a completely custom value:

```
<div class="scroll-pl-[24rem] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `scroll-pl-(<custom-property>)` syntax:

```
<div class="scroll-pl-(--my-scroll-padding) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `scroll-pl-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `scroll-padding` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="scroll-p-8 md:scroll-p-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `scroll-p-<number>`,`scroll-px-<number>`,`scroll-py-<number>`,`scroll-ps-<number>`,`scroll-pe-<number>`,`scroll-pt-<number>`,`scroll-pr-<number>`,`scroll-pb-<number>`, and `scroll-pl-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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