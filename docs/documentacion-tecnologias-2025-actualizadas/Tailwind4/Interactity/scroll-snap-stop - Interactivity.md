---
title: scroll-snap-stop - Interactivity
source: https://tailwindcss.com/docs/scroll-snap-stop
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling whether you can skip past possible snap positions.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. scroll-snap-stop

Interactivity

## scroll-snap-stop

Utilities for controlling whether you can skip past possible snap positions.

| Class | Styles |
| --- | --- |
| `snap-normal` | `scroll-snap-stop: normal;` |
| `snap-always` | `scroll-snap-stop: always;` |

Use the `snap-always` utility together with the [snap-mandatory](https://tailwindcss.com/docs/scroll-snap-type#mandatory-scroll-snapping) utility to force a snap container to always stop on an element before the user can continue scrolling to the next item:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Use the `snap-normal` utility to allow a snap container to skip past possible scroll snap positions:

Scroll in the grid of images to see the expected behavior

![](https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80)

snap point

Prefix a `scroll-snap-stop` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="snap-always md:snap-normal ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Forcing snap position stops](https://tailwindcss.com/docs/#forcing-snap-position-stops)
	- [Skipping snap position stops](https://tailwindcss.com/docs/#skipping-snap-position-stops)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)

From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)