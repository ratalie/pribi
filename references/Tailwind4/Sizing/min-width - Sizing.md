---
title: min-width - Sizing
source: https://tailwindcss.com/docs/min-width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for setting the minimum width of an element.
tags:
  - clippings
updated: 2025-10-14T00:07
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Sizing
2. min-width

Sizing

## min-width

Utilities for setting the minimum width of an element.

| Class | Styles |
| --- | --- |
| `min-w-<number>` | `min-width: calc(var(--spacing) * <number>);` |
| `min-w-<fraction>` | `min-width: calc(<fraction> * 100%);` |
| `min-w-3xs` | `min-width: var(--container-3xs); /* 16rem (256px) */` |
| `min-w-2xs` | `min-width: var(--container-2xs); /* 18rem (288px) */` |
| `min-w-xs` | `min-width: var(--container-xs); /* 20rem (320px) */` |
| `min-w-sm` | `min-width: var(--container-sm); /* 24rem (384px) */` |
| `min-w-md` | `min-width: var(--container-md); /* 28rem (448px) */` |
| `min-w-lg` | `min-width: var(--container-lg); /* 32rem (512px) */` |
| `min-w-xl` | `min-width: var(--container-xl); /* 36rem (576px) */` |
| `min-w-2xl` | `min-width: var(--container-2xl); /* 42rem (672px) */` |

Use `min-w-<number>` utilities like `min-w-24` and `min-w-64` to set an element to a fixed minimum width based on the spacing scale:

min-w-80

min-w-64

min-w-48

min-w-40

min-w-32

min-w-24

```
<div class="w-20 ...">
  <div class="min-w-80 ...">min-w-80</div>
  <div class="min-w-64 ...">min-w-64</div>
  <div class="min-w-48 ...">min-w-48</div>
  <div class="min-w-40 ...">min-w-40</div>
  <div class="min-w-32 ...">min-w-32</div>
  <div class="min-w-24 ...">min-w-24</div>
</div>
```

Use `min-w-full` or `min-w-<fraction>` utilities like `min-w-1/2` and `min-w-2/5` to give an element a percentage-based minimum width:

min-w-3/4

w-full

```
<div class="flex ...">
  <div class="min-w-3/4 ...">min-w-3/4</div>
  <div class="w-full ...">w-full</div>
</div>
```

Use utilities like `min-w-sm` and `min-w-xl` to set an element to a fixed minimum width based on the container scale:

min-w-xs

min-w-2xs

min-w-3xs

```
<div class="w-40 ...">
  <div class="min-w-lg ...">min-w-lg</div>
  <div class="min-w-md ...">min-w-md</div>
  <div class="min-w-sm ...">min-w-sm</div>
  <div class="min-w-xs ...">min-w-xs</div>
  <div class="min-w-2xs ...">min-w-2xs</div>
  <div class="min-w-3xs ...">min-w-3xs</div>
</div>
```

Use the `min-w-[<value>]` syntaxto set the minimum width based on a completely custom value:

```
<div class="min-w-[220px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `min-w-(<custom-property>)` syntax:

```
<div class="min-w-(--my-min-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `min-w-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `min-width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="w-24 min-w-full md:min-w-0 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `min-w-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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