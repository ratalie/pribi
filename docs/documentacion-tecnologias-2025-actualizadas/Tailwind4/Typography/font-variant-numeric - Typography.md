---
title: font-variant-numeric - Typography
source: https://tailwindcss.com/docs/font-variant-numeric
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling the variant of numbers.
tags:
  - clippings
updated: 2025-10-14T00:09
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. font-variant-numeric

Typography

## font-variant-numeric

Utilities for controlling the variant of numbers.

| Class | Styles |
| --- | --- |
| `normal-nums` | `font-variant-numeric: normal;` |
| `ordinal` | `font-variant-numeric: ordinal;` |
| `slashed-zero` | `font-variant-numeric: slashed-zero;` |
| `lining-nums` | `font-variant-numeric: lining-nums;` |
| `oldstyle-nums` | `font-variant-numeric: oldstyle-nums;` |
| `proportional-nums` | `font-variant-numeric: proportional-nums;` |
| `tabular-nums` | `font-variant-numeric: tabular-nums;` |
| `diagonal-fractions` | `font-variant-numeric: diagonal-fractions;` |
| `stacked-fractions` | `font-variant-numeric: stacked-fractions;` |

Use the `ordinal` utility to enable special glyphs for the ordinal markers in fonts that support them:

1st

```
<p class="ordinal ...">1st</p>
```

Use the `slashed-zero` utility to force a zero with a slash in fonts that support them:

0

```
<p class="slashed-zero ...">0</p>
```

Use the `lining-nums` utility to use numeric glyphs that are aligned by their baseline in fonts that support them:

1234567890

```
<p class="lining-nums ...">1234567890</p>
```

Use the `oldstyle-nums` utility to use numeric glyphs where some numbers have descenders in fonts that support them:

1234567890

```
<p class="oldstyle-nums ...">1234567890</p>
```

Use the `proportional-nums` utility to use numeric glyphs that have proportional widths in fonts that support them:

12121

90909

```
<p class="proportional-nums ...">12121</p>
<p class="proportional-nums ...">90909</p>
```

Use the `tabular-nums` utility to use numeric glyphs that have uniform/tabular widths in fonts that support them:

12121

90909

```
<p class="tabular-nums ...">12121</p>
<p class="tabular-nums ...">90909</p>
```

Use the `diagonal-fractions` utility to replace numbers separated by a slash with common diagonal fractions in fonts that support them:

1/2 3/4 5/6

```
<p class="diagonal-fractions ...">1/2 3/4 5/6</p>
```

Use the `stacked-fractions` utility to replace numbers separated by a slash with common stacked fractions in fonts that support them:

1/2 3/4 5/6

```
<p class="stacked-fractions ...">1/2 3/4 5/6</p>
```

The `font-variant-numeric` utilities are composable so you can enable multiple variants by combining them:

Subtotal

$100.00

Tax

$14.50

Total

$114.50

```
<dl class="...">
  <dt class="...">Subtotal</dt>
  <dd class="text-right slashed-zero tabular-nums ...">$100.00</dd>
  <dt class="...">Tax</dt>
  <dd class="text-right slashed-zero tabular-nums ...">$14.50</dd>
  <dt class="...">Total</dt>
  <dd class="text-right slashed-zero tabular-nums ...">$114.50</dd>
</dl>
```

Use the `normal-nums` property to reset numeric font variants:

```
<p class="slashed-zero tabular-nums md:normal-nums ...">
  <!-- ... -->
</p>
```

Prefix a `font-variant-numeric` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="proportional-nums md:tabular-nums ...">
  Lorem ipsum dolor sit amet...
</p>
```

Learn more about using variants in the [variants documentation](https://tailwindcss.com/docs/hover-focus-and-other-states).

![Build UIs that don’t suck — 5-day mini-course](https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcourse-promo.a67fd268.jpg&w=384&q=75)

5-day mini-course

Build UIs that don’t suck.

Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.

[Get the free course](https://tailwindcss.com/build-uis-that-dont-suck)