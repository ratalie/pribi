---
title: InputGroup - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/input-group.html
author:
published:
created: 2025-10-13
description: Display additional information or actions to an input or textarea.
tags:
  - clippings
updated: 2025-10-13T14:27
---
## InputGroup

Display additional information or actions to an input or textarea.

## Installation

## Usage

## Examples

### Icon

### Text

Display additional text information alongside inputs.

### Button

Add buttons to perform actions within the input group.

Add tooltips to provide additional context or help.

### Textarea

Input groups also work with textarea components. Use `block-start` or `block-end` for alignment.

### Spinner

Show loading indicators while processing input.

### Label

Add labels within input groups to improve accessibility.

Pair input groups with dropdown menus for complex interactions.

### Button Group

Wrap input groups with button groups to create prefixes and suffixes.

### Custom Input

Add the `data-slot="input-group-control"` attribute to your custom input for automatic behavior and focus state handling.

## API Reference

### InputGroup

The main component that wraps inputs and addons.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### InputGroupAddon

Displays icons, text, buttons, or other content alongside inputs.

::info For proper focus navigation, the `InputGroupAddon` component should be placed after the input. Set the `align` prop to position the addon.::

| Prop | Type | Default |
| --- | --- | --- |
| `align` | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `'inline-start'` |
| `class` | `string` |  |

For `<InputGroupInput />`, use the `inline-start` or `inline-end` alignment. For `<InputGroupTextarea />`, use the `block-start` or `block-end` alignment.

The `InputGroupAddon` component can have multiple `InputGroupButton` components and icons.

### InputGroupButton

Displays buttons within input groups.

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"xs" \| "icon-xs" \| "sm" \| "icon-sm"` | "xs" |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | "ghost" |
| `class` | `string` |  |

### InputGroupInput

Replacement for `<Input />` when building input groups. This component has the input group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

All other props are passed through to the underlying `<Input />` component.

### InputGroupTextarea

Replacement for `<Textarea />` when building input groups. This component has the textarea group styles pre-applied and uses the unified `data-slot="input-group-control"` for focus state handling.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

All other props are passed through to the underlying `<Textarea />` component.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/input-group.md)