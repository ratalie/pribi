---
title: position - Layout
source: https://tailwindcss.com/docs/position
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element is positioned in the document.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. position

Layout

## position

Utilities for controlling how an element is positioned in the document.

| Class | Styles |
| --- | --- |
| `static` | `position: static;` |
| `fixed` | `position: fixed;` |
| `absolute` | `position: absolute;` |
| `relative` | `position: relative;` |
| `sticky` | `position: sticky;` |

Use the `static` utility to position an element according to the normal flow of the document:

Static parent

Absolute child

```
<div class="static ...">
  <p>Static parent</p>
  <div class="absolute bottom-0 left-0 ...">
    <p>Absolute child</p>
  </div>
</div>
```

With statically positioned elements, any [offsets](https://tailwindcss.com/docs/top-right-bottom-left) will be ignored and the element will not act as a position reference for absolutely positioned children.

Use the `relative` utility to position an element according to the normal flow of the document:

Relative parent

Absolute child

```
<div class="relative ...">
  <p>Relative parent</p>
  <div class="absolute bottom-0 left-0 ...">
    <p>Absolute child</p>
  </div>
</div>
```

With relatively position elements, any [offsets](https://tailwindcss.com/docs/top-right-bottom-left) are calculated relative to the element's normal position and the element will act as a position reference for absolutely positioned children.

Use the `absolute` utility to position an element *outside* of the normal flow of the document, causing neighboring elements to act as if the element doesn't exist:

With static positioning

Relative parent

Static parent

Static child?

Static sibling

With absolute positioning

Relative parent

Static parent

Absolute child

Static sibling

```
<div class="static ...">
  <!-- Static parent -->
  <div class="static ..."><p>Static child</p></div>
  <div class="inline-block ..."><p>Static sibling</p></div>
  <!-- Static parent -->
  <div class="absolute ..."><p>Absolute child</p></div>
  <div class="inline-block ..."><p>Static sibling</p></div>
</div>
```

With absolutely positioned elements, any [offsets](https://tailwindcss.com/docs/top-right-bottom-left) are calculated relative to the nearest parent that has a position other than `static`, and the element will act as a position reference for other absolutely positioned children.

Use the `fixed` utility to position an element relative to the browser window:

Scroll this element to see the fixed positioning in action

```
<div class="relative">
  <div class="fixed top-0 right-0 left-0">Contacts</div>
  <div>
    <div>
      <img src="/img/andrew.jpg" />
      <strong>Andrew Alfred</strong>
    </div>
    <div>
      <img src="/img/debra.jpg" />
      <strong>Debra Houston</strong>
    </div>
    <!-- ... -->
  </div>
</div>
```

With fixed positioned elements, any [offsets](https://tailwindcss.com/docs/top-right-bottom-left) are calculated relative to the viewport and the element will act as a position reference for absolutely positioned children:

Use the `sticky` utility to position an element as `relative` until it crosses a specified threshold, then treat it as `fixed` until its parent is off screen:

Scroll this element to see the sticky positioning in action

```
<div>
  <div>
    <div class="sticky top-0 ...">A</div>
    <div>
      <div>
        <img src="/img/andrew.jpg" />
        <strong>Andrew Alfred</strong>
      </div>
      <div>
        <img src="/img/aisha.jpg" />
        <strong>Aisha Houston</strong>
      </div>
      <!-- ... -->
    </div>
  </div>
  <div>
    <div class="sticky top-0">B</div>
    <div>
      <div>
        <img src="/img/bob.jpg" />
        <strong>Bob Alfred</strong>
      </div>
      <!-- ... -->
    </div>
  </div>
  <!-- ... -->
</div>
```

With sticky positioned elements, any [offsets](https://tailwindcss.com/docs/top-right-bottom-left) are calculated relative to the element's normal position and the element will act as a position reference for absolutely positioned children.

Prefix a `position` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="relative md:absolute ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)