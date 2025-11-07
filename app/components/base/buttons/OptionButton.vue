<script setup lang="ts">
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    label: string;
    selected?: boolean;
    icon?: string;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    selected: false,
    disabled: false,
    icon: "Check",
  });

  const emit = defineEmits<{
    click: [];
  }>();

  const handleClick = () => {
    if (!props.disabled) {
      emit("click");
    }
  };
</script>

<template>
  <button
    :class="[
      'inline-flex items-center gap-[5px] px-[18px] py-[9px] rounded-[8px] border transition-all',
      'font-secondary font-medium text-[16px] leading-[18px]',
      selected
        ? 'bg-primary-75 border-primary-800 text-gray-700'
        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]',
    ]"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <component
      :is="getIcon(icon)"
      v-if="selected"
      class="size-[18px] shrink-0 text-primary-800"
    />
    <span class="whitespace-nowrap">{{ label }}</span>
  </button>
</template>
