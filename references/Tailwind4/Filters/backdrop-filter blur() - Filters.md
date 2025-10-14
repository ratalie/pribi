---
title: "backdrop-filter: blur() - Filters"
source: https://tailwindcss.com/docs/backdrop-filter-blur
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying backdrop blur filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:23
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. blur

Filters

## backdrop-filter: blur()

Utilities for applying backdrop blur filters to an element.

| Class | Styles |
| --- | --- |
| `backdrop-blur-xs` | `backdrop-filter: blur(var(--blur-xs)); /* 4px */` |
| `backdrop-blur-sm` | `backdrop-filter: blur(var(--blur-sm)); /* 8px */` |
| `backdrop-blur-md` | `backdrop-filter: blur(var(--blur-md)); /* 12px */` |
| `backdrop-blur-lg` | `backdrop-filter: blur(var(--blur-lg)); /* 16px */` |
| `backdrop-blur-xl` | `backdrop-filter: blur(var(--blur-xl)); /* 24px */` |
| `backdrop-blur-2xl` | `backdrop-filter: blur(var(--blur-2xl)); /* 40px */` |
| `backdrop-blur-3xl` | `backdrop-filter: blur(var(--blur-3xl)); /* 64px */` |
| `backdrop-blur-none` | `backdrop-filter: ;` |
| `backdrop-blur-(<custom-property>)` | `backdrop-filter: blur(var(<custom-property>));` |
| `backdrop-blur-[<value>]` | `backdrop-filter: blur(<value>);` |

Use utilities like `backdrop-blur-sm` and `backdrop-blur-lg` to control an element’s backdrop blur:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

backdrop-blur-none

Use the `backdrop-blur-[<value>]` syntaxto set the backdrop blur based on a completely custom value:

```
<div class="backdrop-blur-[2px] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `backdrop-blur-(<custom-property>)` syntax:

```
<div class="backdrop-blur-(--my-backdrop-blur) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `backdrop-blur-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `backdrop-filter: blur()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="backdrop-blur-none md:backdrop-blur-lg ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--blur-*` theme variables to customize the backdrop blurutilities in your project:

```
@theme {
  --blur-2xs: 2px; 
}
```

Now the `backdrop-blur-2xs` utility can be used in your markup:

```
<div class="backdrop-blur-2xs">
  <!-- ... -->
</div>
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)