---
title: Carousel - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/carousel.html
author:
published:
created: 2025-10-13
description: A carousel with motion and swipe built using Embla.
tags:
  - clippings
updated: 2025-10-13T14:26
---
## Carousel

A carousel with motion and swipe built using Embla.

[Component Source](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/registry/default/ui/carousel) [API Reference](https://www.embla-carousel.com/api)

## About

The carousel component is built using the [Embla Carousel](https://www.embla-carousel.com/) library.

## Installation

## Usage

## Examples

### Sizes

To set the size of the items, you can use the `basis` utility class on the `<CarouselItem />`.

Example

Example

Responsive

Responsive

### Spacing

To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<CarouselItem />` and a negative `-ml-[VALUE]` on the `<CarouselContent />`.

**Why:** I tried to use the `gap` property or a `grid` layout on the ` CarouselContent` but it required a lot of math and mental effort to get the spacing right. I found `pl-[VALUE]` and `-ml-[VALUE]` utilities much easier to use.  
  
You can always adjust this in your own project if you need to.

Example

Responsive

### Orientation

Use the `orientation` prop to set the orientation of the carousel.

### Thumbnails

## Options

You can pass options to the carousel using the `opts` prop. See the [Embla Carousel docs](https://www.embla-carousel.com/api/options/) for more information.

## API

### Method 1

Use the `@init-api` emit method on `<Carousel />` component to set the instance of the API.

### Method 2

You can access it through setting a template ref on the `<Carousel />` component.

## Events

You can listen to events using the API. To get the API instance use the `@init-api` emit method on the `<Carousel />` component

See the [Embla Carousel docs](https://www.embla-carousel.com/api/events/) for more information on using events.

## Slot Props

You can get the reactive slot props like `carouselRef, canScrollNext..Prev, scrollNext..Prev` using the `v-slot` directive in the `<Carousel v-slot="slotProps" />` component to extend the functionality.

## Plugins

You can use the `plugins` prop to add plugins to the carousel.

See the [Embla Carousel docs](https://www.embla-carousel.com/api/plugins/) for more information on using plugins.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/carousel.md)