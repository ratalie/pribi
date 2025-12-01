<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";

  interface Props {
    modelValue: boolean;
    tipoPersona: "natural" | "juridica";
    mode?: "crear" | "editar";
    isSaving?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    isSaving: false,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update:tipoPersona", value: "natural" | "juridica"): void;
    (e: "submit" | "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);

  const tipoPersona = useVModel(props, "tipoPersona", emit, {
    passive: true,
  });

  const personaOptions = [
    { value: "natural", label: "Persona Natural", description: "" },
    { value: "juridica", label: "Persona Jurídica", description: "" },
  ];

  const handleSubmit = () => {
    emit("submit");
  };

  const handleClose = () => {
    emit("close");
    isOpen.value = false;
  };
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-10">
      <CardTitle
        title="Gerente General"
        body="Registra al representante principal de la sociedad."
      />

      <LabeledCardSwitch
        v-model="tipoPersona"
        label="Tipo de persona"
        sub-label="Selecciona Persona Natural o Persona Jurídica."
        :options="personaOptions"
        :columns="2"
        default-value="natural"
      />

      <div v-if="tipoPersona === 'natural'" class="rounded-xl border border-slate-200 p-6">
        <PersonaNaturalForm :show-estado-civil="false" />
      </div>

      <div v-else class="flex flex-col gap-6">
        <PersonaJuridica />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleClose"
        />
        <ActionButton
          :label="mode === 'crear' ? 'Guardar' : 'Actualizar'"
          size="md"
          type="submit"
          :is-loading="isSaving"
        />
      </div>
    </template>
  </BaseModal>
</template>
