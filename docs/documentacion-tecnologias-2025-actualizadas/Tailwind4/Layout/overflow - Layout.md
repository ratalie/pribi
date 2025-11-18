---
title: overflow - Layout
source: https://tailwindcss.com/docs/overflow
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling how an element handles content that is too large for the container.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. overflow

Layout

## overflow

Utilities for controlling how an element handles content that is too large for the container.

| Class | Styles |
| --- | --- |
| `overflow-auto` | `overflow: auto;` |
| `overflow-hidden` | `overflow: hidden;` |
| `overflow-clip` | `overflow: clip;` |
| `overflow-visible` | `overflow: visible;` |
| `overflow-scroll` | `overflow: scroll;` |
| `overflow-x-auto` | `overflow-x: auto;` |
| `overflow-y-auto` | `overflow-y: auto;` |
| `overflow-x-hidden` | `overflow-x: hidden;` |
| `overflow-y-hidden` | `overflow-y: hidden;` |
| `overflow-x-clip` | `overflow-x: clip;` |
| `overflow-y-clip` | `overflow-y: clip;` |
| `overflow-x-visible` | `overflow-x: visible;` |
| `overflow-y-visible` | `overflow-y: visible;` |
| `overflow-x-scroll` | `overflow-x: scroll;` |
| `overflow-y-scroll` | `overflow-y: scroll;` |

Use the `overflow-visible` utility to prevent content within an element from being clipped:

```
<div class="overflow-visible ...">
  <!-- ... -->
</div>
```

Note that any content that overflows the bounds of the element will then be visible.

Use the `overflow-hidden` utility to clip any content within an element that overflows the bounds of that element:

```
<div class="overflow-hidden ...">
  <!-- ... -->
</div>
```

Use the `overflow-auto` utility to add scrollbars to an element in the event that its content overflows the bounds of that element:

Scroll vertically

```
<div class="overflow-auto ...">
  <!-- ... -->
</div>
```

Unlike `overflow-scroll`, which always shows scrollbars, this utility will only show them if scrolling is necessary.

Use the `overflow-x-auto` utility to allow horizontal scrolling if needed:

Scroll horizontally

![](https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80)

Use the `overflow-y-auto` utility to allow vertical scrolling if needed:

Scroll vertically

```
<div class="h-32 overflow-y-auto ...">
  <!-- ... -->
</div>
```

Use the `overflow-x-scroll` utility to allow horizontal scrolling and always show scrollbars unless always-visible scrollbars are disabled by the operating system:

Scroll horizontally

![](https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80)

Use the `overflow-y-scroll` utility to allow vertical scrolling and always show scrollbars unless always-visible scrollbars are disabled by the operating system:

Scroll vertically

```
<div class="overflow-y-scroll ...">
  <!-- ... -->
</div>
```

Use the `overflow-scroll` utility to add scrollbars to an element:

Scroll vertically and horizontally

Sun

Mon

Tue

Wed

Thu

Fri

Sat

5 AM

6 AM

7 AM

8 AM

9 AM

10 AM

11 AM

12 PM

1 PM

2 PM

3 PM

4 PM

5 PM

6 PM

7 PM

8 PM

5 AM Flight to Vancouver Toronto YYZ

6 AM Breakfast Mel's Diner

5 PM 🎉 Party party 🎉 We like to party!

```
<div class="overflow-scroll ...">
  <!-- ... -->
</div>
```

Unlike `overflow-auto`, which only shows scrollbars if they are necessary, this utility always shows them. Note that some operating systems (like macOS) hide unnecessary scrollbars regardless of this setting.

Prefix an `overflow` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="overflow-auto md:overflow-scroll ...">
  <!-- ... -->
</div>
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