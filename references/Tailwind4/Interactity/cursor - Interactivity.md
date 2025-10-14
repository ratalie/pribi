---
title: cursor - Interactivity
source: https://tailwindcss.com/docs/cursor
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the cursor style when hovering over an element.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. cursor

Interactivity

## cursor

Utilities for controlling the cursor style when hovering over an element.

Use utilities like `cursor-pointer` and `cursor-grab` to control which cursor is displayed when hovering over an element:

Hover over each button to see the cursor change

```
<button class="cursor-pointer ...">Submit</button>
<button class="cursor-progress ...">Saving...</button>
<button class="cursor-not-allowed ..." disabled>Confirm</button>
```

Use the `cursor-[<value>]` syntaxto set the cursor based on a completely custom value:

```
<button class="cursor-[url(hand.cur),_pointer] ...">
  <!-- ... -->
</button>
```

For CSS variables, you can also use the `cursor-(<custom-property>)` syntax:

```
<button class="cursor-(--my-cursor) ...">
  <!-- ... -->
</button>
```

This is just a shorthand for `cursor-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `cursor` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<button class="cursor-not-allowed md:cursor-auto ...">
  <!-- ... -->
</button>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)