---
title: background-attachment - Backgrounds
source: https://tailwindcss.com/docs/background-attachment
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how a background image behaves when scrolling.
tags:
  - clippings
updated: 2025-10-14T00:11
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Backgrounds
2. background-attachment

Backgrounds

## background-attachment

Utilities for controlling how a background image behaves when scrolling.

| Class | Styles |
| --- | --- |
| `bg-fixed` | `background-attachment: fixed;` |
| `bg-local` | `background-attachment: local;` |
| `bg-scroll` | `background-attachment: scroll;` |

Use the `bg-fixed` utility to fix the background image relative to the viewport:

Scroll the content to see the background image fixed in place

My trip to the summit

November 16, 2021 · 4 min read

Maybe we can live without libraries, people like you and me. Maybe. Sure, we're too old to change the world, but what about that kid, sitting down, opening a book, right now, in a branch at the local library and finding drawings of pee-pees and wee-wees on the Cat in the Hat and the Five Chinese Brothers? Doesn't HE deserve better?

Look. If you think this is about overdue fines and missing books, you'd better think again. This is about that kid's right to read a book without getting his mind warped! Or: maybe that turns you on, Seinfeld; maybe that's how y'get your kicks. You and your good-time buddies.

```
<div class="bg-[url(/img/mountains.jpg)] bg-fixed ...">
  <!-- ... -->
</div>
```

Use the `bg-local` utility to scroll the background image with the container and the viewport:

Scroll the content to see the background image scroll with the container

Because the mail never stops. It just keeps coming and coming and coming, there's never a let-up. It's relentless. Every day it piles up more and more and more. And you gotta get it out but the more you get it out the more it keeps coming in. And then the barcode reader breaks and it's Publisher's Clearing House day.

— Newman

```
<div class="bg-[url(/img/mountains.jpg)] bg-local ...">
  <!-- ... -->
</div>
```

Use the `bg-scroll` utility to scroll the background image with the viewport, but not with the container:

Scroll the content to see the background image fixed in the container

Because the mail never stops. It just keeps coming and coming and coming, there's never a let-up. It's relentless. Every day it piles up more and more and more. And you gotta get it out but the more you get it out the more it keeps coming in. And then the barcode reader breaks and it's Publisher's Clearing House day.

— Newman

```
<div class="bg-[url(/img/mountains.jpg)] bg-scroll ...">
  <!-- ... -->
</div>
```

Prefix a `background-attachment` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="bg-local md:bg-fixed ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Fixing the background image](https://tailwindcss.com/docs/#fixing-the-background-image)
	- [Scrolling with the container](https://tailwindcss.com/docs/#scrolling-with-the-container)
	- [Scrolling with the viewport](https://tailwindcss.com/docs/#scrolling-with-the-viewport)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)