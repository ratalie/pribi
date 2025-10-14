---
title: "filter: blur() - Filters"
source: https://tailwindcss.com/docs/filter-blur
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for applying blur filters to an element.
tags:
  - clippings
updated: 2025-10-14T00:22
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Filters
2. blur

Filters

## filter: blur()

Utilities for applying blur filters to an element.

| Class | Styles |
| --- | --- |
| `blur-xs` | `filter: blur(var(--blur-xs)); /* 4px */` |
| `blur-sm` | `filter: blur(var(--blur-sm)); /* 8px */` |
| `blur-md` | `filter: blur(var(--blur-md)); /* 12px */` |
| `blur-lg` | `filter: blur(var(--blur-lg)); /* 16px */` |
| `blur-xl` | `filter: blur(var(--blur-xl)); /* 24px */` |
| `blur-2xl` | `filter: blur(var(--blur-2xl)); /* 40px */` |
| `blur-3xl` | `filter: blur(var(--blur-3xl)); /* 64px */` |
| `blur-none` | `filter: ;` |
| `blur-(<custom-property>)` | `filter: blur(var(<custom-property>));` |
| `blur-[<value>]` | `filter: blur(<value>);` |

Use utilities like `blur-sm` and `blur-lg` to blur an element:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

Use the `blur-[<value>]` syntaxto set the blur based on a completely custom value:

```
<img class="blur-[2px] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `blur-(<custom-property>)` syntax:

```
<img class="blur-(--my-blur) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `blur-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `filter: blur()` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="blur-none md:blur-lg ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

Use the `--blur-*` theme variables to customize the blurutilities in your project:

```
@theme {
  --blur-2xs: 2px; 
}
```

Now the `blur-2xs` utility can be used in your markup:

```
<img class="blur-2xs" src="/img/mountains.jpg" />
```

Learn more about customizing your theme in the [theme documentation](https://tailwindcss.com/docs/theme#customizing-your-theme).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)