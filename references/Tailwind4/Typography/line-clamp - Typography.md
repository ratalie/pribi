---
title: line-clamp - Typography
source: https://tailwindcss.com/docs/line-clamp
author:
  - "[[@tailwindcss]]"
published: 2020-03-16
created: 2025-10-14
description: Utilities for clamping text to a specific number of lines.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. line-clamp

Typography

## line-clamp

Utilities for clamping text to a specific number of lines.

| Class | Styles |
| --- | --- |
| `line-clamp-<number>` | `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: <number>;` |
| `line-clamp-none` | `overflow: visible; display: block; -webkit-box-orient: horizontal; -webkit-line-clamp: unset;` |
| `line-clamp-(<custom-property>)` | `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(<custom-property>);` |
| `line-clamp-[<value>]` | `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: <value>;` |

Use `line-clamp-<number>` utilities like `line-clamp-2` and `line-clamp-3` to truncate multi-line text after a specific number of lines:

Boost your conversion rate

Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur enim.

Lindsay Walton

```
<article>
  <time>Mar 10, 2020</time>
  <h2>Boost your conversion rate</h2>
  <p class="line-clamp-3">
    Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut
    sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat
    dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt
    ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur
    enim.
  </p>
  <div>
    <img src="/img/lindsay.jpg" />
    Lindsay Walton
  </div>
</article>
```

Use `line-clamp-none` to undo a previously applied line clamp utility:

```
<p class="line-clamp-3 lg:line-clamp-none">
  <!-- ... -->
</p>
```

Use the `line-clamp-[<value>]` syntaxto set the number of lines based on a completely custom value:

```
<p class="line-clamp-[calc(var(--characters)/100)] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `line-clamp-(<custom-property>)` syntax:

```
<p class="line-clamp-(--my-line-count) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `line-clamp-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `line-clamp` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="line-clamp-3 md:line-clamp-4 ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)