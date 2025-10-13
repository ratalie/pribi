---
title: Button Group - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/button-group.html
author:
published:
created: 2025-10-13
description: A container that groups related buttons together with consistent styling.
tags:
  - clippings
updated: 2025-10-13T14:26
---
## Installation

## Usage

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.
- Use `Tab` to navigate between the buttons in the group.
- Use `aria-label` or `aria-labelledby` to label the button group.

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an action.
- Use the `ToggleGroup` component when you want to group buttons that toggle a state.

## Examples

### Orientation

Set the `orientation` prop to change the button group layout.

### Size

Control the size of buttons using the `size` prop on individual buttons.

### Nested

`<ButtonGroup>` components to create button groups with spacing.

### Separator

The `ButtonGroupSeparator` component visually divides buttons within a group.

Buttons with variant `outline` do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

### Split

Create a split button group by adding two buttons separated by a `ButtonGroupSeparator`.

### Input

Wrap an `Input` component with buttons.

### Input Group

Wrap an `InputGroup` component to create complex input layouts.

Create a split button group with a `DropdownMenu` component.

### Select

Pair with a `Select` component.

### Popover

Use with a `Popover` component.

## API Reference

### ButtonGroup

The `ButtonGroup` component is a container that groups related buttons together with consistent styling.

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` |

Nest multiple button groups to create complex layouts with spacing. See the [nested](https://www.shadcn-vue.com/docs/components/#nested) example for more details.

### ButtonGroupSeparator

The `ButtonGroupSeparator` component visually divides buttons within a group.

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` |

### ButtonGroupText

Use this component to display text within a button group.

| Prop | Type | Default |
| --- | --- | --- |
| `as-child` | boolean | `false` |

Use the `as-child` prop to render a custom component as the text, for example a label.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/button-group.md)