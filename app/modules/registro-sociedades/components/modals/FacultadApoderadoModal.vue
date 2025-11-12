<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { selectFacultadSchema } from "../../schemas/FacultadApoderado";
  import { useApoderadoFacultadStore } from "../../stores/modal/useApoderadoFacultadStore";
  import IrrevocableCard from "../regimen-poderes/IrrevocableCard.vue";
  import ReglasLimitesCard from "../regimen-poderes/ReglasLimitesCard.vue";

  interface Props {
    modelValue: boolean;
    mode: "crear" | "editar";
    listaFacultadesOptions: BaseSelectOption[];
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const apoderadoFacultadStore = useApoderadoFacultadStore();

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
    size="lg"
    @close="handleCancel"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-10">
      <CardTitle
        title="Asignar Facultad"
        body="Selecciona una facultad y define el tipo de firma."
      />

      <div class="grid grid-cols-2 gap-10">
        <SelectInputZod
          v-model="apoderadoFacultadStore.tipoFacultad"
          name="facultad"
          label="Tipo de facultad"
          placeholder="Selecciona una facultad"
          :options="listaFacultadesOptions"
          :schema="selectFacultadSchema"
        />
      </div>

      <!-- Reglas de firmas y límites monetarios -->
      <ReglasLimitesCard />

      <!-- ¿Este poder es irrevocable? -->
      <IrrevocableCard />
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
        />
      </div>
    </template>
  </BaseModal>
</template>
