---
title: Sidebar - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/sidebar.html
author:
published:
created: 2025-10-13
description: A composable, themeable and customizable sidebar component.
tags:
  - clippings
updated: 2025-10-13T14:25
---
A sidebar that collapses to icons.

Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts.

I don't like building sidebars. So I built 30+ of them. All kinds of configurations. Then I extracted the core components into `Sidebar*.vue`.

We now have a solid foundation to build on top of. Composable. Themeable. Customizable.

[Browse the Blocks Library](https://www.shadcn-vue.com/blocks.html).

## Installation

### install this component

### Add the following colors to your CSS file

The command above should install the colors for you. If not, copy and paste the following in your CSS file.

## Structure

A `Sidebar` component is composed of the following parts:

- `SidebarProvider` - Handles collapsible state.
- `Sidebar` - The sidebar container.
- `SidebarHeader` and SidebarFooter - Sticky at the top and bottom of the sidebar
- `SidebarContent` - Scrollable content.
- `SidebarGroup` - Section within the SidebarContent.
- `SidebarTrigger` - Trigger for the Sidebar

![Sidebar Structure](https://www.shadcn-vue.com/images/sidebar-structure.png)

## Usage

## Your First Sidebar

Let's start with the most basic sidebar A collapsible sidebar with a menu.

### Add a SidebarProvider and SidebarTrigger at the root of your application.

### Create a new sidebar component at @/components/AppSidebar.vue.

We'll use the `SidebarMenu` component in a `SidebarGroup`.

@/components/AppSidebar.vue

```
vue<script setup lang="ts">
import { Calendar, Home, Inbox, Search, Settings } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <a :href="item.url">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
```

### You've created your first sidebar

Your first sidebar

## Components

The components in the `Sidebar*.vue` files are built to be composable i.e you build your sidebar by putting the provided components together. They also compose well with other shadcn-vue components such as `DropdownMenu`, `Collapsible`, `Dialog`, etc.

**If you need to change the code in the `Sidebar*.vue` files, you are encourage to do so. The code is yours. Use the provided components as a starting point to build your own**

In the next sections, we'll go over each component and how to use them.

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

### Props

| Name | Type | Description |
| --- | --- | --- |
| `defaultOpen` | `boolean` | Default open state of the sidebar. |
| `open` | `boolean` | Open state of the sidebar (controlled). |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

### Width

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` constants in `@/components/ui/sidebar/utils.ts` to set the width of the sidebar

For multiple sidebars in your application, you can use the `style` prop to set the width of the sidebar

To set the width of the sidebar, you can use the `--sidebar-width` and `--sidebar-width-mobile` CSS variables in the `style` prop.

This will not only handle the width of the sidebar but also the layout spacing.

### Keyboard Shortcut

The `SIDEBAR_KEYBOARD_SHORTCUT` variable in `@/components/ui/sidebar/utils.ts` is used to set the keyboard shortcut used to open and close the sidebar

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows.

You can change the keyboard shortcut by changing the value of the `SIDEBAR_KEYBOARD_SHORTCUT` variable.

### Persisted State

The `SidebarProvider` supports persisting the sidebar state across page reloads and server-side rendering. It uses cookies to store the current state of the sidebar. When the sidebar state changes, a default cookie named `sidebar_state` is set with the current open/closed state. This cookie is then read on subsequent page loads to restore the sidebar state.

To persist sidebar state in SSR, set up your `SidebarProvider` in `App.vue` like this:

You can change the name of the cookie by updating the `SIDEBAR_COOKIE_NAME` variable in `sidebar/utils.ts`.

The main `Sidebar` component used to render a collapsible sidebar

### Props

| Property | Type | Description |
| --- | --- | --- |
| `side` | `left` or `right` | The side of the sidebar |
| `variant` | `sidebar`, `floating`, or `inset` | The variant of the sidebar |
| `collapsible` | `offcanvas`, `icon`, or `none` | Collapsible state of the sidebar |

### side

Use the `side` prop to change the side of the sidebar

Available options are `left` and `right`.

### variant

Use the `variant` prop to change the variant of the sidebar

Available options are `sidebar`, `floating` and `inset`.

### collapsible

Use the `collapsible` prop to make the sidebar collapsible

Available options are `offcanvas`, `icon` and `none`.

| Prop | Description |
| --- | --- |
| `offcanvas` | A collapsible sidebar that slides in from the left or right. |
| `icon` | A sidebar that collapses to icons. |
| `none` | A non-collapsible sidebar |

## useSidebar

The `useSidebar` composable is used to control the sidebar.

| Property | Type | Description |
| --- | --- | --- |
| `state` | `expanded` or `collapsed` | The current state of the sidebar. |
| `open` | `boolean` | Whether the sidebar is open. |
| `setOpen` | `(open: boolean) => void` | Sets the open state of the sidebar. |
| `openMobile` | `boolean` | Whether the sidebar is open on mobile. |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile` | `boolean` | Whether the sidebar is on mobile. |
| `toggleSidebar` | `() => void` | Toggles the sidebar. Desktop and mobile. |

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar

The following example adds a `<DropdownMenu>` to the `SidebarHeader`.

A sidebar header with a dropdown menu.

Use the `SidebarFooter` component to add a sticky footer to the sidebar

The following example adds a `<DropdownMenu>` to the `SidebarFooter`.

A sidebar footer with a dropdown menu.

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar This is where you add your `SidebarGroup` components. It is scrollable.

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

A sidebar group.

## Collapsible SidebarGroup

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

A collapsible sidebar group.

## SidebarGroupAction

Use the `SidebarGroupAction` component to add an action to a `SidebarGroup`.

A sidebar group with an action button.

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

A `SidebarMenu` is composed of `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, and `SidebarMenuSub` components.

![Sidebar Menu](https://www.shadcn-vue.com/images/sidebar-menu.png)

Here's an example of a `SidebarMenu` component rendering a list of projects.

A sidebar menu with a list of projects.

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

### Link or Anchor

By default, the `SidebarMenuButton` renders a button, but you can use the `asChild` prop to render a different component such as an `<a>` tag.

### Icon and Label

You can render an icon and a truncated label inside the button. Remember to wrap the label in a `<span>` tag.

### isActive

Use the `isActive` prop to mark a menu item as active.

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`.

This button works independently of the `SidebarMenuButton` i.e. you can have the `SidebarMenuButton` as a clickable link and the `SidebarMenuAction` as a button.

Here's an example of a `SidebarMenuAction` component rendering a `DropdownMenu`.

A sidebar menu action with a dropdown menu.

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a `SidebarMenu`.

Use `SidebarMenuSubItem` and `SidebarMenuSubButton` to render a submenu item.

A sidebar menu sub.

## Collapsible SidebarMenu

To make a `SidebarMenu` component collapsible, wrap it and the `SidebarMenuSub` components in a `Collapsible`.

A collapsible sidebar menu.

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a `SidebarMenuItem`.

A sidebar menu badge.

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton within a `SidebarMenu`. You can use this to show a loading state while waiting for data to load.

## SidebarSeparator

The `SidebarSeparator` component is used to render a separator within a `Sidebar`.

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar.

The `SidebarTrigger` component must be used within a `SidebarProvider`.

## Custom Trigger

To create a custom trigger, you can use the `useSidebar` composable.

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This rail can be used to toggle the sidebar

## Controlled Sidebar

Use the `open` prop and `@update:open` emit (or `v-model:open`) to control the sidebar state.

A controlled sidebar.

## Theming

We use the following CSS variables to theme the sidebar

**We intentionally use different variables for the sidebar and the rest of the application** to make it easy to have a sidebar that is styled differently from the rest of the application. Think a sidebar with a darker shade from the main application.

## Styling

Here are some tips for styling the sidebar based on different states.

- **Styling an element based on the sidebar collapsible state.** The following will hide the `SidebarGroup` when the sidebar is in `icon` mode.
- **Styling a menu action based on the menu button active state.** The following will force the menu action to be visible when the menu button is active.

You can find more tips on using states for styling in this [Twitter thread](https://x.com/shadcn/status/1842329158879420864).

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/sidebar.md)