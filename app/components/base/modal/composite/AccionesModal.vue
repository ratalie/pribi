<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import AccionesComunesForm from "~/components/composite/forms/AccionesComunesForm.vue";
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

  const accionesComunesStore = useAccionesComunesStore();

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
  };

  const handleSave = async () => {
    // Obtener datos del formulario desde el store
    const formData = accionesComunesStore.getFormData();
    console.log("Datos de acciones:", formData);

    // Aquí iría la lógica de guardado (API call, etc.)
    // await saveAccion(formData);

    // Cerrar modal si se guarda exitosamente
    modelValue.value = false;
    emits("close");
  };

  const handleInvalidSubmit = () => {
    // Colocar lógica de error, mostrar un toast
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
      <CardTitle title="Agregar Acción" />

      <!-- Tabs para cambiar entre formularios -->
      <SwitchTabs opcion-a="Comunes" opcion-b="Clases de Acciones" variant="default">
        <template #opcion-a>
          <div class="pt-10">
            <AccionesComunesForm />
          </div>
        </template>
        <template #opcion-b>
          <div class="pt-10">
            <!-- TODO: Crear ClasesAccionesForm.vue -->
            <p class="text-gray-400 text-center">
              Formulario de "Clases de Acciones" - Pendiente
            </p>
          </div>
        </template>
      </SwitchTabs>
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
