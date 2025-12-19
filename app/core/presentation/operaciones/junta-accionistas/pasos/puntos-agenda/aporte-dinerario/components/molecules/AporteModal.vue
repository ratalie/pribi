<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, watch } from "vue";
  import { useRoute } from "vue-router";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { useCapitalizacionesStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/stores/useCapitalizacionesStore";
  import { useAportesStore } from "../../stores/useAportesStore";
  import AporteForm from "./AporteForm.vue";

  interface Props {
    modelValue?: boolean;
    mode?: "crear" | "editar";
    accionistaId?: string | null;
    aporteId?: string | null;
    societyId?: string;
    flowId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    accionistaId: null,
    aporteId: null,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const route = useRoute();
  const isOpen = useVModel(props, "modelValue", emits);

  // ✅ Detectar si estamos en capitalización de créditos o aporte dinerario
  const isCapitalizacion = computed(() => {
    return route.path.includes("capitalizacion-creditos");
  });

  // ✅ Usar el store correcto según el contexto (sin computed para evitar problemas de reactividad)
  const aportesStore = useAportesStore();
  const capitalizacionesStore = useCapitalizacionesStore();

  const submitLabel = computed(() =>
    props.mode === "editar" ? "Guardar Cambios" : "Asignar"
  );

  const isSubmitDisabled = computed(() => {
    // ✅ Usar el store correcto directamente según el contexto
    const store = isCapitalizacion.value ? capitalizacionesStore : aportesStore;
    // ✅ Comprobante es OPCIONAL en ambos casos
    return (
      !store.accionId ||
      store.accionesPorRecibir <= 0 ||
      !store.fechaContribucion ||
      store.monto <= 0
    );
  });

  const resetForm = () => {
    // ✅ Resetear el store correcto según el contexto
    if (isCapitalizacion.value) {
      capitalizacionesStore.$reset();
    } else {
      aportesStore.$reset();
    }
  };

  const handleCancel = () => {
    resetForm();
    emits("close");
    isOpen.value = false;
  };

  const handleSave = () => {
    if (isSubmitDisabled.value || !props.accionistaId) {
      return;
    }

    emits("submit");
    emits("close");
    isOpen.value = false;
  };

  // Resetear formulario cuando se cierra
  watch(isOpen, (newValue) => {
    if (!newValue) {
      resetForm();
    }
  });
</script>

<template>
  <BaseModal v-model="isOpen" size="lg" @close="handleCancel" @submit="handleSave">
    <div class="flex flex-col gap-12">
      <CardTitle title="Información del Aporte" body="Complete todos los campos requeridos." />
      <AporteForm
        :mode="props.mode"
        :accionista-id="props.accionistaId"
        :aporte-id="props.aporteId"
      />
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
          :label="submitLabel"
          size="md"
          :is-disabled="isSubmitDisabled"
        />
      </div>
    </template>
  </BaseModal>
</template>
