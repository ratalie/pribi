<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { Check } from "lucide-vue-next";
  import { computed, watch } from "vue";

  interface LabeledOption {
    value: string | number;
    label: string;
    description?: string;
    disabled?: boolean;
  }

  const props = withDefaults(
    defineProps<{
      modelValue: string | number | null;
      label?: string;
      subLabel?: string;
      options?: LabeledOption[];
      columns?: 1 | 2 | 3;
      disabled?: boolean;
      defaultValue?: string | number | null;
    }>(),
    {
      label: "",
      subLabel: "",
      options: () => [],
      columns: 2 as 1 | 2 | 3,
      disabled: false,
      defaultValue: null,
    }
  );

  const emit = defineEmits<{
    (e: "update:modelValue", value: string | number | null): void;
  }>();

  const selectedValue = useVModel(props, "modelValue", emit, {
    passive: true,
  });

  const gridClass = computed(() => {
    const col = props.columns ?? 2;
    if (col === 1) return "grid grid-cols-1";
    if (col === 3) return "grid grid-cols-1 md:grid-cols-3";
    return "grid grid-cols-1 md:grid-cols-2";
  });

  const handleSelect = (option: LabeledOption) => {
    if (props.disabled || option.disabled) {
      return;
    }

    if (selectedValue.value === option.value) {
      return;
    }

    selectedValue.value = option.value;
  };

  watch(
    () => [props.defaultValue, props.options, selectedValue.value],
    () => {
      const hasSelection = selectedValue.value !== null && selectedValue.value !== "";

      if (hasSelection) {
        return;
      }

      if (props.defaultValue == null) {
        return;
      }

      const hasMatch = props.options?.some((option) => option.value === props.defaultValue);

      if (hasMatch) {
        selectedValue.value = props.defaultValue;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div v-if="label" class="flex flex-col gap-1 min-h-[44px]">
      <span class="t-t2 font-secondary font-semibold text-gray-800">
        {{ label }}
      </span>
      <span v-if="subLabel" class="t-b2 font-secondary text-gray-500">
        {{ subLabel }}
      </span>
    </div>

    <div :class="['grid gap-3', gridClass]">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="selectedValue === option.value"
        :disabled="disabled || option.disabled"
        :class="[
          'w-full rounded-md border px-4 py-3 transition-colors duration-200 flex items-start gap-2 text-left',
          'outline-none focus-visible:ring-2 focus-visible:ring-(--color-outline-ring) focus-visible:ring-offset-2',
          disabled || option.disabled
            ? 'cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
            : 'cursor-pointer',
          selectedValue === option.value
            ? 'bg-primary-75 border-primary-500'
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        ]"
        @click="handleSelect(option)"
      >
        <Check
          v-if="selectedValue === option.value"
          class="size-4 shrink-0 text-primary-700"
        />
        <!-- <span v-else class="size-4 shrink-0 rounded-full border border-gray-300" /> -->

        <span class="flex flex-col gap-1">
          <span
            :class="[
              't-t2 font-secondary font-medium',
              selectedValue === option.value ? 'text-primary-700' : 'text-gray-700',
            ]"
          >
            {{ option.label }}
          </span>
          <span
            v-if="option.description"
            :class="[
              't-b2 font-secondary',
              selectedValue === option.value ? 'text-primary-600' : 'text-gray-500',
            ]"
          >
            {{ option.description }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>
