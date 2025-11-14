<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed } from "vue";

  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import type { AccionistaFormValues } from "../types";
  import AccionistaForm from "./AccionistaForm.vue";

  interface Props {
    modelValue: boolean;
    mode?: "create" | "edit";
    isSaving?: boolean;
    initialValues?: Partial<AccionistaFormValues>;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    isSaving: false,
    initialValues: undefined,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", payload: AccionistaFormValues): void;
    (e: "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);

  const title = computed(() =>
    props.mode === "create" ? "Agregar accionista" : "Editar accionista"
  );

  const handleSubmit = (values: AccionistaFormValues) => {
    emit("submit", values);
  };

  const handleClose = () => {
    emit("close");
    isOpen.value = false;
  };
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose">
    <div class="flex flex-col gap-10">
      <CardTitle :title="title" body="Completa la información solicitada." />

      <AccionistaForm
        :initial-values="initialValues"
        :mode="mode"
        @submit="handleSubmit"
      />
    </div>

    <template #footer>
      <div class="flex w-full flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:justify-end">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          class="w-full md:w-auto"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          form="accionistas-form"
          class="w-full md:w-auto"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>

