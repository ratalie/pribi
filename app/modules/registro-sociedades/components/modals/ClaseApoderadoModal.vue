<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { claseApoderadoSchema } from "../../schemas/modalRegistroApoderados";
  import { useClaseApoderadoModalStore } from "../../stores/modal/useClaseApoderadoModalStore";

  interface Props {
    modelValue: boolean;
    mode: "crear" | "editar";
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const claseApoderadoModalStore = useClaseApoderadoModalStore();

  const handleSubmit = () => {
    emits("submit");
  };

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
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
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-10">
      <CardTitle
        title="Agregar Clase de Apoderado"
        body="Ingresa el nombre de la nueva clase de Apoderados."
      />

      <TextInputZod
        v-model="claseApoderadoModalStore.nombreClase"
        name="clase_apoderado"
        label="Clase de Apoderado"
        placeholder="ej. Apoderado Contable"
        :schema="claseApoderadoSchema"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton type="submit" variant="primary" label="Crear" size="md" />
      </div>
    </template>
  </BaseModal>
</template>
