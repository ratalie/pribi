<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed } from "vue";
  import { z } from "zod";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";

  interface SelectOption {
    id: string;
    value: string;
    label: string;
  }

  interface Props {
    modelValue: boolean;
    claseApoderadoId: string;
    mostrarSelectorClase: boolean;
    mode: "crear" | "editar";
    isSaving?: boolean;
    claseOptions: SelectOption[];
  }

  const props = withDefaults(defineProps<Props>(), {
    isSaving: false,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update:claseApoderadoId", value: string): void;
    (e: "submit" | "close"): void;
  }>();

  const isOpen = useVModel(props, "modelValue", emit);

  const claseApoderadoId = useVModel(props, "claseApoderadoId", emit, {
    passive: true,
  });

  const handleSubmit = () => {
    emit("submit");
  };
  const handleClose = () => {
    emit("close");
    isOpen.value = false;
  };

  const title = computed(() =>
    props.mode === "crear" ? "Registrar apoderado" : "Editar apoderado"
  );
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleClose" @submit="handleSubmit">
    <div class="flex flex-col gap-8">
      <!-- HEADER -->
      <CardTitle :title="title" body="Completa la información solicitada.">
        <template #actions>
          <div v-if="mostrarSelectorClase" class="w-[340px]">
            <SelectInputZod
              v-model="claseApoderadoId"
              name="clase_apoderado"
              label="Clase de apoderado"
              placeholder="Selecciona una clase"
              :options="claseOptions"
              :schema="z.string().min(1, 'Selecciona una clase')"
            />
          </div>
        </template>
      </CardTitle>

      <div class="flex flex-col gap-6">
        <PersonaNaturalForm />
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
          :is-loading="isSaving"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>
