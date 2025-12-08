<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "./BaseModal.vue";

  interface Props {
    modelValue: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: "Confirmar eliminación",
    message: "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
    confirmLabel: "Eliminar",
    cancelLabel: "Cancelar",
    isLoading: false,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm"): void;
    (e: "cancel"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const handleCancel = () => {
    emits("cancel");
    modelValue.value = false;
  };

  const handleConfirm = () => {
    emits("confirm");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="sm"
    @close="handleCancel"
  >
    <div class="flex flex-col gap-6">
      <CardTitle
        :title="title"
        :body="message"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          :label="cancelLabel"
          size="md"
          :is-disabled="isLoading"
          @click="handleCancel"
        />

        <ActionButton
          variant="primary"
          :label="confirmLabel"
          size="md"
          :is-loading="isLoading"
          :is-disabled="isLoading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </BaseModal>
</template>

