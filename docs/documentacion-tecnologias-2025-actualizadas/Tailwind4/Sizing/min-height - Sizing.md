---
title: min-height - Sizing
source: https://tailwindcss.com/docs/min-height
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for setting the minimum height of an element.
tags:
  - clippings
updated: 2025-10-14T00:07
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Sizing
2. min-height

Sizing

## min-height

Utilities for setting the minimum height of an element.

| Class | Styles |
| --- | --- |
| `min-h-<number>` | `min-height: calc(var(--spacing) * <number>);` |
| `min-h-<fraction>` | `min-height: calc(<fraction> * 100%);` |
| `min-h-px` | `min-height: 1px;` |
| `min-h-full` | `min-height: 100%;` |
| `min-h-screen` | `min-height: 100vh;` |
| `min-h-dvh` | `min-height: 100dvh;` |
| `min-h-dvw` | `min-height: 100dvw;` |
| `min-h-lvh` | `min-height: 100lvh;` |
| `min-h-lvw` | `min-height: 100lvw;` |
| `min-h-svw` | `min-height: 100svw;` |

Use `min-h-<number>` utilities like `min-h-24` and `min-h-64` to set an element to a fixed minimum height based on the spacing scale:

min-h-96

min-h-80

min-h-64

min-h-48

min-h-40

min-h-32

min-h-24

```
<div class="h-20 ...">
  <div class="min-h-80 ...">min-h-80</div>
  <div class="min-h-64 ...">min-h-64</div>
  <div class="min-h-48 ...">min-h-48</div>
  <div class="min-h-40 ...">min-h-40</div>
  <div class="min-h-32 ...">min-h-32</div>
  <div class="min-h-24 ...">min-h-24</div>
</div>
```

Use `min-h-full` or `min-h-<fraction>` utilities like `min-h-1/2`, and `min-h-2/5` to give an element a percentage-based minimum height:

min-h-full

min-h-9/10

min-h-3/4

min-h-1/2

min-h-1/3

```
<div class="min-h-full ...">min-h-full</div>
<div class="min-h-9/10 ...">min-h-9/10</div>
<div class="min-h-3/4 ...">min-h-3/4</div>
<div class="min-h-1/2 ...">min-h-1/2</div>
<div class="min-h-1/3 ...">min-h-1/3</div>
```

Use the `min-h-[<value>]` syntaxto set the minimum height based on a completely custom value:

```
<div class="min-h-[220px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `min-h-(<custom-property>)` syntax:

```
<div class="min-h-(--my-min-height) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `min-h-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `min-height` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="h-24 min-h-0 md:min-h-full ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `min-h-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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