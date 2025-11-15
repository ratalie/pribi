<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
import BaseModal from "~/components/base/modal/BaseModal.vue";
import { claseApoderadoSchema, type ClaseApoderadoForm } from "../../schemas/claseApoderado.schema";

interface Props {
  modelValue: boolean;
  mode?: "create" | "edit";
  isSaving?: boolean;
  initialValue?: ClaseApoderadoForm | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  isSaving: false,
  initialValue: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: ClaseApoderadoForm): void;
  (e: "close"): void;
}>();

const isOpen = useVModel(props, "modelValue", emit);
const formModel = ref<ClaseApoderadoForm>({
  nombre: "",
});

watch(
  () => props.initialValue,
  (value) => {
    formModel.value = {
      nombre: value?.nombre ?? "",
    };
  },
  { immediate: true }
);

const title = computed(() =>
  props.mode === "create" ? "Agregar clase de apoderado" : "Editar clase de apoderado"
);

const handleSubmit = () => {
  emit("submit", { ...formModel.value });
};

const handleClose = () => {
  emit("close");
  isOpen.value = false;
};
</script>

<template>
  <BaseModal v-model="isOpen" size="md" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-8">
      <div>
        <p class="t-h5 font-semibold text-slate-900">{{ title }}</p>
        <p class="t-b3 text-slate-500">Completa el nombre de la clase para identificarla.</p>
      </div>

      <TextInputZod
        v-model="formModel.nombre"
        name="clase_nombre"
        label="Nombre de la clase"
        placeholder="Ej. Gerente General"
        :schema="claseApoderadoSchema.shape.nombre"
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
          class="w-full md:w-auto"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>


