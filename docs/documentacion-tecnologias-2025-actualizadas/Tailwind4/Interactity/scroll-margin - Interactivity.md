---
title: scroll-margin - Interactivity
source: https://tailwindcss.com/docs/scroll-margin
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the scroll offset around items in a snap container.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. scroll-margin

Interactivity

## scroll-margin

Utilities for controlling the scroll offset around items in a snap container.

| Class | Styles |
| --- | --- |
| `scroll-m-<number>` | `scroll-margin: calc(var(--spacing) * <number>);` |
| `-scroll-m-<number>` | `scroll-margin: calc(var(--spacing) * -<number>);` |
| `scroll-m-(<custom-property>)` | `scroll-margin: var(<custom-property>);` |
| `scroll-m-[<value>]` | `scroll-margin: <value>;` |
| `scroll-mx-<number>` | `scroll-margin-inline: calc(var(--spacing) * <number>);` |
| `-scroll-mx-<number>` | `scroll-margin-inline: calc(var(--spacing) * -<number>);` |
| `scroll-mx-(<custom-property>)` | `scroll-margin-inline: var(<custom-property>);` |
| `scroll-mx-[<value>]` | `scroll-margin-inline: <value>;` |
| `scroll-my-<number>` | `scroll-margin-block: calc(var(--spacing) * <number>);` |
| `-scroll-my-<number>` | `scroll-margin-block: calc(var(--spacing) * -<number>);` |

Use the `scroll-mt-<number>`, `scroll-mr-<number>`, `scroll-mb-<number>`, and `scroll-ml-<number>` utilities like `scroll-ml-4` and `scroll-mt-6` to set the scroll offset around items within a snap container:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

![](https://tailwindcss.com/img/vacation-01.jpg) ![](https://tailwindcss.com/img/vacation-02.jpg) ![](https://tailwindcss.com/img/vacation-03.jpg) ![](https://tailwindcss.com/img/vacation-04.jpg) ![](https://tailwindcss.com/img/vacation-05.jpg)

To use a negative scroll margin value, prefix the class name with a dash to convert it to a negative value:

```
<div class="snap-start -scroll-ml-6 ...">
  <!-- ... -->
</div>
```

Use the `scroll-ms-<number>` and `scroll-me-<number>` utilities to set the `scroll-margin-inline-start` and `scroll-margin-inline-end` [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts), which map to either the left or right side based on the text direction:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

Left-to-right

For more control, you can also use the [LTR and RTL modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support) to conditionally apply specific styles depending on the current text direction.

Use utilities like `scroll-ml-[<value>]` and `scroll-me-[<value>]` to set the scroll margin based on a completely custom value:

```
<div class="scroll-ml-[24rem] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `scroll-ml-(<custom-property>)` syntax:

```
<div class="scroll-ml-(--my-scroll-margin) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `scroll-ml-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `scroll-margin` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="scroll-m-8 md:scroll-m-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `scroll-m-<number>`,`scroll-mx-<number>`,`scroll-my-<number>`,`scroll-ms-<number>`,`scroll-me-<number>`,`scroll-mt-<number>`,`scroll-mr-<number>`,`scroll-mb-<number>`, and `scroll-ml-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

```
@theme {
  --spacing: 1px; 
}
```

Learn more about customizing the spacing scale in the [theme variable documentation](https://tailwindcss.com/docs/theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)