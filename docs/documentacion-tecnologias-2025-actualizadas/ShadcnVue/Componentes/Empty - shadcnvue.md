---
title: Empty - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/empty.html
author:
published:
created: 2025-10-13
description: A component to display an empty state.
tags:
  - clippings
updated: 2025-10-13T14:26
---
## Empty

A component to display an empty state.

## Installation

## Usage

## Examples

### Outline

Use the `border` utility class to create a outline empty state.

### Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.

Use the `EmptyMedia` component to display an avatar in the empty state.

Use the `EmptyMedia` component to display an avatar group in the empty state.

### InputGroup

You can add an `InputGroup` component to the `EmptyContent` component.

## API Reference

### Empty

The main component of the empty state. Wraps the `EmptyHeader` and `EmptyContent` components.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### EmptyHeader

The `EmptyHeader` component wraps the empty media, title, and description.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### EmptyMedia

Use the `EmptyMedia` component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"default" \| "icon"` | `default` |
| `class` | `string` |  |

### EmptyTitle

Use the `EmptyTitle` component to display the title of the empty state.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### EmptyDescription

Use the `EmptyDescription` component to display the description of the empty state.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### EmptyContent

Use the `EmptyContent` component to display the content of the empty state such as a button, input or a link.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/empty.md)