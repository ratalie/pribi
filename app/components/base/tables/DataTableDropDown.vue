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
    actions?: { label: string; separatorLine?: boolean; onClick: (id: string) => void }[];
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
        <DropdownMenuItem @click="action.onClick(itemId)">{{ action.label }}</DropdownMenuItem>
        <DropdownMenuSeparator v-if="index < actionsList.length - 1 && action.separatorLine" />
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
