<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { claseApoderadoSchema } from "../../schemas/claseApoderado.schema";

  interface Props {
    modelValue: boolean;
    mode?: "crear" | "editar";
    isSaving?: boolean;
    initialValue?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    isSaving: false,
    initialValue: "",
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", payload: string): void;
    (e: "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);

  const nombreClase = useVModel(props, "initialValue", emit, {
    passive: true,
  });

  const title = computed(() =>
    props.mode === "crear" ? "Agregar clase de apoderado" : "Editar clase de apoderado"
  );

  const handleSubmit = () => {
    emit("submit", nombreClase.value);
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
        v-model="nombreClase"
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
          :label="props.mode === 'crear' ? 'Guardar' : 'Actualizar'"
          size="md"
          :is-loading="isSaving"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>
