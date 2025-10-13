---
title: Command - shadcn/vue
source: https://www.shadcn-vue.com/docs/components/command.html
author:
published:
created: 2025-10-13
description: Fast, composable, unstyled command menu.
tags:
  - clippings
updated: 2025-10-13T14:26
---
[Component Source](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/registry/default/ui/command) [API Reference](https://www.reka-ui.com/docs/components/listbox.html)

## Installation

```bash
npx shadcn-vue@latest add command
```

## Usage

## Examples

### Dialog

Press ⌘ J

To show the command menu in a dialog, use the `<CommandDialog />` component.

```bash
vue<script setup lang="ts">

import { useMagicKeys } from '@vueuse/core'

import { ref, watch } from 'vue'

const open = ref(false)

const keys = useMagicKeys()

const CmdJ = keys['Cmd+J']

function handleOpenChange() {

  open.value = !open.value

}

watch(CmdJ, (v) => {

  if (v)

    handleOpenChange()

})

</script>

<template>

  <div>

    <p class="text-sm text-muted-foreground">

      Press

      <kbd

        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"

      >

        <span class="text-xs">⌘</span>J

      </kbd>

    </p>

    <CommandDialog :open="open" @update:open="handleOpenChange">

      <CommandInput placeholder="Type a command or search..." />

      <CommandList>

        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">

          <CommandItem value="calendar">

            Calendar

          </CommandItem>

          <CommandItem value="search-emoji">

            Search Emoji

          </CommandItem>

          <CommandItem value="calculator">

            Calculator

          </CommandItem>

        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">

          <CommandItem value="profile">

            Profile

          </CommandItem>

          <CommandItem value="billing">

            Billing

          </CommandItem>

          <CommandItem value="settings">

            Settings

          </CommandItem>

        </CommandGroup>

      </CommandList>

    </CommandDialog>

  </div>

</template>
```

  

### Popover

Status

### Dropdown menu

feature Create a new project

### Responsive

You can create a responsive combobox by using the `<Popover />` on desktop and the `<Drawer />` components on mobile.

### Form

[Edit this page on GitHub](https://github.com/unovue/shadcn-vue/tree/dev/apps/www/src/content/docs/components/command.md)