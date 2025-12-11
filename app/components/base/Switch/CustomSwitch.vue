<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      checked: boolean;
      isDisabled?: boolean;
    }>(),
    {
      isDisabled: false,
    }
  );

  const emit = defineEmits<{
    "update:checked": [value: boolean];
  }>();

  const toggle = () => {
    // Bloquear la actualización si está deshabilitado
    if (props.isDisabled) {
      return;
    }
    emit("update:checked", !props.checked);
  };
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="props.isDisabled"
    :class="[
      'relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
      checked ? 'bg-primary-700' : 'bg-gray-100',
    ]"
    @click="toggle"
  >
    <span
      :class="[
        'pointer-events-none block size-4 rounded-full bg-white ring-0 transition-transform',
        checked ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0',
      ]"
    />
  </button>
</template>
