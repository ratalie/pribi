<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import CustomSwitch from "./CustomSwitch.vue";

  interface Props {
    modelValue?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
  }>();

  const isActive = useVModel(props, "modelValue", emit, {
    passive: true,
    defaultValue: false,
  });

  // Clases computadas para asegurar reactividad
  const labelNoClass = computed(() => {
    return isActive.value ? "text-gray-300" : "text-gray-200";
  });

  const labelSiClass = computed(() => {
    return isActive.value ? "text-primary-700" : "text-gray-200";
  });
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Label NO -->
    <label
      :class="`text-sm leading-none select-none cursor-pointer transition-colors ${labelNoClass}`"
      @click="isActive = false"
    >
      NO
    </label>

    <!-- Switch -->
    <CustomSwitch :checked="isActive" @update:checked="(val: boolean) => (isActive = val)" />

    <!-- Label SI -->
    <label
      :class="`text-sm leading-none select-none cursor-pointer transition-colors ${labelSiClass}`"
      @click="isActive = true"
    >
      SI
    </label>
  </div>
</template>
