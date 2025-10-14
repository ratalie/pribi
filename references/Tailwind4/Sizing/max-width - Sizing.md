---
title: max-width - Sizing
source: https://tailwindcss.com/docs/max-width
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for setting the maximum width of an element.
tags:
  - clippings
updated: 2025-10-14T00:07
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Sizing
2. max-width

Sizing

## max-width

Utilities for setting the maximum width of an element.

| Class | Styles |
| --- | --- |
| `max-w-<number>` | `max-width: calc(var(--spacing) * <number>);` |
| `max-w-<fraction>` | `max-width: calc(<fraction> * 100%);` |
| `max-w-3xs` | `max-width: var(--container-3xs); /* 16rem (256px) */` |
| `max-w-2xs` | `max-width: var(--container-2xs); /* 18rem (288px) */` |
| `max-w-xs` | `max-width: var(--container-xs); /* 20rem (320px) */` |
| `max-w-sm` | `max-width: var(--container-sm); /* 24rem (384px) */` |
| `max-w-md` | `max-width: var(--container-md); /* 28rem (448px) */` |
| `max-w-lg` | `max-width: var(--container-lg); /* 32rem (512px) */` |
| `max-w-xl` | `max-width: var(--container-xl); /* 36rem (576px) */` |
| `max-w-2xl` | `max-width: var(--container-2xl); /* 42rem (672px) */` |

Use `max-w-<number>` utilities like `max-w-24` and `max-w-64` to set an element to a fixed maximum width based on the spacing scale:

Resize the example to see the expected behavior

max-w-96

max-w-80

max-w-64

max-w-48

max-w-40

max-w-32

max-w-24

```
<div class="w-full max-w-96 ...">max-w-96</div>
<div class="w-full max-w-80 ...">max-w-80</div>
<div class="w-full max-w-64 ...">max-w-64</div>
<div class="w-full max-w-48 ...">max-w-48</div>
<div class="w-full max-w-40 ...">max-w-40</div>
<div class="w-full max-w-32 ...">max-w-32</div>
<div class="w-full max-w-24 ...">max-w-24</div>
```

Use `max-w-full` or `max-w-<fraction>` utilities like `max-w-1/2` and `max-w-2/5` to give an element a percentage-based maximum width:

Resize the example to see the expected behavior

max-w-9/10

max-w-3/4

max-w-1/2

max-w-1/3

```
<div class="w-full max-w-9/10 ...">max-w-9/10</div>
<div class="w-full max-w-3/4 ...">max-w-3/4</div>
<div class="w-full max-w-1/2 ...">max-w-1/2</div>
<div class="w-full max-w-1/3 ...">max-w-1/3</div>
```

Use utilities like `max-w-sm` and `max-w-xl` to set an element to a fixed maximum width based on the container scale:

Resize the example to see the expected behavior

```
<div class="max-w-md ...">
  <!-- ... -->
</div>
```

Use the `container` utility to set the maximum width of an element to match the `min-width` of the current breakpoint. This is useful if you'd prefer to design for a fixed set of screen sizes instead of trying to accommodate a fully fluid viewport:

```
<div class="container">
  <!-- ... -->
</div>
```

Note that unlike containers you might have used in other frameworks, Tailwind's container does not center itself automatically and does not have any built-in horizontal padding. Use `mx-auto` and the `px-<number>` utilities to add these:

```
<div class="container mx-auto px-4">
  <!-- ... -->
</div>
```

Use the `max-w-[<value>]` syntaxto set the maximum width based on a completely custom value:

```
<div class="max-w-[220px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `max-w-(<custom-property>)` syntax:

```
<div class="max-w-(--my-max-width) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `max-w-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `max-width` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="max-w-sm md:max-w-lg ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

The `max-w-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

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