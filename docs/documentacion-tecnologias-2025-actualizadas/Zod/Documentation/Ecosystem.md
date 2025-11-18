---
title: Ecosystem
source: https://zod.dev/ecosystem
author:
  - "[[For library authors]]"
  - "[[For library authorsGuidelines and best practices for library authors integrating with Zod]]"
published:
created: 2025-10-21
description: Overview of the Zod ecosystem including integrations, tools, and community resources
tags:
  - clippings
updated: 2025-10-21T08:21
---
💎 Zod 4 is now stable! [Read the announcement.](https://zod.dev/v4)

[Edit this page](https://github.com/colinhacks/zod/edit/main/packages/docs/content/ecosystem.mdx)

**Note** — To avoid bloat and confusion, the Ecosystem section has been wiped clean with the release of Zod 4. If you've updated your library to work with Zod 4, please submit a PR to add it back in. For libraries that work with Zod 3, refer to [v3.zod.dev](https://v3.zod.dev/?id=ecosystem).

There are a growing number of tools that are built atop or support Zod natively! If you've built a tool or library on top of Zod, let me know [on Twitter](https://x.com/colinhacks) or [start a Discussion](https://github.com/colinhacks/zod/discussions). I'll add it below and tweet it out.

## Resources

- [Total TypeScript Zod Tutorial](https://www.totaltypescript.com/tutorials/zod) by [@mattpocockuk](https://x.com/mattpocockuk)
- [Fixing TypeScript's Blindspot: Runtime Typechecking](https://www.youtube.com/watch?v=rY_XqfSHock) by [@jherr](https://x.com/jherr)

## API Libraries

| Name | Stars | Description |
| --- | --- | --- |
| [`tRPC`](https://github.com/trpc/trpc) | ⭐️ 38682 | Build end-to-end typesafe APIs without GraphQL. |
| [`oRPC`](https://orpc.unnoq.com/) | ⭐️ 3580 | Typesafe APIs Made Simple |
| [`upfetch`](https://github.com/L-Blondy/up-fetch) | ⭐️ 1304 | Advanced fetch client builder |
| [`nestjs-zod`](https://github.com/BenLorantfy/nestjs-zod) | ⭐️ 863 | Integrate nestjs and zod. Create nestjs DTOs using zod, serialize with zod, and generate OpenAPI documentation from zod schemas |
| [`Express Zod API`](https://github.com/RobinTail/express-zod-api) | ⭐️ 770 | Build Express-based API with I/O validation and middlewares, OpenAPI docs and type-safe client. |
| [`Zod Sockets`](https://github.com/RobinTail/zod-sockets) | ⭐️ 100 | Socket.IO solution with I/O validation, an AsyncAPI generator, and a type-safe events map. |
| [`GQLoom`](https://gqloom.dev/) | ⭐️ 72 | Weave GraphQL schema and resolvers using Zod. |
| [`Zod JSON-RPC`](https://github.com/danscan/zod-jsonrpc) | ⭐️ 14 | Type-safe JSON-RPC 2.0 client/server library using Zod. |

## Form Integrations

| Name | Stars | Description |
| --- | --- | --- |
| [`Superforms`](https://superforms.rocks/) | ⭐️ 2653 | Making SvelteKit forms a pleasure to use! |
| [`conform`](https://conform.guide/api/zod/parseWithZod) | ⭐️ 2459 | A type-safe form validation library utilizing web fundamentals to progressively enhance HTML Forms with full support for server frameworks like Remix and Next.js. |
| [`zod-validation-error`](https://github.com/causaly/zod-validation-error) | ⭐️ 985 | Generate user-friendly error messages from ZodError instances. |
| [`regle`](https://github.com/victorgarciaesgi/regle) | ⭐️ 291 | Headless form validation library for Vue.js. |
| [`svelte-jsonschema-form`](https://x0k.dev/svelte-jsonschema-form/validators/zod4/) | ⭐️ 105 | Svelte 5 library for creating forms based on JSON schema. |
| [`frrm`](https://www.npmjs.com/package/frrm) | ⭐️ 27 | Tiny 0.5kb Zod-based, HTML form abstraction that goes brr. |

## Zod to X

| Name | Stars | Description |
| --- | --- | --- |
| [`prisma-zod-generator`](https://github.com/omar-dulaimi/prisma-zod-generator) | ⭐️ 716 | Generate Zod schemas from Prisma schema with full ZodObject method support |
| [`zod-openapi`](https://github.com/samchungy/zod-openapi) | ⭐️ 546 | Use Zod Schemas to create OpenAPI v3.x documentation |
| [`zod2md`](https://github.com/matejchalk/zod2md) | ⭐️ 124 | Generate Markdown docs from Zod schemas |
| [`@traversable/zod`](https://github.com/traversable/schema/tree/main/packages/zod) | ⭐️ 112 | Build your own "Zod to x" library, or pick one of 25+ off-the-shelf transformers |
| [`fastify-zod-openapi`](https://github.com/samchungy/fastify-zod-openapi) | ⭐️ 111 | Fastify type provider, validation, serialization and @fastify/swagger support for Zod schemas |

## X to Zod

| Name | Stars | Description |
| --- | --- | --- |
| [`orval`](https://github.com/orval-labs/orval) | ⭐️ 4741 | Generate Zod schemas from OpenAPI schemas |
| [`Hey API`](https://heyapi.dev/openapi-ts/plugins/zod) | ⭐️ 3331 | The OpenAPI to TypeScript codegen. Generate clients, SDKs, validators, and more. |
| [`kubb`](https://github.com/kubb-labs/kubb) | ⭐️ 1379 | The ultimate toolkit for working with APIs. |
| [`Prisma Zod Generator`](https://github.com/omar-dulaimi/prisma-zod-generator) | ⭐️ 716 | Generates Zod schemas with input/result/pure variants, minimal/full/custom, selective emit/filtering, single/multi-file output, @zod rules, relation depth guards. |
| [`valype`](https://github.com/yuzheng14/valype) | ⭐️ 57 | Typescript's type definition to runtime validator (including zod). |
| [`DRZL`](https://github.com/use-drzl/drzl) | ⭐️ 56 | Drizzle ORM toolkit that can generate Zod validators from schema(s), plus typed services and strongly typed routers (oRPC/tRPC/etc). |

## Mocking Libraries

| Name | Stars | Description |
| --- | --- | --- |
| [`@traversable/zod-test`](https://github.com/traversable/schema/tree/main/packages/zod-test) | ⭐️ 112 | Random zod schema generator built for fuzz testing; includes generators for both valid and invalid data |
| [`zod-schema-faker`](https://github.com/soc221b/zod-schema-faker) | ⭐️ 85 | Generate mock data from zod schemas. Powered by @faker-js/faker and randexp.js. |
| [`zocker`](https://zocker.sigrist.dev/) | ⭐️ 65 | Generates valid, semantically meaningful data for your Zod schemas. |

## Powered by Zod

| Name | Stars | Description |
| --- | --- | --- |
| [`Composable Functions`](https://github.com/seasonedcc/composable-functions) | ⭐️ 729 | Types and functions to make composition easy and safe. |
| [`zod-config`](https://github.com/alexmarqs/zod-config) | ⭐️ 116 | Load configurations across multiple sources with flexible adapters, ensuring type safety with Zod. |
| [`zod-xlsx`](https://github.com/sidwebworks/zod-xlsx) | ⭐️ 46 | A xlsx based resource validator using Zod schemas for data imports and more |
| [`bupkis`](https://github.com/boneskull/bupkis) | ⭐️ 3 | Uncommonly extensible assertions for the beautiful people |

## Zod Utilities

| Name | Stars | Description |
| --- | --- | --- |
| [`zod-playground`](https://github.com/marilari88/zod-playground) | ⭐️ 104 | Interactive playground for testing and exploring Zod and Zod mini schemas in real-time. |
| [`eslint-plugin-import-zod`](https://github.com/samchungy/eslint-plugin-import-zod) | ⭐️ 42 | ESLint plugin to enforce namespace imports for Zod. |
| [`eslint-plugin-zod-x`](https://github.com/marcalexiei/eslint-plugin-zod-x) | ⭐️ 32 | ESLint plugin that adds custom linting rules to enforce best practices when using Zod |[Codecs](https://zod.dev/codecs)

[

Bidirectional transformations with encode and decode

](https://zod.dev/codecs)