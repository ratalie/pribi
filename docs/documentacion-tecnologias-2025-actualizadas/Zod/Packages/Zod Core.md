---
title: Zod Core
source: https://zod.dev/packages/core
author:
  - "[[For library authors]]"
published:
created: 2025-10-21
description: Zod Core package - minimal core functionality for custom implementations
tags:
  - clippings
updated: 2025-10-21T08:22
---
💎 Zod 4 is now stable! [Read the announcement.](https://zod.dev/v4)

[Edit this page](https://github.com/colinhacks/zod/edit/main/packages/docs/content/packages/core.mdx)

This sub-package exports the core classes and utilities that are consumed by Zod and Zod Mini. It is not intended to be used directly; instead it's designed to be extended by other packages. It implements:

```
import * as z from "zod/v4/core";

 

// the base class for all Zod schemas

z.$ZodType;

 

// subclasses of $ZodType that implement common parsers

z.$ZodString

z.$ZodObject

z.$ZodArray

// ...

 

// the base class for all Zod checks

z.$ZodCheck;

 

// subclasses of $ZodCheck that implement common checks

z.$ZodCheckMinLength

z.$ZodCheckMaxLength

 

// the base class for all Zod errors

z.$ZodError;

 

// issue formats (types only)

{} as z.$ZodIssue;

 

// utils

z.util.isValidJWT(...);
```

## Schemas

The base class for all Zod schemas is `$ZodType`. It accepts two generic parameters: `Output` and `Input`.

```
export class $ZodType<Output = unknown, Input = unknown> {

  _zod: { /* internals */}

}
```

`zod/v4/core` exports a number of subclasses that implement some common parsers. A union of all first-party subclasses is exported as `z.$ZodTypes`.

```
export type $ZodTypes =

  | $ZodString

  | $ZodNumber

  | $ZodBigInt

  | $ZodBoolean

  | $ZodDate

  | $ZodSymbol

  | $ZodUndefined

  | $ZodNullable

  | $ZodNull

  | $ZodAny

  | $ZodUnknown

  | $ZodNever

  | $ZodVoid

  | $ZodArray

  | $ZodObject

  | $ZodUnion // $ZodDiscriminatedUnion extends this

  | $ZodIntersection

  | $ZodTuple

  | $ZodRecord

  | $ZodMap

  | $ZodSet

  | $ZodLiteral

  | $ZodEnum

  | $ZodPromise

  | $ZodLazy

  | $ZodOptional

  | $ZodDefault

  | $ZodTemplateLiteral

  | $ZodCustom

  | $ZodTransform

  | $ZodNonOptional

  | $ZodReadonly

  | $ZodNaN

  | $ZodPipe // $ZodCodec extends this

  | $ZodSuccess

  | $ZodCatch

  | $ZodFile;
```

## Internals

All `zod/v4/core` subclasses only contain a single property: `_zod`. This property is an object containing the schemas *internals*. The goal is to make `zod/v4/core` as extensible and unopinionated as possible. Other libraries can "build their own Zod" on top of these classes without `zod/v4/core` cluttering up the interface. Refer to the implementations of `zod` and `zod/mini` for examples of how to extend these classes.

The `_zod` internals property contains some notable properties:

- `.def` — The schema's *definition*: this is the object you pass into the class's constructor to create an instance. It completely describes the schema, and it's JSON-serializable.
	- `.def.type` — A string representing the schema's type, e.g. `"string"`, `"object"`, `"array"`, etc.
	- `.def.checks` — An array of *checks* that are executed by the schema after parsing.
- `.input` — A virtual property that "stores" the schema's *inferred input type*.
- `.output` — A virtual property that "stores" the schema's *inferred output type*.
- `.run()` — The schema's internal parser implementation.

If you are implementing a tool (say, a code generator) that must traverse Zod schemas, you can cast any schema to `$ZodTypes` and use the `def` property to discriminate between these classes.

```
export function walk(_schema: z.$ZodType) {

  const schema = _schema as z.$ZodTypes;

  const def = schema._zod.def;

  switch (def.type) {

    case "string": {

      // ...

      break;

    }

    case "object": {

      // ...

      break;

    }

  }

}
```

There are a number of subclasses of `$ZodString` that implement various *string formats*. These are exported as `z.$ZodStringFormatTypes`.

```
export type $ZodStringFormatTypes =

  | $ZodGUID

  | $ZodUUID

  | $ZodEmail

  | $ZodURL

  | $ZodEmoji

  | $ZodNanoID

  | $ZodCUID

  | $ZodCUID2

  | $ZodULID

  | $ZodXID

  | $ZodKSUID

  | $ZodISODateTime

  | $ZodISODate

  | $ZodISOTime

  | $ZodISODuration

  | $ZodIPv4

  | $ZodIPv6

  | $ZodCIDRv4

  | $ZodCIDRv6

  | $ZodBase64

  | $ZodBase64URL

  | $ZodE164

  | $ZodJWT
```

## Parsing

As the Zod Core schema classes have no methods, there are top-level functions for parsing data.

```
import * as z from "zod/v4/core";

 

const schema = new z.$ZodString({ type: "string" });

z.parse(schema, "hello");

z.safeParse(schema, "hello");

await z.parseAsync(schema, "hello");

await z.safeParseAsync(schema, "hello");
```

## Checks

Every Zod schema contains an array of *checks*. These perform post-parsing refinements (and occasionally mutations) that *do not affect* the inferred type.

```
const schema = z.string().check(z.email()).check(z.min(5));

// => $ZodString

 

schema._zod.def.checks;

// => [$ZodCheckEmail, $ZodCheckMinLength]
```

The base class for all Zod checks is `$ZodCheck`. It accepts a single generic parameter `T`.

```
export class $ZodCheck<in T = unknown> {

  _zod: { /* internals */}

}
```

The `_zod` internals property contains some notable properties:

- `.def` — The check's *definition*: this is the object you pass into the class's constructor to create the check. It completely describes the check, and it's JSON-serializable.
	- `.def.check` — A string representing the check's type, e.g. `"min_length"`, `"less_than"`, `"string_format"`, etc.
- `.check()` — Contains the check's validation logic.

`zod/v4/core` exports a number of subclasses that perform some common refinements. All first-party subclasses are exported as a union called `z.$ZodChecks`.

```
export type $ZodChecks =

  | $ZodCheckLessThan

  | $ZodCheckGreaterThan

  | $ZodCheckMultipleOf

  | $ZodCheckNumberFormat

  | $ZodCheckBigIntFormat

  | $ZodCheckMaxSize

  | $ZodCheckMinSize

  | $ZodCheckSizeEquals

  | $ZodCheckMaxLength

  | $ZodCheckMinLength

  | $ZodCheckLengthEquals

  | $ZodCheckProperty

  | $ZodCheckMimeType

  | $ZodCheckOverwrite

  | $ZodCheckStringFormat
```

You can use the `._zod.def.check` property to discriminate between these classes.

```
const check = {} as z.$ZodChecks;

const def = check._zod.def;

 

switch (def.check) {

  case "less_than":

  case "greater_than":

    // ...

    break;

}
```

As with schema types, there are a number of subclasses of `$ZodCheckStringFormat` that implement various *string formats*.

```
export type $ZodStringFormatChecks =

  | $ZodCheckRegex

  | $ZodCheckLowerCase

  | $ZodCheckUpperCase

  | $ZodCheckIncludes

  | $ZodCheckStartsWith

  | $ZodCheckEndsWith

  | $ZodGUID

  | $ZodUUID

  | $ZodEmail

  | $ZodURL

  | $ZodEmoji

  | $ZodNanoID

  | $ZodCUID

  | $ZodCUID2

  | $ZodULID

  | $ZodXID

  | $ZodKSUID

  | $ZodISODateTime

  | $ZodISODate

  | $ZodISOTime

  | $ZodISODuration

  | $ZodIPv4

  | $ZodIPv6

  | $ZodCIDRv4

  | $ZodCIDRv6

  | $ZodBase64

  | $ZodBase64URL

  | $ZodE164

  | $ZodJWT;
```

Use a nested `switch` to discriminate between the different string format checks.

```
const check = {} as z.$ZodChecks;

const def = check._zod.def;

 

switch (def.check) {

  case "less_than":

  case "greater_than":

  // ...

  case "string_format":

    {

      const formatCheck = check as z.$ZodStringFormatChecks;

      const formatCheckDef = formatCheck._zod.def;

 

      switch (formatCheckDef.format) {

        case "email":

        case "url":

          // do stuff

      }

    }

    break;

}
```

You'll notice some of these string format *checks* overlap with the string format *types* above. That's because these classes implement both the `$ZodCheck` and `$ZodType` interfaces. That is, they can be used as either a check or a type. In these cases, both `._zod.parse` (the schema parser) and `._zod.check` (the check validation) are executed during parsing. In effect, the instance is prepended to its own `checks` array (though it won't actually exist in `._zod.def.checks`).

```
// as a type

z.email().parse("user@example.com");

 

// as a check

z.string().check(z.email()).parse("user@example.com")
```

## Errors

The base class for all errors in Zod is `$ZodError`.

- The `zod` package implements a subclass of `$ZodError` called `ZodError` with some additional convenience methods.
- The `zod/mini` sub-package directly uses `$ZodError`

```
export class $ZodError<T = unknown> implements Error {

 public issues: $ZodIssue[];

}
```

## Issues

The `issues` property corresponds to an array of `$ZodIssue` objects. All issues extend the `z.$ZodIssueBase` interface.

```
export interface $ZodIssueBase {

  readonly code?: string;

  readonly input?: unknown;

  readonly path: PropertyKey[];

  readonly message: string;

}
```

Zod defines the following issue subtypes:

```
export type $ZodIssue =

  | $ZodIssueInvalidType

  | $ZodIssueTooBig

  | $ZodIssueTooSmall

  | $ZodIssueInvalidStringFormat

  | $ZodIssueNotMultipleOf

  | $ZodIssueUnrecognizedKeys

  | $ZodIssueInvalidUnion

  | $ZodIssueInvalidKey

  | $ZodIssueInvalidElement

  | $ZodIssueInvalidValue

  | $ZodIssueCustom;
```

For details on each type, refer to [the implementation](https://github.com/colinhacks/zod/blob/main/packages/zod/src/v4/core/errors.ts).[Zod Mini](https://zod.dev/packages/mini)

[

Zod Mini - a tree-shakable Zod

](https://zod.dev/packages/mini)