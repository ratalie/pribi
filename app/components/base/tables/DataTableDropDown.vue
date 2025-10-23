<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { MoreHorizontal } from "lucide-vue-next";

  const props = defineProps<{
    itemId: string;
    titleMenu?: string;
    actions?: {
      label: string;
      icon?: string;
      separatorLine?: boolean;
      onClick: (id: string) => void;
    }[];
  }>();

  const actionsList = computed(() => {
    return props.actions || [];
  });
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuLabel v-if="titleMenu">{{ titleMenu }}</DropdownMenuLabel>
      <template v-for="(action, index) in actionsList" :key="action.label">
        <DropdownMenuItem
          class="flex items-center gap-2 text-gray-700 font-secondary t-t2 font-medium dark:text-gray-300"
          @click="action.onClick(itemId)"
        >
          <component
            :is="getIcon(action.icon || '')"
            v-if="getIcon(action.icon || '')"
            class="w-4 h-4"
          />
          {{ action.label }}
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="index < actionsList.length - 1 && action.separatorLine" />
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
