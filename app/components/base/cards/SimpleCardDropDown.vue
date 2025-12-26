<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    variant?: "default" | "sm";
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
  });

  const paddingClass = computed(() => {
    return props.variant === "sm" ? "py-[16px] px-[32px]" : "";
  });
</script>

<template>
  <div class="h-full border border-gray-100 rounded-xl flex flex-col">
    <div :class="$slots.content ? 'border-b border-b-gray-100' : ''">
      <div :class="paddingClass">
        <slot name="title" />
      </div>
    </div>
    <div v-if="$slots.content">
      <div :class="paddingClass">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
