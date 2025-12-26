<template>
  <BaseModal
    :model-value="modelValue"
    size="xs"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <div class="flex flex-col gap-6">
      <CardTitle
        title="Agregar Estado Financiero"
        body="Ingresa el nombre del estado financiero."
      />

      <div class="flex flex-col gap-2">
        <p class="t-t2 text-gray-800 font-secondary">Estado Financiero</p>
        <BaseInput
          id="estado-financiero-input"
          v-model="nombreEstadoFinanciero"
          placeholder="Estado de Flujo Efectivo"
          size="md"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="$emit('close')"
        />
        <ActionButton
          type="submit"
          variant="primary"
          label="Crear"
          size="md"
          :is-disabled="!nombreEstadoFinanciero.trim()"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
  import { ref, watch } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { usePronunciamientoStore } from "../../stores/usePronunciamientoStore";

  interface Props {
    modelValue: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    close: [];
    submit: [nombre: string];
  }>();

  const store = usePronunciamientoStore();
  const nombreEstadoFinanciero = ref("");

  // Limpiar input cuando se cierra el modal
  watch(
    () => props.modelValue,
    (isOpen) => {
      if (!isOpen) {
        nombreEstadoFinanciero.value = "";
      }
    }
  );

  const handleSubmit = () => {
    if (!nombreEstadoFinanciero.value.trim()) {
      return;
    }

    store.addEstadoFinanciero(nombreEstadoFinanciero.value);
    emit("submit", nombreEstadoFinanciero.value);
    nombreEstadoFinanciero.value = "";
    emit("update:modelValue", false);
  };
</script>


