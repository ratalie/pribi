---
title: forced-color-adjust - Accessibility
source: https://tailwindcss.com/docs/forced-color-adjust
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for opting in and out of forced colors.
tags:
  - clippings
updated: 2025-10-14T01:01
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Accessibility
2. forced-color-adjust

Accessibility

## forced-color-adjust

Utilities for opting in and out of forced colors.

| Class | Styles |
| --- | --- |
| `forced-color-adjust-auto` | `forced-color-adjust: auto;` |
| `forced-color-adjust-none` | `forced-color-adjust: none;` |

Use the `forced-color-adjust-none` utility to opt an element out of the colors enforced by forced colors mode. This is useful in situations where enforcing a limited color palette will degrade usability.

Try emulating \`forced-colors: active\` in your developer tools to see the changes

```
<form>
  <img src="/img/shirt.jpg" />
  <div>
    <h3>Basic Tee</h3>
    <h3>$35</h3>
    <fieldset>
      <legend class="sr-only">Choose a color</legend>
      <div class="forced-color-adjust-none ...">
        <label>
          <input class="sr-only" type="radio" name="color-choice" value="White" />
          <span class="sr-only">White</span>
          <span class="size-6 rounded-full border border-black/10 bg-white"></span>
        </label>
        <!-- ... -->
      </div>
    </fieldset>
  </div>
</form>
```

You can also use the [forced colors variant](https://tailwindcss.com/docs/hover-focus-and-other-states#forced-colors) to conditionally add styles when the user has enabled a forced color mode.

Use the `forced-color-adjust-auto` utility to make an element adhere to colors enforced by forced colors mode:

```
<form>
  <fieldset class="forced-color-adjust-none lg:forced-color-adjust-auto ...">
    <legend>Choose a color:</legend>
    <select class="hidden lg:block">
      <option value="White">White</option>
      <option value="Gray">Gray</option>
      <option value="Black">Black</option>
    </select>
    <div class="lg:hidden">
      <label>
        <input class="sr-only" type="radio" name="color-choice" value="White" />
        <!-- ... -->
      </label>
      <!-- ... -->
    </div>
  </fieldset>
</form>
```

This can be useful if you want to undo the `forced-color-adjust-none` utility, for example on a larger screen size.

Prefix a `forced-color-adjust` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="forced-color-adjust-none md:forced-color-adjust-auto ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](https://tailwindcss.com/docs/#quick-reference)
- [Examples](https://tailwindcss.com/docs/#examples)
	- [Opting out of forced colors](https://tailwindcss.com/docs/#opting-out-of-forced-colors)
	- [Restoring forced colors](https://tailwindcss.com/docs/#restoring-forced-colors)
	- [Responsive design](https://tailwindcss.com/docs/#responsive-design)

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)