---
title: box-shadow - Effects
source: https://tailwindcss.com/docs/box-shadow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the box shadow of an element.
tags:
  - clippings
updated: 2025-10-14T00:21
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Effects
2. box-shadow

Effects

## box-shadow

Utilities for controlling the box shadow of an element.

| Class | Styles |
| --- | --- |
| `shadow-2xs` | `box-shadow: var(--shadow-2xs); /* 0 1px rgb(0 0 0 / 0.05) */` |
| `shadow-xs` | `box-shadow: var(--shadow-xs); /* 0 1px 2px 0 rgb(0 0 0 / 0.05) */` |
| `shadow-sm` | `box-shadow: var(--shadow-sm); /* 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) */` |
| `shadow-md` | `box-shadow: var(--shadow-md); /* 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) */` |
| `shadow-lg` | `box-shadow: var(--shadow-lg); /* 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) */` |
| `shadow-xl` | `box-shadow: var(--shadow-xl); /* 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) */` |
| `shadow-2xl` | `box-shadow: var(--shadow-2xl); /* 0 25px 50px -12px rgb(0 0 0 / 0.25) */` |
| `shadow-none` | `box-shadow: 0 0 #0000;` |
| `shadow-(<custom-property>)` | `box-shadow: var(<custom-property>);` |
| `shadow-(color:<custom-property>)` | `--tw-shadow-color: var(<custom-property>);` |

Use utilities like `shadow-sm` and `shadow-lg` to apply different sized outer box shadows to an element:

shadow-md

shadow-lg

shadow-xl

```
<div class="shadow-md ..."></div>
<div class="shadow-lg ..."></div>
<div class="shadow-xl ..."></div>
```

Use the opacity modifier to adjust the opacity of the box shadow:

shadow-xl

shadow-xl/20

shadow-xl/30

```
<div class="shadow-xl ..."></div>
<div class="shadow-xl/20 ..."></div>
<div class="shadow-xl/30 ..."></div>
```

The default box shadow opacities are quite low (25% or less), so increasing the opacity (to like 50%) will make the box shadows more pronounced.

Use utilities like `shadow-indigo-500` and `shadow-cyan-500/50` to change the color of a box shadow:

By default colored shadows have an opacity of 100% but you can adjust this using the opacity modifier.

Use utilities like `inset-shadow-xs` and `inset-shadow-sm` to apply an inset box shadow to an element:

inset-shadow-2xs

inset-shadow-xs

inset-shadow-sm

```
<div class="inset-shadow-2xs ..."></div>
<div class="inset-shadow-xs ..."></div>
<div class="inset-shadow-sm ..."></div>
```

You can adjust the opacity of an inset shadow using the opacity modifier, like `inset-shadow-sm/50`. The default inset shadow opacities are quite low (5%), so increasing the opacity (to like 50%) will make the inset shadows more pronounced.

Use utilities like `inset-shadow-indigo-500` and `inset-shadow-cyan-500/50` to change the color of an inset box shadow:

inset-shadow-indigo-500

inset-shadow-indigo-500/50

```
<div class="inset-shadow-sm inset-shadow-indigo-500 ..."></div>
<div class="inset-shadow-sm inset-shadow-indigo-500/50 ..."></div>
```

By default colored shadows have an opacity of 100% but you can adjust this using the opacity modifier.

Use `ring` or `ring-<number>` utilities like `ring-2` and `ring-4` to apply a solid box-shadow to an element:

By default rings match the `currentColor` of the element they are applied to.

Use utilities like `ring-indigo-500` and `ring-cyan-500/50` to change the color of a ring:

By default rings have an opacity of 100% but you can adjust this using the opacity modifier.

Use `inset-ring` or `inset-ring-<number>` utilities like `inset-ring-2` and `inset-ring-4` to apply a solid inset box-shadow to an element:

By default inset rings match the `currentColor` of the element they are applied to.

Use utilities like `inset-ring-indigo-500` and `inset-ring-cyan-500/50` to change the color of an inset ring:

By default inset rings have an opacity of 100% but you can adjust this using the opacity modifier.

Use the `shadow-none`, `inset-shadow-none`,`ring-0`, and `inset-ring-0` utilities to remove an existing box shadow from an element:

shadow-none

```
<div class="shadow-none ..."></div>
```

Use utilities like `shadow-[<value>]`,`inset-shadow-[<value>]`,`ring-[<value>]`, and `inset-ring-[<value>]` to set the box shadow based on a completely custom value:

```
<div class="shadow-[0_35px_35px_rgba(0,0,0,0.25)] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `shadow-(<custom-property>)` syntax:

```
<div class="shadow-(--my-shadow) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `shadow-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `box-shadow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="shadow-none md:shadow-lg ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--shadow-*` theme variables to customize the box shadowutilities in your project:

```
@theme {
  --shadow-3xl: 0 35px 35px rgba(0, 0, 0, 0.25); 
}
```

Now the `shadow-3xl` utility can be used in your markup:

```
<div class="shadow-3xl">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

Use the `--inset-shadow-*` theme variables to customize the inset box shadowutilities in your project:

```
@theme {
  --inset-shadow-md: inset 0 2px 3px rgba(0, 0, 0, 0.25); 
}
```

Now the `inset-shadow-md` utility can be used in your markup:

```
<div class="inset-shadow-md">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

Use the `--color-*` theme variables to customize the colorutilities in your project:

```
@theme {
  --color-regal-blue: #243c5a; 
}
```

Now utilities like `shadow-regal-blue`,`inset-shadow-regal-blue`,`ring-regal-blue`, and `inset-ring-regal-blue` can be used in your markup:

```
<div class="shadow-regal-blue">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)