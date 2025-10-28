<script setup lang="ts">
  import { cn } from "@/lib/utils";
  import { reactiveOmit } from "@vueuse/core";
  import type { TabsTriggerProps } from "reka-ui";
  import { TabsTrigger, useForwardProps } from "reka-ui";
  import type { HTMLAttributes } from "vue";

  const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes["class"] }>();

  const delegatedProps = reactiveOmit(props, "class");

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] disabled:pointer-events-none disabled:opacity-50',
        // Estado no activo
        'text-gray-600',
        // Estado activo
        'data-[state=active]:bg-primary-75 data-[state=active]:text-primary-700 data-[state=active]:shadow-sm',
        // Focus
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1',
        // Iconos
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
