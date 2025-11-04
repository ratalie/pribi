<script setup lang="ts">
  import Moneda from "@/assets/icons/Moneda.svg";
  import { useVModel } from "@vueuse/core";
  import ActionButton from "../../buttons/composite/ActionButton.vue";

  interface Props {
    modelValue?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
  };

  const handleSave = async () => {
    console.log("Datos de acciones");
  };

  const handleInvalidSubmit = () => {
    //colocar logica de error, mostrar un toast
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="md"
    @close="handleCancel"
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col items-center justify-center gap-7">
      <img :src="Moneda" alt="moneda" class="w-44" />

      <div class="flex flex-col items-center justify-center font-primary">
        <p class="t-h4 font-semibold text-gray-800">Valor nominal</p>
        <p class="t-h6 font-normal text-gray-500">Ingresa el valor nominal de las acciones.</p>
      </div>

      <!-- falta crear un input numerico tranparente -->
      <div>
        <input
          type="text"
          placeholder="S/ 0.00"
          class="border-b border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton type="submit" variant="primary" label="Guardar" class="w-96 h-11" />
      </div>
    </template>
  </BaseModal>
</template>
