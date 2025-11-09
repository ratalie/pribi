<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";

  interface Props {
    modelValue?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const personaNaturalStore = usePersonaNaturalStore();

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;

    personaNaturalStore.$reset();
  };

  const handleSave = async () => {
    emits("submit");
  };

  const handleInvalidSubmit = () => {
    //colocar logica de error, mostrar un toast
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleCancel"
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle title="Registrar Otro Apoderado Especial" />

      <PersonaNaturalForm :show-estado-civil="false" />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton type="submit" variant="primary" label="Guardar" size="md" />
      </div>
    </template>
  </BaseModal>
</template>
