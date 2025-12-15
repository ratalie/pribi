<template>
  <div
    v-if="text"
    class="flex items-center gap-[11px] px-[10px] py-[11px] rounded-[5px]"
    :style="{
      backgroundColor: '#c2e2ff',
    }"
  >
    <Info
      class="w-[14px] h-[14px] shrink-0"
      :style="{
        color: '#0B76B7',
      }"
    />
    <p
      class="font-secondary font-medium shrink-0"
      :style="{
        fontSize: '12px',
        lineHeight: '16px',
        color: '#676472',
      }"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { Info } from "lucide-vue-next";

  interface Props {
    text: string;
    variant?: "info" | "warning";
  }

  withDefaults(defineProps<Props>(), {
    variant: "info",
  });
</script>
