---
title: width - Sizing
source: https://tailwindcss.com/docs/width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for setting the width of an element.
tags:
  - clippings
updated: 2025-10-14T00:07
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Sizing
2. width

Sizing

## width

Utilities for setting the width of an element.

| Class | Styles |
| --- | --- |
| `w-<number>` | `width: calc(var(--spacing) * <number>);` |
| `w-<fraction>` | `width: calc(<fraction> * 100%);` |
| `w-3xs` | `width: var(--container-3xs); /* 16rem (256px) */` |
| `w-2xs` | `width: var(--container-2xs); /* 18rem (288px) */` |
| `w-xs` | `width: var(--container-xs); /* 20rem (320px) */` |
| `w-sm` | `width: var(--container-sm); /* 24rem (384px) */` |
| `w-md` | `width: var(--container-md); /* 28rem (448px) */` |
| `w-lg` | `width: var(--container-lg); /* 32rem (512px) */` |
| `w-xl` | `width: var(--container-xl); /* 36rem (576px) */` |
| `w-2xl` | `width: var(--container-2xl); /* 42rem (672px) */` |

Use `w-<number>` utilities like `w-24` and `w-64` to set an element to a fixed width based on the spacing scale:

w-48

w-40

w-32

w-24

```
<div class="w-96 ...">w-96</div>
<div class="w-80 ...">w-80</div>
<div class="w-64 ...">w-64</div>
<div class="w-48 ...">w-48</div>
<div class="w-40 ...">w-40</div>
<div class="w-32 ...">w-32</div>
<div class="w-24 ...">w-24</div>
```

Use `w-full` or `w-<fraction>` utilities like `w-1/2` and `w-2/5` to give an element a percentage-based width:

w-1/2

w-1/2

w-2/5

w-3/5

w-1/3

w-2/3

w-full

```
<div class="flex ...">
  <div class="w-1/2 ...">w-1/2</div>
  <div class="w-1/2 ...">w-1/2</div>
</div>
<div class="flex ...">
  <div class="w-2/5 ...">w-2/5</div>
  <div class="w-3/5 ...">w-3/5</div>
</div>
<div class="flex ...">
  <div class="w-1/3 ...">w-1/3</div>
  <div class="w-2/3 ...">w-2/3</div>
</div>
<div class="flex ...">
  <div class="w-1/4 ...">w-1/4</div>
  <div class="w-3/4 ...">w-3/4</div>
</div>
<div class="flex ...">
  <div class="w-1/5 ...">w-1/5</div>
  <div class="w-4/5 ...">w-4/5</div>
</div>
<div class="flex ...">
  <div class="w-1/6 ...">w-1/6</div>
  <div class="w-5/6 ...">w-5/6</div>
</div>
<div class="w-full ...">w-full</div>
```

Use utilities like `w-sm` and `w-xl` to set an element to a fixed width based on the container scale:

w-sm

w-xs

w-2xs

w-3xs

```
<div class="w-xl ...">w-xl</div>
<div class="w-lg ...">w-lg</div>
<div class="w-md ...">w-md</div>
<div class="w-sm ...">w-sm</div>
<div class="w-xs ...">w-xs</div>
<div class="w-2xs ...">w-2xs</div>
<div class="w-3xs ...">w-3xs</div>
```

Use the `w-screen` utility to make an element span the entire width of the viewport:

```
<div class="w-screen">
  <!-- ... -->
</div>
```

Alternatively, you can match the width of the large, small or dynamic viewports using the `w-lvw`, `w-svw`, and `w-dvw` utilities.

Use the `w-auto` utility to remove an element's assigned width under a specific condition, like at a particular breakpoint:

```
<div class="w-full md:w-auto">
  <!-- ... -->
</div>
```

Use utilities like `size-px`, `size-4`, and `size-full` to set both the width and height of an element at the same time:

size-16

size-20

size-24

```
<div class="size-16 ...">size-16</div>
<div class="size-20 ...">size-20</div>
<div class="size-24 ...">size-24</div>
<div class="size-32 ...">size-32</div>
<div class="size-40 ...">size-40</div>
```

Use the `w-[<value>]` syntaxto set the width based on a completely custom value:

```
<div class="w-[5px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `w-(<custom-property>)` syntax:

```
<div class="w-(--my-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `w-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="w-1/2 md:w-full ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `w-<number>` and `size-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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