---
title: will-change - Interactivity
source: https://tailwindcss.com/docs/will-change
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for optimizing upcoming animations of elements that are expected to change.
tags:
  - clippings
updated: 2025-10-14T00:28
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. will-change

Interactivity

## will-change

Utilities for optimizing upcoming animations of elements that are expected to change.

| Class | Styles |
| --- | --- |
| `will-change-auto` | `will-change: auto;` |
| `will-change-scroll` | `will-change: scroll-position;` |
| `will-change-contents` | `will-change: contents;` |
| `will-change-transform` | `will-change: transform;` |
| `will-change-<custom-property>` | `will-change: var(<custom-property>);` |
| `will-change-[<value>]` | `will-change: <value>;` |

Use the `will-change-scroll`, `will-change-contents` and `will-change-transform` utilities to optimize an element that's expected to change in the near future by instructing the browser to prepare the necessary animation before it actually begins:

```
<div class="overflow-auto will-change-scroll">
  <!-- ... -->
</div>
```

It's recommended that you apply these utilities just before an element changes, and then remove it shortly after it finishes using `will-change-auto`.

The `will-change` property is intended to be used as a last resort when dealing with **known performance problems**. Avoid using these utilities too much, or simply in anticipation of performance issues, as it could actually cause the page to be less performant.

Use the `will-change-[<value>]` syntaxto set the `will-change` property based on a completely custom value:

```
<div class="will-change-[top,left] ...">
  <!-- ... -->
</div>
```

For CSS variables, you can also use the `will-change-(<custom-property>)` syntax:

```
<div class="will-change-(--my-properties) ...">
  <!-- ... -->
</div>
```

This is just a shorthand for `will-change-[var(<custom-property>)]` that adds the `var()` function for you automatically.

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Optimizing with will change](https://tailwindcss.com/docs/#optimizing-with-will-change)
	- [Using a custom value](https://tailwindcss.com/docs/#using-a-custom-value)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)