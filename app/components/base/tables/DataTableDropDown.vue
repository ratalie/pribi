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
  import { EllipsisVertical, MoreHorizontal } from "lucide-vue-next";
  import { getIcon } from "~~/docs/utils/iconMapper";

  const props = withDefaults(
    defineProps<{
      itemId: string;
      titleMenu?: string;
      actions?: {
        label: string;
        icon?: string;
        separatorLine?: boolean;
        onClick: (id: string) => void;
      }[];
      iconType?: "vertical" | "horizontal";
      actionsLabelText?: string;
    }>(),
    {
      iconType: "horizontal",
      actionsLabelText: undefined,
    }
  );

  const actionsList = computed(() => {
    return props.actions || [];
  });

  const triggerIcon = computed(() => {
    return props.iconType === "vertical" ? EllipsisVertical : MoreHorizontal;
  });
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        :class="['flex items-center gap-2 h-8', actionsLabelText ? 'px-2' : 'p-0']"
      >
        <span class="sr-only">Open menu</span>
        <component :is="triggerIcon" class="w-4 h-4" />
        <span v-if="actionsLabelText" class="text-gray-700 font-secondary t-t2 font-medium">
          {{ actionsLabelText }}
        </span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuLabel v-if="titleMenu">{{ titleMenu }}</DropdownMenuLabel>
      <template v-for="(action, index) in actionsList" :key="action.label">
        <DropdownMenuItem
          class="flex items-center gap-3 text-gray-700 font-secondary t-t2 font-medium dark:text-gray-900"
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
