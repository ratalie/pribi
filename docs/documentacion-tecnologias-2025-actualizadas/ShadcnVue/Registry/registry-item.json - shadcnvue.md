---
title: registry-item.json - shadcn/vue
source: https://www.shadcn-vue.com/docs/registry/registry-item-json.html
author:
  - "[[author ​]]"
  - "[[​]]"
published:
created: 2025-10-13
description: Specification for registry items.
tags:
  - clippings
updated: 2025-10-13T12:58
---
## registry-item.json

Specification for registry items.

The `registry-item.json` schema is used to define your custom registry items.

registry-item.json

## Definitions

You can see the JSON Schema for `registry-item.json` [here](https://shadcn-vue.com/schema/registry-item.json).

### $schema

The `$schema` property is used to specify the schema for the `registry-item.json` file.

registry-item.json

### name

The `name` property is used to specify the name of your registry item.

registry-item.json

A human-readable title for your registry item. Keep it short and descriptive.

registry-item.json

### description

A description of your registry item. This can be longer and more detailed than the `title`.

registry-item.json

### type

The `type` property is used to specify the type of your registry item.

registry-item.json

The following types are supported:

| Type | Description |
| --- | --- |
| `registry:block` | Use for complex components with multiple files. |
| `registry:component` | Use for simple components. |
| `registry:lib` | Use for lib and utils. |
| `registry:hook` | Use for composables (hooks). |
| `registry:ui` | Use for UI components and single-file primitives |
| `registry:page` | Use for page or file-based routes. |
| `registry:file` | Use for miscellaneous files. |

### author

The `author` property is used to specify the author of the registry item.

It can be unique to the registry item or the same as the author of the registry.

registry-item.json

### dependencies

The `dependencies` property is used to specify the dependencies of your registry item. This is for `npm` packages.

Use `@version` to specify the version of your registry item.

registry-item.json

### registryDependencies

Used for registry dependencies. Can be names or URLs.

- For `shadcn/ui` registry items such as `button`, `input`, `select`, etc use the name eg. `['button', 'input', 'select']`.
- For custom registry items use the URL of the registry item eg. `['https://example.com/r/hello-world.json']`.

registry-item.json

Note: The CLI will automatically resolve remote registry dependencies.

### files

The `files` property is used to specify the files of your registry item. Each file has a `path`, `type` and `target` (optional) property.

**The `target` property is required for `registry:page` and `registry:file` types.**

registry-item.json

#### path

The `path` property is used to specify the path to the file in your registry. This path is used by the build script to parse, transform and build the registry JSON payload.

#### type

The `type` property is used to specify the type of the file. See the [type](https://www.shadcn-vue.com/docs/registry/#type) section for more information.

#### target

The `target` property is used to indicate where the file should be placed in a project. This is optional and only required for `registry:page` and `registry:file` types.

By default, the `shadcn-vue` cli will read a project's `components.json` file to determine the target path. For some files, such as routes or config you can specify the target path manually.

Use `~` to refer to the root of the project e.g `~/foo.config.js`.

### tailwind

**DEPRECATED:** Use `cssVars.theme` instead for Tailwind v4 projects.

The `tailwind` property is used for tailwind configuration such as `theme`, `plugins` and `content`.

You can use the `tailwind.config` property to add colors, animations and plugins to your registry item.

registry-item.json

### cssVars

Use to define CSS variables for your registry item.

registry-item.json

### css

Use `css` to add new rules to the project's CSS file eg. `@layer base`, `@layer components`, `@utility`, `@keyframes`, etc.

registry-item.json

### docs

Use `docs` to show custom documentation or message when installing your registry item via the CLI.

registry-item.json

Use `categories` to organize your registry item.

### meta

Use `meta` to add additional metadata to your registry item. You can add any key/value pair that you want to be available to the registry item.

registry-item.json

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/registry/registry-item-json.md)