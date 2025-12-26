<template>
  <div class="flex flex-col w-full">
    <label
      :for="inputId"
      class="t-t2 font-secondary text-gray-800 font-bold mb-5"
    >
      {{ label }}
    </label>
    <div
      class="relative flex items-center gap-[5px] border border-gray-500 rounded-md bg-background h-10 px-3"
    >
      <input
        :id="inputId"
        type="text"
        :value="modelValue === 0 ? '' : modelValue"
        placeholder="0"
        class="w-full border-none bg-transparent outline-none focus:outline-none focus:ring-0 p-0 font-secondary t-t2"
        @input="handleInput"
      />
      <span class="font-secondary font-bold text-gray-700 shrink-0 t-t2">%</span>
    </div>
    <p class="t-t2 font-secondary text-gray-600 mt-1">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">

interface Props {
  modelValue: number;
  label?: string;
  helpText?: string;
  inputId?: string;
}

withDefaults(defineProps<Props>(), {
  label: "Porcentaje a detraerse como Reserva Legal",
  helpText: "Entre 10% y 20%, salvo que se necesite menos para llegar al 20% del capital",
  inputId: "porcentajeReservaLegal",
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value === "" ? 0 : parseFloat(target.value) || 0;
  emit("update:modelValue", value);
};
</script>


