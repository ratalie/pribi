---
title: Zod
source: https://zod.dev/packages/zod
author:
  - "[[For library authors]]"
  - "[[For library authorsGuidelines and best practices for library authors integrating with Zod]]"
published:
created: 2025-10-21
description: Internals and structure of the Zod library
tags:
  - clippings
updated: 2025-10-21T08:22
---
💎 Zod 4 is now stable! [Read the announcement.](https://zod.dev/v4)

[Edit this page](https://github.com/colinhacks/zod/edit/main/packages/docs/content/packages/zod.mdx)

The `zod/v4` package is the "flagship" library of the Zod ecosystem. It strikes a balance between developer experience and bundle size that's ideal for the vast majority of applications.

Zod aims to provide a schema API that maps one-to-one to TypeScript's type system.

```
import * as z from "zod";

 

const schema = z.object({

  name: z.string(),

  age: z.number().int().positive(),

  email: z.string().email(),

});
```

The API relies on methods to provide a concise, chainable, autocomplete-friendly way to define complex types.

```
z.string()

  .min(5)

  .max(10)

  .toLowerCase();
```

All schemas extend the `z.ZodType` base class, which in turn extends `z.$ZodType` from [`zod/v4/core`](https://zod.dev/packages/core). All instance of `ZodType` implement the following methods:[Zod Mini](https://zod.dev/packages/mini)

[

Zod Mini - a tree-shakable Zod

](https://zod.dev/packages/mini)