---
title: list-style-image - Typography
source: https://tailwindcss.com/docs/list-style-image
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the marker images for list items.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. list-style-image

Typography

## list-style-image

Utilities for controlling the marker images for list items.

| Class | Styles |
| --- | --- |
| `list-image-[<value>]` | `list-style-image: <value>;` |
| `list-image-(<custom-property>)` | `list-style-image: var(<custom-property>);` |
| `list-image-none` | `list-style-image: none;` |

Use the `list-image-[<value>]` syntax to control the marker image for list items:

```
<ul class="list-image-[url(/img/checkmark.png)]">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>
```

Use the `list-image-(<custom-property>)` syntax to control the marker image for list items using a CSS variable:

```
<ul class="list-image-(--my-list-image)">
  <!-- ... -->
</ul>
```

This is just a shorthand for `list-image-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Use the `list-image-none` utility to remove an existing marker image from list items:

```
<ul class="list-image-none">
  <!-- ... -->
</ul>
```

Prefix a `list-style-image` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="list-image-none md:list-image-[url(/img/checkmark.png)] ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Basic example](https://tailwindcss.com/docs/#basic-example)
	- [Using a CSS variable](https://tailwindcss.com/docs/#using-a-css-variable)
	- [Removing a marker image](https://tailwindcss.com/docs/#removing-a-marker-image)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

[![Refactoring UI](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=256&q=75)

From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

> “This is the survival kit I wish I had when I started building apps.”
> 
> Derrick Reimer, SavvyCal

](https://www.refactoringui.com/?ref=sidebar)