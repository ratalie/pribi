<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    modelValue?: "opcion-a" | "opcion-b";
    opcionA: string;
    opcionB: string;
    isDisabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "opcion-a",
    isDisabled: false,
  });

  const emit = defineEmits<{
    "update:modelValue": [value: "opcion-a" | "opcion-b"];
  }>();

  const isOpcionA = computed(() => props.modelValue === "opcion-a");
  const isOpcionB = computed(() => props.modelValue === "opcion-b");

  const handleClickOpcionA = () => {
    if (props.isDisabled) {
      return;
    }
    // Siempre emitir para asegurar reactividad, incluso si ya está seleccionado
    emit("update:modelValue", "opcion-a");
  };

  const handleClickOpcionB = () => {
    if (props.isDisabled) {
      return;
    }
    // Siempre emitir para asegurar reactividad, incluso si ya está seleccionado
    emit("update:modelValue", "opcion-b");
  };
</script>

<template>
  <div class="bg-gray-100 flex items-start overflow-hidden relative rounded-[16px] w-full">
    <!-- Opción A (Izquierda) -->
    <button
      type="button"
      :class="[
        'flex-1 flex gap-[10px] items-center justify-center px-5 py-4 relative self-stretch transition-all duration-200 outline-none',
        props.isDisabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isOpcionA
          ? 'bg-primary-100 border border-primary-100 rounded-tl-[16px] rounded-bl-[16px]'
          : 'bg-gray-50 border border-gray-100 rounded-tl-[16px] rounded-bl-[16px]',
      ]"
      :disabled="props.isDisabled"
      @click="handleClickOpcionA"
    >
      <p
        :class="[
          'font-primary font-medium leading-[20px] relative shrink-0 text-center whitespace-pre-wrap',
          'text-[18px]',
          isOpcionA ? 'text-primary-700' : 'text-gray-600',
        ]"
      >
        {{ props.opcionA }}
      </p>
    </button>

    <!-- Opción B (Derecha) -->
    <button
      type="button"
      :class="[
        'flex-1 flex gap-[10px] items-center justify-center px-5 py-4 relative self-stretch transition-all duration-200 outline-none',
        props.isDisabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isOpcionB
          ? 'bg-primary-100 border border-primary-100 rounded-tr-[16px] rounded-br-[16px]'
          : 'bg-gray-50 border border-gray-100 rounded-tr-[16px] rounded-br-[16px]',
      ]"
      :disabled="props.isDisabled"
      @click="handleClickOpcionB"
    >
      <p
        :class="[
          'font-primary font-medium leading-[20px] relative shrink-0 text-center whitespace-pre-wrap',
          'text-[18px]',
          isOpcionB ? 'text-primary-700' : 'text-gray-600',
        ]"
      >
        {{ props.opcionB }}
      </p>
    </button>
  </div>
</template>
