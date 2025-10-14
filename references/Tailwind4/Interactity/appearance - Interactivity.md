---
title: appearance - Interactivity
source: https://tailwindcss.com/docs/appearance
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for suppressing native form control styling.
tags:
  - clippings
updated: 2025-10-14T00:27
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Interactivity
2. appearance

Interactivity

## appearance

Utilities for suppressing native form control styling.

| Class | Styles |
| --- | --- |
| `appearance-none` | `appearance: none;` |
| `appearance-auto` | `appearance: auto;` |

Use `appearance-none` to reset any browser specific styling on an element:

Default browser styles applied

Remove default browser styles

```
<select>
  <option>Yes</option>
  <option>No</option>
  <option>Maybe</option>
</select>

<div class="grid">
  <select class="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ...">
    <option>Yes</option>
    <option>No</option>
    <option>Maybe</option>
  </select>
  <svg class="pointer-events-none col-start-1 row-start-1 ...">
    <!-- ... -->
  </svg>
</div>
```

This utility is often used when creating custom form components.

Use `appearance-auto` to restore the default browser specific styling on an element:

Try emulating \`forced-colors: active\` in your developer tools to see the difference

```
<label>
  <div>
    <input type="checkbox" class="appearance-none forced-colors:appearance-auto ..." />
    <svg class="invisible peer-checked:visible forced-colors:hidden ...">
      <!-- ... -->
    </svg>
  </div>
  Falls back to default appearance
</label>

<label>
  <div>
    <input type="checkbox" class="appearance-none ..." />
    <svg class="invisible peer-checked:visible ...">
      <!-- ... -->
    </svg>
  </div>
  Keeps custom appearance
</label>
```

This is useful for reverting to the standard browser controls in certain accessibility modes.

Prefix an `appearance` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<select class="appearance-auto md:appearance-none ...">
  <!-- ... -->
</select>
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