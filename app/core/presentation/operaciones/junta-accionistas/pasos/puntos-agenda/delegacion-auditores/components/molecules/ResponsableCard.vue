<template>
  <div
    @click="handleClick"
    :class="[
      'relative w-full rounded-xl border-2 p-6 cursor-pointer transition-all duration-200',
      'flex items-center justify-between',
      selected
        ? 'border-primary-700 shadow-md bg-primary-25'
        : 'border-gray-200 hover:border-primary-300 bg-white',
    ]"
  >
    <!-- Contenido de texto -->
    <h3
      :class="[
        't-2 font-semibold font-secondary',
        selected ? 'text-primary-700' : 'text-gray-800',
      ]"
    >
      {{ title }}
    </h3>
    <!-- Checkmark circular -->
    <div
      :class="[
        'shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
        selected ? 'bg-primary-700' : 'bg-white border-2 border-gray-400',
      ]"
    >
      <svg
        v-if="selected"
        class="w-2.5 h-2.5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO";
    title: string;
    selected: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    select: [value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO"];
  }>();

  const handleClick = () => {
    emit("select", props.value);
  };
</script>


