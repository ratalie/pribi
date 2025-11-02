---
title: content - Typography
source: https://tailwindcss.com/docs/content
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the content of the before and after pseudo-elements.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. content

Typography

## content

Utilities for controlling the content of the before and after pseudo-elements.

| Class | Styles |
| --- | --- |
| `content-[<value>]` | `content: <value>;` |
| `content-(<custom-property>)` | `content: var(<custom-property>);` |
| `content-none` | `content: none;` |

Use the `content-[<value>]` syntax, along with the `before` and `after` variants, to set the contents of the `::before` and `::after` pseudo-elements:

Higher resolution means more than just a better-quality image. With a Retina 6K display,[Pro Display XDR](https://www.apple.com/pro-display-xdr/) gives you nearly 40 percent more screen real estate than a 5K display.

```
<p>Higher resolution means more than just a better-quality image. With a
Retina 6K display, <a class="text-blue-600 after:content-['_↗']" href="...">
Pro Display XDR</a> gives you nearly 40 percent more screen real estate than
a 5K display.</p>
```

Use the `content-[attr(<name>)]` syntax to reference a value stored in an attribute using the `attr()` CSS function:

```
<p before="Hello World" class="before:content-[attr(before)] ...">
  <!-- ... -->
</p>
```

Since whitespace denotes the end of a class in HTML, replace any spaces in an arbitrary value with an underscore:

```
<p class="before:content-['Hello_World'] ..."></p>
```

If you need to include an actual underscore, you can do this by escaping it with a backslash:

```
<p class="before:content-['Hello\_World']"></p>
```

Use the `content-(<custom-property>)` syntax to control the contents of the `::before` and `::after` pseudo-elements using a CSS variable:

```
<p class="content-(--my-content)"></p>
```

This is just a shorthand for `content-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `content` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="before:content-['Mobile'] md:before:content-['Desktop'] ..."></p>
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