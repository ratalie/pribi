<script setup lang="ts">
  import { ChevronDown } from "lucide-vue-next";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import type { ApoderadoFacultadRow } from "../../types/apoderadosFacultades";

  interface Props {
    apoderadoItem: ApoderadoFacultadRow;
  }

  defineProps<Props>();
</script>

<template>
  <div>
    <div class="flex items-center h-20 border-b border-gray-200 dark:border-gray-800">
      <BaseButton variant="ghost" class="w-16 h-16">
        <component :is="ChevronDown" class="w-5 h-5" />
      </BaseButton>
      <div class="flex-1 flex items-center px-8">
        <p class="t-h6 font-primary font-semibold text-gray-700 dark:text-gray-900">
          {{ apoderadoItem.nombre }}
        </p>
      </div>
    </div>

    <div>
      <p>Facultades</p>
    </div>
  </div>
</template>
