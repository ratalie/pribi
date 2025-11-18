---
title: registry.json - shadcn/vue
source: https://www.shadcn-vue.com/docs/registry/registry-json.html
author:
published:
created: 2025-10-13
description: Schema for running your own component registry.
tags:
  - clippings
updated: 2025-10-13T12:58
---
## registry.json

Schema for running your own component registry.

The `registry.json` schema is used to define your custom component registry.

## Definitions

You can see the JSON Schema for `registry.json` [here](https://shadcn-vue.com/schema/registry.json).

### $schema

The `$schema` property is used to specify the schema for the `registry.json` file.

registry.json

### name

The `name` property is used to specify the name of your registry. This is used for data attributes and other metadata.

registry.json

### homepage

The homepage of your registry. This is used for data attributes and other metadata.

### items

The `items` in your registry. Each item must implement the [registry-item schema specification](https://shadcn-vue.com/schema/registry-item.json).

registry.json

See the [registry-item schema documentation](https://www.shadcn-vue.com/docs/registry/registry-item-json.html) for more information.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/registry/registry-json.md)

Original text

Rate this translation

Your feedback will be used to help improve Google Translate