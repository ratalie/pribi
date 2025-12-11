<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { nombreTipoFacultadSchema } from "../../schemas/tipoFacultad";
  import { useTiposFacultadStore } from "../../stores/modal/useTiposFacultadStore";

  interface Props {
    modelValue: boolean;
    mode: "crear" | "editar";
    isLoading: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const tiposFacultadStore = useTiposFacultadStore();

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
    size="sm"
    @close="handleCancel"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-10">
      <CardTitle title="Agregar Facultad" body="Ingresa el nombre de la facultad." />

      <TextInputZod
        v-model="tiposFacultadStore.nombreFacultad"
        name="nombre_facultad"
        label="Nombre de la Facultad"
        placeholder="Ingresa el nombre de la facultad"
        :schema="nombreTipoFacultadSchema"
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

        <ActionButton
          type="submit"
          variant="primary"
          :label="mode === 'crear' ? 'Guardar' : 'Editar'"
          size="md"
          :is-loading="isLoading"
        />
      </div>
    </template>
  </BaseModal>
</template>
