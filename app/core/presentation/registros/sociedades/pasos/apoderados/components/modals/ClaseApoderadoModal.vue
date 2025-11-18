<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";

  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import {
    claseApoderadoSchema,
    type ClaseApoderadoForm,
  } from "../../schemas/claseApoderado.schema";

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
    <div class="flex flex-col gap-12">
      <CardTitle :title="title" body="Ingresa el nombre de la nueva clase de apoderados." />

      <TextInputZod
        v-model="formModel.nombre"
        name="clase_nombre"
        label="Nombre de la clase"
        placeholder="Ej. Gerente General"
        :schema="claseApoderadoSchema.shape.nombre"
      />
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
          :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>
