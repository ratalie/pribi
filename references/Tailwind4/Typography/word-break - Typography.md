---
title: word-break - Typography
source: https://tailwindcss.com/docs/word-break
author:
  - "[[@tailwindcss]]"
published:
created: 2025-10-14
description: Utilities for controlling word breaks in an element.
tags:
  - clippings
updated: 2025-10-14T00:10
---
[Docs](https://tailwindcss.com/docs) [Blog](https://tailwindcss.com/blog) [Showcase](https://tailwindcss.com/showcase) [Sponsor](https://tailwindcss.com/sponsor) [Plus](https://tailwindcss.com/plus?ref=top)

1. Typography
2. word-break

Typography

## word-break

Utilities for controlling word breaks in an element.

| Class | Styles |
| --- | --- |
| `break-normal` | `word-break: normal;` |
| `break-all` | `word-break: break-all;` |
| `break-keep` | `word-break: keep-all;` |

Use the `break-normal` utility to only add line breaks at normal word break points:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="break-normal">The longest word in any of the major...</p>
```

Use the `break-all` utility to add line breaks whenever necessary, without trying to preserve whole words:

The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.

```
<p class="break-all">The longest word in any of the major...</p>
```

Use the `break-keep` utility to prevent line breaks from being applied to Chinese/Japanese/Korean (CJK) text:

抗衡不屈不挠 (kànghéng bùqū bùnáo) 这是一个长词，意思是不畏强暴，奋勇抗争，坚定不移，永不放弃。 这个词通常用来描述那些在面对困难和挑战时坚持自己信念的人， 他们克服一切困难，不屈不挠地追求自己的目标。无论遇到多大的挑战，他们都能够坚持到底，不放弃，最终获得胜利。

```
<p class="break-keep">抗衡不屈不挠...</p>
```

For non-CJK text the `break-keep` utility has the same behavior as the `break-normal` utility.

Prefix a `word-break` utilitywith a breakpoint variant like `md:` to only apply the utility at mediumscreen sizes and above:

```
<p class="break-normal md:break-all ...">
  Lorem ipsum dolor sit amet...
</p>
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