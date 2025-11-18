---
title: translate - Transforms
source: https://tailwindcss.com/docs/translate
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for translating elements.
tags:
  - clippings
updated: 2025-10-14T00:26
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Transforms
2. translate

Transforms

## translate

Utilities for translating elements.

| Class | Styles |
| --- | --- |
| `translate-<number>` | `translate: calc(var(--spacing) * <number>) calc(var(--spacing) * <number>);` |
| `-translate-<number>` | `translate: calc(var(--spacing) * -<number>) calc(var(--spacing) * -<number>);` |
| `translate-<fraction>` | `translate: calc(<fraction> * 100%) calc(<fraction> * 100%);` |
| `-translate-<fraction>` | `translate: calc(<fraction> * -100%) calc(<fraction> * -100%);` |
| `translate-full` | `translate: 100% 100%;` |
| `-translate-full` | `translate: -100% -100%;` |
| `translate-px` | `translate: 1px 1px;` |
| `-translate-px` | `translate: -1px -1px;` |
| `translate-(<custom-property>)` | `translate: var(<custom-property>) var(<custom-property>);` |
| `translate-[<value>]` | `translate: <value> <value>;` |

Use `translate-<number>` utilities like `translate-2` and `-translate-4` to translate an element on both axes based on the spacing scale:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-translate-6

Use `translate-<fraction>` utilities like `translate-1/4` and `-translate-full` to translate an element on both axes by a percentage of the element's size:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-translate-1/4

Use `translate-x-<number>` or `translate-x-<fraction>` utilities like `translate-x-4` and `translate-x-1/4` to translate an element on the x-axis:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-translate-x-4

Use `translate-y-<number>` or `translate-y-<fraction>` utilities like `translate-y-6` and `translate-y-1/3` to translate an element on the y-axis:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-translate-y-4

Use `translate-z-<number>` utilities like `translate-z-6` and `-translate-z-12` to translate an element on the z-axis:

![](https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=90)

\-translate-z-8

Note that the `translate-z-<number>` utilities require the `transform-3d` utility to be applied to the parent element.

Use the `translate-[<value>]` syntaxto set the translation based on a completely custom value:

```
<img class="translate-[3.142rad] ..." src="/img/mountains.jpg" />
```

For CSS variables, you can also use the `translate-(<custom-property>)` syntax:

```
<img class="translate-(--my-translate) ..." src="/img/mountains.jpg" />
```

This is just a shorthand for `translate-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `translate` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<img class="translate-45 md:translate-60 ..." src="/img/mountains.jpg" />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)](https://www.refactoringui.com/?ref=sidebar)

[From the creators of Tailwind CSS](https://www.refactoringui.com/?ref=sidebar)

[

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)