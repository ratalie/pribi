---
title: columns - Layout
source: https://tailwindcss.com/docs/columns
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the number of columns within an element.
tags:
  - clippings
updated: 2025-10-14T00:03
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. columns

Layout

## columns

Utilities for controlling the number of columns within an element.

| Class | Styles |
| --- | --- |
| `columns-<number>` | `columns: <number>;` |
| `columns-3xs` | `columns: var(--container-3xs); /* 16rem (256px) */` |
| `columns-2xs` | `columns: var(--container-2xs); /* 18rem (288px) */` |
| `columns-xs` | `columns: var(--container-xs); /* 20rem (320px) */` |
| `columns-sm` | `columns: var(--container-sm); /* 24rem (384px) */` |
| `columns-md` | `columns: var(--container-md); /* 28rem (448px) */` |
| `columns-lg` | `columns: var(--container-lg); /* 32rem (512px) */` |
| `columns-xl` | `columns: var(--container-xl); /* 36rem (576px) */` |
| `columns-2xl` | `columns: var(--container-2xl); /* 42rem (672px) */` |
| `columns-3xl` | `columns: var(--container-3xl); /* 48rem (768px) */` |

Use `columns-<number>` utilities like `columns-3` to set the number of columns that should be created for the content within an element:

![](https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80)

![](https://tailwindcss.com/img/mountains-1.jpg) ![](https://tailwindcss.com/img/mountains-2.jpg) ![](https://tailwindcss.com/img/mountains-3.jpg)

The column width will automatically adjust to accommodate the specified number of columns.

Use utilities like `columns-xs` and `columns-sm` to set the ideal column width for the content within an element:

Resize the example to see the expected behavior

![](https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80)

![](https://tailwindcss.com/img/mountains-1.jpg) ![](https://tailwindcss.com/img/mountains-2.jpg) ![](https://tailwindcss.com/img/mountains-3.jpg)

When setting the column width, the number of columns automatically adjusts to ensure they don't get too narrow.

Use the `gap-<width>` utilities to specify the width between columns:

![](https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80)

![](https://tailwindcss.com/img/mountains-1.jpg) ![](https://tailwindcss.com/img/mountains-2.jpg) ![](https://tailwindcss.com/img/mountains-3.jpg)

Learn more about the gap utilities in the [gap documentation](https://tailwindcss.com/docs/gap).

Use the `columns-[<value>]` syntaxto set the columns based on a completely custom value:

```
<div class="columns-[30vw] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `columns-(<custom-property>)` syntax:

```
<div class="columns-(--my-columns) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `columns-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `columns` utilitywith a breakpoint variant like `sm:` to only apply the utility at smallscreen sizes and above:

Resize the example to see the expected behavior

![](https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80)

![](https://tailwindcss.com/img/mountains-1.jpg) ![](https://tailwindcss.com/img/mountains-2.jpg) ![](https://tailwindcss.com/img/mountains-3.jpg)

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--container-*` theme variables to customize the fixed-width columnutilities in your project:

```
@theme {
  --container-4xs: 14rem; 
}
```

Now the `columns-4xs` utility can be used in your markup:

```
<div class="columns-4xs">
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