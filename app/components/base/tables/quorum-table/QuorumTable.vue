<template>
  <section>
    <table class="w-full border-collapse">
      <!-- titulos -->
      <thead>
        <tr class="border-b border-border-primary py-4 px-4">
          <th
            v-for="(el, index) in headerList"
            :key="index"
            class="text-button-primary text-b1 font-semibold font-primary text-start py-4 px-7"
            :style="index === 0 ? 'width: 33.333%' : index === 1 ? 'width: 66.666%' : ''"
          >
            {{ el }}
          </th>
        </tr>
      </thead>
      <!-- Rows si no hay se da el dato ( No hay contenidos en esta lista ) -->
      <tbody
        v-if="Array.isArray(listActions) && listActions.length === 0"
        class="flex gap-3 items-center justify-center text-secondaryText text-xs font-medium font-secondary py-4 border-b border-border-primary"
      >
        <!-- <Icon icon="line-md:emoji-frown" width="24" height="24" /> -->
        No hay contenido en esta lista
      </tbody>

      <!-- Childrens -->
      <slot />
      <!-- No se crean los actions para que se pueda personalizar tanto como uno quiera -->
    </table>
  </section>
</template>

<script setup lang="ts">
  // import { Icon } from "@iconify/vue/dist/iconify.js";

  interface Props {
    headerList: string[];
    listActions?: any[] | boolean;
    columns?: string;
    column?: Column;
  }

  type Column = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

  defineProps<Props>();
</script>

<style scoped>
  section {
    position: relative;
    isolation: isolate;
  }
</style>
