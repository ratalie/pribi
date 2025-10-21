---
title: Intro
source: https://zod.dev/
author:
  - "[[For library authors]]"
published:
created: 2025-10-21
description: Introduction to Zod - TypeScript-first schema validation library with static type inference
tags:
  - clippings
updated: 2025-10-21T08:21
---
💎 Zod 4 is now stable! [Read the announcement.](https://zod.dev/v4)

  

Zod 4 is now stable! Read the [release notes here](https://zod.dev/v4).

  
  

## Featured sponsor: Jazz

[

![Jazz logo](https://raw.githubusercontent.com/garden-co/jazz/938f6767e46cdfded60e50d99bf3b533f4809c68/homepage/homepage/public/Zod%20sponsor%20message.png)

](https://jazz.tools/?utm_source=zod)

Interested in featuring?[Get in touch.](https://zod.dev/)

## Introduction

Zod is a TypeScript-first validation library. Using Zod, you can define *schemas* you can use to validate data, from a simple `string` to a complex nested object.

```
import * as z from "zod";

 

const User = z.object({

  name: z.string(),

});

 

// some untrusted data...

const input = { /* stuff */ };

 

// the parsed result is validated and type safe!

const data = User.parse(input);

 

// so you can use it with confidence :)

console.log(data.name);
```

## Features

- Zero external dependencies
- Works in Node.js and all modern browsers
- Tiny: 2kb core bundle (gzipped)
- Immutable API: methods return a new instance
- Concise interface
- Works with TypeScript and plain JS
- Built-in JSON Schema conversion
- Extensive ecosystem

## Installation

```
npm install zod
```

Zod provides an MCP server that can be used by agents to search Zod's docs. To add to your editor, follow [these instructions](https://share.inkeep.com/zod/mcp). Zod also provides an [llms.txt](https://zod.dev/llms.txt) file.

## Requirements

Zod is tested against *TypeScript v5.5* and later. Older versions may work but are not officially supported.

### "strict"

You must enable `strict` mode in your `tsconfig.json`. This is a best practice for all TypeScript projects.

```
// tsconfig.json

{

  // ...

  "compilerOptions": {

    // ...

    "strict": true

  }

}
```

## Ecosystem

Zod has a thriving ecosystem of libraries, tools, and integrations. Refer to the [Ecosystem page](https://zod.dev/ecosystem) for a complete list of libraries that support Zod or are built on top of it.

- [Resources](https://zod.dev/ecosystem?id=resources)
- [API Libraries](https://zod.dev/ecosystem?id=api-libraries)
- [Form Integrations](https://zod.dev/ecosystem?id=form-integrations)
- [Zod to X](https://zod.dev/ecosystem?id=zod-to-x)
- [X to Zod](https://zod.dev/ecosystem?id=x-to-zod)
- [Mocking Libraries](https://zod.dev/ecosystem?id=mocking-libraries)
- [Powered by Zod](https://zod.dev/ecosystem?id=powered-by-zod)

I also contribute to the following projects, which I'd like to highlight:

- [tRPC](https://trpc.io/) - End-to-end typesafe APIs, with support for Zod schemas
- [React Hook Form](https://react-hook-form.com/) - Hook-based form validation with a [Zod resolver](https://react-hook-form.com/docs/useform#resolver)
- [zshy](https://github.com/colinhacks/zshy) - Originally created as Zod's internal build tool. Bundler-free, batteries-included build tool for TypeScript libraries. Powered by `tsc`.

## Sponsors

Sponsorship at any level is appreciated and encouraged. If you built a paid product using Zod, consider one of the [corporate tiers](https://github.com/sponsors/colinhacks).

### Platinum

[![CodeRabbit logo (light theme)](https://github.com/user-attachments/assets/d791bc7d-dc60-4d55-9c31-97779839cb74)](https://www.coderabbit.ai/)

Cut code review time & bugs in half

[coderabbit.ai](https://www.coderabbit.ai/)

  

### Gold

[![Courier logo (light theme)](https://github.com/user-attachments/assets/6b09506a-78de-47e8-a8c1-792efe31910a)](https://www.courier.com/?utm_source=zod&utm_campaign=osssponsors)

The API platform for sending notifications

[courier.com](https://www.courier.com/?utm_source=zod&utm_campaign=osssponsors)

[![Liblab logo (light theme)](https://github.com/user-attachments/assets/3de0b617-5137-49c4-b72d-a033cbe602d8)](https://liblab.com/?utm_source=zod)

Generate better SDKs for your APIs

[liblab.com](https://liblab.com/?utm_source=zod)

[![Neon logo (light theme)](https://github.com/user-attachments/assets/b5799fc8-81ff-4053-a1c3-b29adf85e7a1)](https://neon.tech/)

Serverless Postgres — Ship faster

[neon.tech](https://neon.tech/)

[![Retool logo (light theme)](https://github.com/colinhacks/zod/assets/3084745/5ef4c11b-efeb-4495-90a8-41b83f798600)](https://retool.com/?utm_source=github&utm_medium=referral&utm_campaign=zod)

Build AI apps and workflows with Retool AI

[retool.com](https://retool.com/?utm_source=github&utm_medium=referral&utm_campaign=zod)

[![Speakeasy logo (light theme)](https://r2.zod.dev/Logo_Black.svg)](https://speakeasy.com/?utm_source=zod+docs)

SDKs & Terraform providers for your API

[speakeasy.com](https://speakeasy.com/?utm_source=zod+docs)

  

### Silver

 [![Subtotal logo](https://avatars.githubusercontent.com/u/176449348?s=200&v=4) subtotal.com](https://www.subtotal.com/?utm_source=zod)

 [![Juno logo](https://avatars.githubusercontent.com/u/147273133?s=200&v=4) juno.build](https://juno.build/?utm_source=zod)

 [![Nitric logo](https://avatars.githubusercontent.com/u/72055470?s=200&v=4) nitric.io](https://nitric.io/)

 [![PropelAuth logo](https://avatars.githubusercontent.com/u/89474619?s=200&v=4) propelauth.com](https://www.propelauth.com/)

 [![Cerbos logo](https://avatars.githubusercontent.com/u/80861386?s=200&v=4) cerbos.dev](https://cerbos.dev/)

 [![Scalar logo](https://avatars.githubusercontent.com/u/301879?s=200&v=4) scalar.com](https://scalar.com/)

 [![Trigger.dev logo](https://avatars.githubusercontent.com/u/95297378?s=200&v=4) trigger.dev](https://trigger.dev/)

 [![Transloadit logo](https://avatars.githubusercontent.com/u/125754?s=200&v=4) transloadit.com](https://transloadit.com/?utm_source=zod&utm_medium=referral&utm_campaign=sponsorship&utm_content=github)

 [![Infisical logo](https://avatars.githubusercontent.com/u/107880645?s=200&v=4) infisical.com](https://infisical.com/)

 [![Whop logo](https://avatars.githubusercontent.com/u/91036480?s=200&v=4) whop.com](https://whop.com/)

 [![CryptoJobsList logo](https://avatars.githubusercontent.com/u/36402888?s=200&v=4) cryptojobslist.com](https://cryptojobslist.com/)

 [![Plain logo](https://avatars.githubusercontent.com/u/70170949?s=200&v=4) plain.com](https://plain.com/)

 [![Inngest logo](https://avatars.githubusercontent.com/u/78935958?s=200&v=4) inngest.com](https://inngest.com/)

 [![Storyblok logo](https://avatars.githubusercontent.com/u/13880908?s=200&v=4) storyblok.com](https://storyblok.com/)

 [![Mux logo](https://avatars.githubusercontent.com/u/16199997?s=200&v=4) mux.link/zod](https://mux.link/zod)

  

### Bronze

[![Val Town logo](https://github.com/user-attachments/assets/95305fc4-4da6-4bf8-aea4-bae8f5893e5d)](https://www.val.town/)

[![Route4Me logo](https://avatars.githubusercontent.com/u/7936820?s=200&v=4)](https://www.route4me.com/)

[![Encore logo](https://github.com/colinhacks/zod/assets/3084745/5ad94e73-cd34-4957-9979-37da85fcf9cd)](https://encore.dev/)

[![Replay logo](https://avatars.githubusercontent.com/u/60818315?s=200&v=4)](https://www.replay.io/)

[![Numeric logo](https://i.imgur.com/kTiLtZt.png)](https://www.numeric.io/)

[![Marcato Partners logo](https://avatars.githubusercontent.com/u/84106192?s=200&v=4)](https://marcatopartners.com/)

[![Interval logo](https://avatars.githubusercontent.com/u/67802063?s=200&v=4)](https://interval.com/)

[![Seasoned logo](https://avatars.githubusercontent.com/u/33913103?s=200&v=4)](https://seasoned.cc/)

[![Bamboo Creative logo](https://avatars.githubusercontent.com/u/41406870?v=4)](https://www.bamboocreative.nz/)

[![Jason Laster logo](https://avatars.githubusercontent.com/u/254562?v=4)](https://github.com/jasonLaster)

[![Clipboard logo](https://avatars.githubusercontent.com/u/28880063?s=200&v=4)](https://www.clipboardhealth.com/engineering)

  [Migration guide](https://zod.dev/v4/changelog)

[

Complete changelog and migration guide for upgrading from Zod 3 to Zod 4

](https://zod.dev/v4/changelog)[

Basic usage

Basic usage guide covering schema definition, parsing data, error handling, and type inference

](https://zod.dev/basics)