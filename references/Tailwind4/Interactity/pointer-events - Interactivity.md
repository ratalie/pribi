---
title: pointer-events - Interactivity
source: https://tailwindcss.com/docs/pointer-events
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling whether an element responds to pointer events.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. pointer-events

Interactivity

## pointer-events

Utilities for controlling whether an element responds to pointer events.

| Class | Styles |
| --- | --- |
| `pointer-events-auto` | `pointer-events: auto;` |
| `pointer-events-none` | `pointer-events: none;` |

Use the `pointer-events-none` utility to make an element ignore pointer events, like `:hover` and `click` events:

Click the search icons to see the expected behavior

pointer-events-auto

pointer-events-none

```
<div class="relative ...">
  <div class="pointer-events-auto absolute ...">
    <svg class="absolute h-5 w-5 text-gray-400">
      <!-- ... -->
    </svg>
  </div>
  <input type="text" placeholder="Search" class="..." />
</div>

<div class="relative ...">
  <div class="pointer-events-none absolute ...">
    <svg class="absolute h-5 w-5 text-gray-400">
      <!-- ... -->
    </svg>
  </div>
  <input type="text" placeholder="Search" class="..." />
</div>
```

The pointer events will still trigger on child elements and pass-through to elements that are "beneath" the target.

Use the `pointer-events-auto` utility to revert to the default browser behavior for pointer events:

```
<div class="pointer-events-none md:pointer-events-auto ...">
  <!-- ... -->
</div>
```

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Ignoring pointer events](https://tailwindcss.com/docs/#ignoring-pointer-events)
	- [Restoring pointer events](https://tailwindcss.com/docs/#restoring-pointer-events)

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)

From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)