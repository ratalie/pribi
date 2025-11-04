<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
  import ActionButton from "../../buttons/composite/ActionButton.vue";
  import CardTitle from "../../cards/CardTitle.vue";
  import BaseModal from "../BaseModal.vue";

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
    // emits("close");
  };
</script>

<template>
  <BaseModal v-model="modelValue" size="lg" @close="emits('close')">
    <div class="flex flex-col gap-12">
      <CardTitle title="Tipo de Accionista" />

      <PersonaNaturalForm />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />
        <ActionButton variant="primary" label="Guardar" size="md" @click="handleSave" />
      </div>
    </template>
  </BaseModal>
</template>
