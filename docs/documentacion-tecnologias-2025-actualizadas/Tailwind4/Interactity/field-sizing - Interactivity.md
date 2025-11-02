---
title: field-sizing - Interactivity
source: https://tailwindcss.com/docs/field-sizing
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the sizing of form controls.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. field-sizing

Interactivity

## field-sizing

Utilities for controlling the sizing of form controls.

| Class | Styles |
| --- | --- |
| `field-sizing-fixed` | `field-sizing: fixed;` |
| `field-sizing-content` | `field-sizing: content;` |

Use the `field-sizing-content` utility to allow a form control to adjust it's size based on the content:

Type in the input below to see the size change

```
<textarea class="field-sizing-content ..." rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

Use the `field-sizing-fixed` utility to make a form control use a fixed size:

Type in the input below to see the size remain the same

```
<textarea class="field-sizing-fixed w-80 ..." rows="2">
  Latex Salesman, Vanderlay Industries
</textarea>
```

Prefix a `field-sizing` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<input class="field-sizing-content md:field-sizing-fixed ..." />
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Sizing based on content](https://tailwindcss.com/docs/#sizing-based-on-content)
	- [Using a fixed size](https://tailwindcss.com/docs/#using-a-fixed-size)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)

From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)