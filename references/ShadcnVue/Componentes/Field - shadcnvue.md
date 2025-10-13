---
title: Field - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/field.html
author:
published:
created: 2025-10-13
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
tags:
  - clippings
updated: 2025-10-13T14:26
---
## Field

Combine labels, controls, and help text to compose accessible form fields and grouped inputs.

[Component Source](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/registry/default/examples/DatePickerDemo.vue)

## Installation

## Usage

## Anatomy

The `Field` family is designed for composing accessible forms. A typical field is structured as follows:

- `Field` is the core wrapper for a single field.
- `FieldContent` is a flex column that groups label and description. Not required if you have no description.
- Wrap related fields with `FieldGroup`, and use `FieldSet` with `FieldLegend` for semantic grouping.

## Examples

### Input

### Textarea

### Select

### Slider

### Fieldset

### Checkbox

### Radio

### Switch

### Choice Card

Wrap `Field` components inside `FieldLabel` to create selectable field groups. This works with `RadioItem`, `Checkbox` and `Switch` components.

### Field Group

Stack `Field` components with `FieldGroup`. Add `FieldSeparator` to divide them.

## Responsive Layout

If you are in tailwindcss v3 you need to install [`@tailwindcss/container-queries`](https://github.com/tailwindlabs/tailwindcss-container-queries)

- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field` to align the label and control side-by-side. Pair with `FieldContent` to keep descriptions aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at specific breakpoints.
- Add `data-invalid` to `Field` to switch the entire block into an error state.
- Add `aria-invalid` on the input itself for assistive technologies.
- Render `FieldError` immediately after the control or inside `FieldContent` to keep error messages aligned with the field.

## Accessibility

- `FieldSet` and `FieldLegend` keep related controls grouped for keyboard and assistive tech users.
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend` when combined.
- Apply `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries.

## API Reference

### FieldSet

Container that renders a semantic `fieldset` with spacing presets.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### FieldLegend

Legend element for a `FieldSet`. Switch to the `label` variant to align with label sizing.

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"legend" \| "label"` | `"legend"` |
| `class` | `string` |  |

The `FieldLegend` has two variants: `legend` and `label`. The `label` variant applies label sizing and alignment. Handy if you have nested `FieldSet`.

### FieldGroup

Layout wrapper that stacks `Field` components and enables container queries for responsive orientations.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### Field

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing.

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"vertical" \| "horizontal" \| "responsive"` | `"vertical"` |
| `class` | `string` |  |
| `data-invalid` | `boolean` |  |

### FieldContent

Flex column that groups control and descriptions when the label sits beside the control. Not required if you have no description.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### FieldLabel

Label styled for both direct inputs and nested `Field` children.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |
| `asChild` | `boolean` | `false` |

```bash
vue<FieldLabel for="email">Email</FieldLabel>
```

### FieldTitle

Renders a title with label styling inside `FieldContent`.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### FieldSeparator

Visual divider to separate sections inside a `FieldGroup`. Accepts optional inline content.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### FieldError

Accessible error container that accepts children or an `errors` array (e.g., from `vee-validate`).

| Prop | Type | Default |
| --- | --- | --- |
| `errors` | `Array<{ message?: string } \| undefined>` |  |
| `class` | `string` |  |

When the `errors` array contains multiple messages, the component renders a list automatically.

`FieldError` also accepts issues produced by any validator that implements [Standard Schema](https://standardschema.dev/), including Zod, Valibot, and ArkType. Pass the `issues` array from the schema result directly to render a unified error list across libraries.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/field.md)