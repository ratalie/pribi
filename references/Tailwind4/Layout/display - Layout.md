---
title: display - Layout
source: https://tailwindcss.com/docs/display
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the display box type of an element.
tags:
  - clippings
updated: 2025-10-14T00:04
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Layout
2. display

Layout

## display

Utilities for controlling the display box type of an element.

Use the `inline`, `inline-block`, and `block` utilities to control the flow of text and elements:

```
<p>
  When controlling the flow of text, using the CSS property <span class="inline">display: inline</span> will cause the
  text inside the element to wrap normally.
</p>
<p>
  While using the property <span class="inline-block">display: inline-block</span> will wrap the element to prevent the
  text inside from extending beyond its parent.
</p>
<p>
  Lastly, using the property <span class="block">display: block</span> will put the element on its own line and fill its
  parent.
</p>
```

Use the `flow-root` utility to create a block-level element with its own [block formatting context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context):

```
<div class="p-4">
  <div class="flow-root ...">
    <div class="my-4 ...">Well, let me tell you something, ...</div>
  </div>
  <div class="flow-root ...">
    <div class="my-4 ...">Sure, go ahead, laugh if you want...</div>
  </div>
</div>
```

Use the `flex` utility to create a block-level flex container:

```
<div class="flex items-center">
  <img src="path/to/image.jpg" />
  <div>
    <strong>Andrew Alfred</strong>
    <span>Technical advisor</span>
  </div>
</div>
```

Use the `inline-flex` utility to create an inline flex container that flows with text:

Today I spent most of the day researching ways to take advantage of the fact that bottles can be returned for 10 cents in Michigan, but only 5 cents here.Kramer keeps telling me there is no way to make it work, that he has run the numbers on every possible approach, but I just have to believe there's a way to make it work, there's simply too much opportunity here.

```
<p>
  Today I spent most of the day researching ways to ...
  <span class="inline-flex items-baseline">
    <img src="/img/kramer.jpg" class="mx-1 size-5 self-center rounded-full" />
    <span>Kramer</span>
  </span>
  keeps telling me there is no way to make it work, that ...
</p>
```

Use the `grid` utility to create a grid container:

01

02

03

04

05

06

07

08

09

```
<div class="grid grid-cols-3 grid-rows-3 gap-4">
  <!-- ... -->
</div>
```

Use the `inline-grid` utility to create an inline grid container:

01

02

03

04

05

06

01

02

03

04

05

06

```
<span class="inline-grid grid-cols-3 gap-4">
  <span>01</span>
  <span>02</span>
  <span>03</span>
  <span>04</span>
  <span>05</span>
  <span>06</span>
</span>
<span class="inline-grid grid-cols-3 gap-4">
  <span>01</span>
  <span>02</span>
  <span>03</span>
  <span>04</span>
  <span>05</span>
  <span>06</span>
</span>
```

Use the `contents` utility to create a "phantom" container whose children act like direct children of the parent:

01

02

03

04

```
<div class="flex ...">
  <div class="flex-1 ...">01</div>
  <div class="contents">
    <div class="flex-1 ...">02</div>
    <div class="flex-1 ...">03</div>
  </div>
  <div class="flex-1 ...">04</div>
</div>
```

Use the `table`, `table-row`, `table-cell`, `table-caption`, `table-column`, `table-column-group`, `table-header-group`, `table-row-group`, and `table-footer-group` utilities to create elements that behave like their respective table elements:

Use the `hidden` utility to remove an element from the document:

02

03

```
<div class="flex ...">
  <div class="hidden ...">01</div>
  <div>02</div>
  <div>03</div>
</div>
```

To visually hide an element but keep it in the document, use the [visibility](https://tailwindcss.com/docs/visibility#making-elements-invisible) property instead.

Use `sr-only` to hide an element visually without hiding it from screen readers:

```
<a href="#">
  <svg><!-- ... --></svg>
  <span class="sr-only">Settings</span>
</a>
```

Use `not-sr-only` to undo `sr-only`, making an element visible to sighted users as well as screen readers:

```
<a href="#">
  <svg><!-- ... --></svg>
  <span class="sr-only sm:not-sr-only">Settings</span>
</a>
```

This can be useful when you want to visually hide something on small screens but show it on larger screens for example.

Prefix a `display` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="flex md:inline-flex ...">
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