---
title: Changelog - shadcn/vue
source: https://www.shadcn-vue.com/docs/changelog.html
author:
published:
created: 2025-10-13
description: Latest updates and announcements.
tags:
  - clippings
updated: 2025-10-13T13:08
---
## Changelog

Latest updates and announcements.

## February 2025 - Reka UI & npx shadcn-vue@latest init

We've updated the latest registry to support Reka UI instead of Radix Vue.

The updated CLI is now available. You can now install components, themes, composables, utils and more using `npx shadcn-vue add`.

This is a major step towards distributing code that you and your LLMs can access and use.

⚠️

With the release of [Reka UI v2](https://reka-ui.com/), `shadcn-vue@latest` command will now install Reka UI. If you want to keep using [Radix Vue](https://radix-vue.com/), please visit [here](https://radix.shadcn-vue.com/) and run `shadcn-vue@radix` command instead. To continue using the CLI, you will also need to update previous `$schema` value in your configuration to point to `https://radix.shadcn-vue.com/schema.json`.

1. First up, when you init into a new app, we update your existing Tailwind files instead of overriding.
2. A component now ship its own dependencies. Take the accordion for example, it can define its Tailwind keyframes. When you add it to your project, we’ll update your tailwind.config.ts file accordingly.
3. You can also install remote components using url. `npx shadcn-vue add https://acme.com/registry/navbar.json`.
1. We have created a new schema that you can use to ship your own component registry. And since it has support for urls, you can even use it to distribute private components.
2. And a few more updates like better error handling and monorepo support.

You can try the new cli today.

### Update Your Project

### Update components.json

To update an existing project to use the new CLI, update your `components.json` file to include import aliases for your **components**, **utils**, **ui**, **lib** and **composables**.

components.json

If you're using a different import alias prefix eg `~`, replace `@` with your prefix.

### Run add components

In order to perform Radix Vue to Reka UI migration easily, you can run `add` command for all your existing components.

If you're using custom component, you need to migrate them [manually](https://reka-ui.com/docs/guides/migration).

## June 2024

### New Component - Number Field

A new component has been added to the project [`NumberField`](https://www.shadcn-vue.com/docs/components/number-field.html).

A number field allows a user to enter a number and increment or decrement the value using stepper buttons.

## May 2024

### New Component - Charts

Several kinds of chart components has been added to the project.

Charts are versatile visualization tools, allowing users to represent data using various options for effective analysis.

1. [`Area Chart`](https://www.shadcn-vue.com/docs/charts/area.html) - An area chart visually represents data over time, displaying trends and patterns through filled-in areas under a line graph.
1. [`Bar Chart`](https://www.shadcn-vue.com/docs/charts/bar.html) - A line chart visually represents data using rectangular bars of varying lengths to compare quantities across different categories or groups.
1. [`Donut Chart`](https://www.shadcn-vue.com/docs/charts/donut.html) - A line chart visually represents data in a circular form, similar to a pie chart but with a central void, emphasizing proportions within categories.
1. [`Line Chart`](https://www.shadcn-vue.com/docs/charts/line.html) - A line chart visually displays data points connected by straight lines, illustrating trends or relationships over a continuous axis.

### New Component - Auto Form

[`Auto Form`](https://www.shadcn-vue.com/docs/components/auto-form.html) is a drop-in form builder for your internal and low-priority forms with existing zod schemas.

For example, if you already have zod schemas for your API and want to create a simple admin panel to edit user profiles, simply pass the schema to AutoForm and you're done.

The following form has been created by passing a `zod` schema object to our `AutoForm` component.

## April 2024

### Component Updated - Calendar

The [`Calendar`](https://www.shadcn-vue.com/docs/components/calendar.html) component has been updated and is now built on top of the [Reka UI Calendar](https://www.reka-ui.com/components/calendar.html) component, which uses the [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html) package to handle dates.

If you're looking for a range calendar, check out the [`Range Calendar`](https://www.shadcn-vue.com/docs/components/range-calendar.html) component.

And if you're looking for a date picker input, check out the [`Date Picker`](https://www.shadcn-vue.com/docs/components/date-picker.html) component.

### Building Blocks for the Web

[`Blocks`](https://www.shadcn-vue.com/blocks.html) are composed of different components that can be used to build your apps, with each block being a standalone section of your application. These blocks are fully responsive, accessible, and composable, and are built using the same principles as the other components in `shadcn-vue`.

![](https://www.shadcn-vue.com/examples/block-dark.png) ![](https://www.shadcn-vue.com/examples/block-light.png)

## March 2024

[`Breadcrumb`](https://www.shadcn-vue.com/docs/components/breadcrumb.html) displays the path to the current resource using a hierarchy of links.

### New Component - Pin Input (OTP Input)

[`Pin Input`](https://www.shadcn-vue.com/docs/components/pin-input.html) allows users to input a sequence of one-character alphanumeric inputs.

### New Component - Resizable

[`Resizable`](https://www.shadcn-vue.com/docs/components/resizable.html) - Accessible resizable panel groups and layouts with keyboard support.

### New Component - Drawer

[`Drawer`](https://www.shadcn-vue.com/docs/components/drawer.html) - A drawer component for vue that is built on top of [Vaul Vue](https://github.com/unovue/vaul-vue).

## February 2024

### New Component - Tag Inputs

[`Tag inputs`](https://www.shadcn-vue.com/docs/components/tags-input.html) render tags inside an input, followed by an actual text input.

## January 2024

### New Component - Sonner

[`Sonner`](https://www.shadcn-vue.com/docs/components/sonner.html) is an opinionated toast component for Vue.

The Sonner component is provided by [vue-sonner](https://vue-sonner.vercel.app/), which is a Vue port of Sonner, originally created by [Emil Kowalski](https://twitter.com/emilkowalski_) for React.

### New Component - Toggle Group

[`Toggle Group`](https://www.shadcn-vue.com/docs/components/toggle-group.html) - A set of two-state buttons that can be toggled on or off.

### New Component - Carousel

[`Carousel`](https://www.shadcn-vue.com/docs/components/carousel.html) - A carousel with motion and swipe built using [Embla](https://www.embla-carousel.com/) library.

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/changelog.md)