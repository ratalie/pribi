---
title: Item - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/item.html
author:
published:
created: 2025-10-13
description: A versatile component that you can use to display any content.
tags:
  - clippings
updated: 2025-10-13T14:27
---
## Item

A versatile component that you can use to display any content.

The `Item` component is a straightforward flex container that can house nearly any type of content. Use it to display a title, description, and actions. Group it with the `ItemGroup` component to create a list of items.

You can pretty much achieve the same result with the `div` element and some classes, but I've built this so many times that I decided to create a component for it. Now I use it all the time.

## Installation

## Usage

## Item vs Field

Use `Field` if you need to display a form input such as a checkbox, input, radio, or select.

If you only need to display content such as a title, description, and actions, use `Item`.

## Examples

### Variants

### Size

The `Item` component has different sizes for different use cases. For example, you can use the `sm` size for a compact item or the `default` size for a standard item.

### Icon

### Image

### Group

### Link

To render an item as a link, use the `as-child` prop. The hover and focus states will be applied to the anchor element.

## API Reference

### Item

The main component for displaying content with media, title, description, and actions.

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"default" \| "outline" \| "muted"` | `"default"` |
| `size` | `"default" \| "sm"` | `"default"` |
| `as-child` | `boolean` | `false` |

You can use the `as-child` prop to render a custom component as the item, for example a link. The hover and focus states will be applied to the custom component.

### ItemGroup

The `ItemGroup` component is a container that groups related items together with consistent styling.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemSeparator

The `ItemSeparator` component is a separator that separates items in the item group.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemMedia

Use the `ItemMedia` component to display media content such as icons, images, or avatars.

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"default" \| "icon" \| "image"` | `"default"` |
| `class` | `string` |  |

### ItemContent

The `ItemContent` component wraps the title and description of the item.

You can skip `ItemContent` if you only need a title.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemTitle

Use the `ItemTitle` component to display the title of the item.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemDescription

Use the `ItemDescription` component to display the description of the item.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemActions

Use the `ItemActions` component to display action buttons or other interactive elements.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

### ItemHeader

Use the `ItemHeader` component to display a header in the item.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

Use the `ItemFooter` component to display a footer in the item.

| Prop | Type | Default |
| --- | --- | --- |
| `class` | `string` |  |

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/item.md)