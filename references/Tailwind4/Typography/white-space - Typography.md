---
title: white-space - Typography
source: https://tailwindcss.com/docs/white-space
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling an element's white-space property.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. white-space

Typography

## white-space

Utilities for controlling an element's white-space property.

| Class | Styles |
| --- | --- |
| `whitespace-normal` | `white-space: normal;` |
| `whitespace-nowrap` | `white-space: nowrap;` |
| `whitespace-pre` | `white-space: pre;` |
| `whitespace-pre-line` | `white-space: pre-line;` |
| `whitespace-pre-wrap` | `white-space: pre-wrap;` |
| `whitespace-break-spaces` | `white-space: break-spaces;` |

Use the `whitespace-normal` utility to cause text to wrap normally within an element. Newlines and spaces will be collapsed:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="whitespace-normal">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Use the `whitespace-nowrap` utility to prevent text from wrapping within an element. Newlines and spaces will be collapsed:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="overflow-auto whitespace-nowrap">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Use the `whitespace-pre` utility to preserve newlines and spaces within an element. Text will not be wrapped:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="overflow-auto whitespace-pre">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Use the `whitespace-pre-line` utility to preserve newlines but not spaces within an element. Text will be wrapped normally:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="whitespace-pre-line">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Use the `whitespace-pre-wrap` utility to preserve newlines and spaces within an element. Text will be wrapped normally:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="whitespace-pre-wrap">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Use the `whitespace-break-spaces` utility to preserve newlines and spaces within an element. White space at the end of lines will not hang, but will wrap to the next line:

Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.

```
<p class="whitespace-break-spaces">Hey everyone!

It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</p>
```

Prefix a `white-space` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="whitespace-pre md:whitespace-normal ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)