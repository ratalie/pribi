---
title: Getting Started - shadcn/vue
source: https://www.shadcn-vue.com/docs/registry/getting-started.html
author:
published:
created: 2025-10-13
description: Learn how to get setup and run your own component registry.
tags:
  - clippings
updated: 2025-10-13T12:58
---
## Getting Started

Learn how to get setup and run your own component registry.

This guide will walk you through the process of setting up your own component registry.

It assumes you already have a project with components and would like to turn it into a registry.

## registry.json

The `registry.json` file is only required if you're using the `shadcn-vue` CLI to build your registry.

If you're using a different build system, you can skip this step as long as your build system produces valid JSON files that conform to the [registry-item schema specification](https://www.shadcn-vue.com/docs/registry/registry-item-json.html).

### Add a registry.json file

Create a `registry.json` file in the root of your project. Your project can be a Nuxt, Vite, or any other project that supports Vue.

This `registry.json` file must conform to the [registry schema specification](https://www.shadcn-vue.com/docs/registry/registry-json.html).

## Add a registry item

### Create your component

Add your first component. Here's an example of a simple `<HelloWorld />` component:

registry/new-york/HelloWorld/HelloWorld.vue

**Note:** This example places the component in the `registry/new-york` directory. You can place it anywhere in your project as long as you set the correct path in the `registry.json` file and you follow the `registry/[NAME]` directory structure.

### Add your component to the registry

To add your component to the registry, you need to add your component definition to `registry.json`.

You define your registry item by adding a `name`, `type`, `title`, `description` and `files`.

For every file you add, you must specify the `path` and `type` of the file. The `path` is the relative path to the file from the root of your project. The `type` is the type of the file.

You can read more about the registry item schema and file types in the [registry item schema docs](https://www.shadcn-vue.com/docs/registry/registry-item-json.html).

## Build your registry

### Install the shadcn-vue CLI

Note: the `build` command is currently only available in the `shadcn-vue@canary` version of the CLI.

### Add a build script

Add a `registry:build` script to your `package.json` file.

package.json

### Run the build script

Run the build script to generate the registry JSON files.

**Note:** By default, the build script will generate the registry JSON files in `public/r` e.g `public/r/hello-world.json`.

You can change the output directory by passing the `--output` option. See the [shadcn build command](https://www.shadcn-vue.com/docs/cli.html#build) for more information.

## Serve your registry

If you're running your registry on Nuxt, you can now serve your registry by running the `nuxt` server. The command might differ for other frameworks.

Your files will now be served at `http://localhost:3000/r/[NAME].json` eg. `http://localhost:3000/r/hello-world.json`.

## Publish your registry

To make your registry available to other developers, you can publish it by deploying your project to a public URL.

## Adding Auth

The `shadcn-vue` CLI does not offer a built-in way to add auth to your registry. We recommend handling authorization on your registry server.

A common simple approach is to use a `token` query parameter to authenticate requests to your registry. e.g. `http://localhost:3000/r/hello-world.json?token=[SECURE_TOKEN_HERE]`.

Use the secure token to authenticate requests and return a 401 Unauthorized response if the token is invalid. Both the `shadcn` CLI and `Open in v0` will handle the 401 response and display a message to the user.

## Guidelines

Here are some guidelines to follow when building components for a registry.

- Place your registry item in the `registry/[STYLE]/[NAME]` directory. I'm using `new-york` as an example. It can be anything you want as long as it's nested under the `registry` directory.
- The following properties are required for the block definition: `name`, `description`, `type` and `files`.
- Make sure to list all registry dependencies in `registryDependencies`. A registry dependency is the name of the component in the registry eg. `input`, `button`, `card`, etc or a URL to a registry item eg. `http://localhost:3000/r/editor.json`.
- Make sure to list all dependencies in `dependencies`. A dependency is the name of the package in the registry eg. `zod`, `sonner`, etc. To set a version, you can use the `name@version` format eg. `zod@^3.20.0`.
- **Imports should always use the `@/registry` path.** eg. `import { HelloWorld } from "@/registry/new-york/hello-world/hello-world"`
- Ideally, place your files within a registry item in `components`, `hooks`, `lib` directories.

## Install using the CLI

To install a registry item using the `shadcn-vue` CLI, use the `add` command followed by the URL of the registry item.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/registry/getting-started.md)