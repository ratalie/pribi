---
title: font-stretch - Typography
source: https://tailwindcss.com/docs/font-stretch
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for selecting the width of a font face.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. font-stretch

Typography

## font-stretch

Utilities for selecting the width of a font face.

| Class | Styles |
| --- | --- |
| `font-stretch-ultra-condensed` | `font-stretch: ultra-condensed; /* 50% */` |
| `font-stretch-extra-condensed` | `font-stretch: extra-condensed; /* 62.5% */` |
| `font-stretch-condensed` | `font-stretch: condensed; /* 75% */` |
| `font-stretch-semi-condensed` | `font-stretch: semi-condensed; /* 87.5% */` |
| `font-stretch-normal` | `font-stretch: normal; /* 100% */` |
| `font-stretch-semi-expanded` | `font-stretch: semi-expanded; /* 112.5% */` |
| `font-stretch-expanded` | `font-stretch: expanded; /* 125% */` |
| `font-stretch-extra-expanded` | `font-stretch: extra-expanded; /* 150% */` |
| `font-stretch-ultra-expanded` | `font-stretch: ultra-expanded; /* 200% */` |
| `font-stretch-<percentage>` | `font-stretch: <percentage>;` |
| `font-stretch-(<custom-property>)` | `font-stretch: var(<custom-property>);` |
| `font-stretch-[<value>]` | `font-stretch: <value>;` |

Use utilities like `font-stretch-condensed` and `font-stretch-expanded` to set the width of a font face:

font-stretch-extra-condensed

The quick brown fox jumps over the lazy dog.

font-stretch-condensed

The quick brown fox jumps over the lazy dog.

font-stretch-normal

The quick brown fox jumps over the lazy dog.

font-stretch-expanded

The quick brown fox jumps over the lazy dog.

font-stretch-extra-expanded

The quick brown fox jumps over the lazy dog.

```
<p class="font-stretch-extra-condensed">The quick brown fox...</p>
<p class="font-stretch-condensed">The quick brown fox...</p>
<p class="font-stretch-normal">The quick brown fox...</p>
<p class="font-stretch-expanded">The quick brown fox...</p>
<p class="font-stretch-extra-expanded">The quick brown fox...</p>
```

This only applies to fonts that have multiple width variations available, otherwise the browser selects the closest match.

Use `font-stretch-<percentage>` utilities like `font-stretch-50%` and `font-stretch-125%` to set the width of a font face using a percentage:

font-stretch-50%

The quick brown fox jumps over the lazy dog.

font-stretch-100%

The quick brown fox jumps over the lazy dog.

font-stretch-150%

The quick brown fox jumps over the lazy dog.

```
<p class="font-stretch-50%">The quick brown fox...</p>
<p class="font-stretch-100%">The quick brown fox...</p>
<p class="font-stretch-150%">The quick brown fox...</p>
```

Use the `font-stretch-[<value>]` syntaxto set the font width based on a completely custom value:

```
<p class="font-stretch-[66.66%] ...">
  Lorem ipsum dolor sit amet...
</p>
```

For CSS variables, you can also use the `font-stretch-(<custom-property>)` syntax:

```
<p class="font-stretch-(--my-font-width) ...">
  Lorem ipsum dolor sit amet...
</p>
```

This is just a shorthand for `font-stretch-[var(<custom-property>)]` that adds the `var()` function for you automatically.

Prefix a `font-stretch` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<div class="font-stretch-normal md:font-stretch-expanded ...">
  <!-- ... -->
</div>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)