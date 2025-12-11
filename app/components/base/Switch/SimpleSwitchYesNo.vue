<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import CustomSwitch from "./CustomSwitch.vue";

  interface Props {
    modelValue?: boolean;
    isDisabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isDisabled: false,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
  }>();

  const isActive = useVModel(props, "modelValue", emit, {
    passive: true,
    defaultValue: false,
  });

  // Función para manejar el click en los labels
  const handleLabelClick = (value: boolean) => {
    if (props.isDisabled) {
      return;
    }
    isActive.value = value;
  };

  // Clases computadas para asegurar reactividad
  const labelNoClass = computed(() => {
    const baseClass = isActive.value ? "text-gray-300" : "text-gray-200";
    return props.isDisabled
      ? `${baseClass} opacity-50 cursor-not-allowed`
      : `${baseClass} cursor-pointer`;
  });

  const labelSiClass = computed(() => {
    const baseClass = isActive.value ? "text-primary-700" : "text-gray-200";
    return props.isDisabled
      ? `${baseClass} opacity-50 cursor-not-allowed`
      : `${baseClass} cursor-pointer`;
  });
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Label NO -->
    <label
      :class="`text-sm leading-none select-none transition-colors ${labelNoClass}`"
      @click="handleLabelClick(false)"
    >
      NO
    </label>

    <!-- Switch -->
    <CustomSwitch
      :checked="isActive"
      :is-disabled="props.isDisabled"
      @update:checked="(val: boolean) => {
        if (!props.isDisabled) {
          isActive = val;
        }
      }"
    />

    <!-- Label SI -->
    <label
      :class="`text-sm leading-none select-none transition-colors ${labelSiClass}`"
      @click="handleLabelClick(true)"
    >
      SI
    </label>
  </div>
</template>
