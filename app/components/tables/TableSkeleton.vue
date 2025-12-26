<script setup lang="ts">
import type { TableConfig } from "~/types/tables/table-config";

interface Props {
  config: TableConfig;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="[props.config.gridClass, 'border-b-[1px]']">
    <div
      v-for="(column, index) in props.config.columns"
      :key="column.id"
      :class="[
        'flex items-center px-2 py-5',
        index === 0 ? 'pl-8' : '',
        column.align === 'center' ? 'justify-center' : '',
        column.align === 'right' ? 'justify-end' : '',
      ]"
    >
      <div
        :class="[
          'h-6 bg-gray-200 animate-pulse rounded',
          index === 0 ? 'w-44' : index === 1 ? 'w-24' : 'w-48',
        ]"
      />
    </div>
  </div>
</template>

