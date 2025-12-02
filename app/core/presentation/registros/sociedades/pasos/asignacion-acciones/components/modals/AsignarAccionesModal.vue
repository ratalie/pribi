<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, nextTick, watch } from "vue";
  import { useRoute } from "vue-router";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { useAsignacionAccionesStore } from "../../stores/useAsignacionAccionesStore";
  import { useRegistroAsignacionAccionesStore } from "../../stores/useRegistroAsignacionAccionesStore";
  import AsignaAccionesForm from "../forms/AsignaAccionesForm.vue";

  interface Props {
    modelValue?: boolean;
    mode?: "crear" | "editar";
    accionistaId?: string | null;
    accionId?: string | null;
    societyProfileId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    accionistaId: null,
    accionId: null,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const route = useRoute();
  const asignacionAccionesStore = useRegistroAsignacionAccionesStore();
  const asignacionAccionesFormStore = useAsignacionAccionesStore();

  // Obtener societyProfileId de props o route
  const societyProfileId = computed(() => {
    return props.societyProfileId || (route.params.id as string | undefined) || "";
  });

  const submitLabel = computed(() => (props.mode === "editar" ? "Editar" : "Guardar"));

  const isSubmitDisabled = computed(() => {
    return (
      !asignacionAccionesFormStore.accionId ||
      asignacionAccionesFormStore.cantidadSuscrita <= 0
    );
  });

  const resetForm = () => {
    asignacionAccionesFormStore.$reset();
  };

  const populateFromAsignacion = async (accionistaId: string, accionId: string) => {
    const asignacionAccion = asignacionAccionesStore.getAsignacionAccionById(
      accionistaId,
      accionId
    );

    if (!asignacionAccion) {
      console.error("No se encontró la asignación para:", { accionistaId, accionId });
      return;
    }

    const formData = {
      accionId: asignacionAccion.accionId,
      cantidadSuscrita: asignacionAccion.cantidadSuscrita,
      precioPorAccion: asignacionAccion.precioPorAccion ?? 0,
      porcentajePagadoPorAccion: asignacionAccion.porcentajePagadoPorAccion ?? 0,
      totalDividendosPendientes: asignacionAccion.totalDividendosPendientes ?? 0,
      pagadoCompletamente: asignacionAccion.pagadoCompletamente ?? false,
      capitalSocial: asignacionAccion.capitalSocial ?? 0,
      prima: asignacionAccion.prima ?? 0,
    };

    // Usar $patch para actualizar el store
    asignacionAccionesFormStore.$patch(formData);

    // Forzar una actualización reactiva después de cargar los datos
    await nextTick();
  };

  // Observar cuando el modal se abre/cierra Y cuando cambian los props
  watch(
    () => ({
      isOpen: modelValue.value,
      mode: props.mode,
      accionistaId: props.accionistaId,
      accionId: props.accionId,
    }),
    (newVal, oldVal) => {
      // Si el modal está cerrado, resetear el formulario
      if (!newVal.isOpen) {
        if (oldVal?.isOpen) {
          resetForm();
        }
        return;
      }

      // Si el modal está abierto
      if (newVal.isOpen) {
        // Si está en modo edición y tenemos los IDs necesarios
        if (newVal.mode === "editar" && newVal.accionistaId && newVal.accionId) {
          // Verificar si los props cambiaron o si es la primera vez que se abre
          const shouldLoad =
            !oldVal ||
            !oldVal.isOpen ||
            newVal.mode !== oldVal.mode ||
            newVal.accionistaId !== oldVal.accionistaId ||
            newVal.accionId !== oldVal.accionId;

          if (shouldLoad) {
            // Usar setTimeout para asegurar que los props estén completamente establecidos
            setTimeout(async () => {
              await populateFromAsignacion(newVal.accionistaId!, newVal.accionId!);
            }, 0);
          }
        } else if (newVal.mode === "crear") {
          // Si está en modo crear, resetear el formulario
          resetForm();
        }
      }
    },
    { immediate: true, deep: true }
  );

  const handleCancel = () => {
    resetForm();
    emits("close");
    modelValue.value = false;
  };

  const handleSave = async () => {
    if (isSubmitDisabled.value || !props.accionistaId) {
      return;
    }

    // Obtener datos directamente del store en lugar de usar getFormData()
    const accionId = asignacionAccionesFormStore.accionId;
    const cantidadSuscrita = asignacionAccionesFormStore.cantidadSuscrita;
    const precioPorAccion = asignacionAccionesFormStore.precioPorAccion;
    const porcentajePagadoPorAccion = asignacionAccionesFormStore.porcentajePagadoPorAccion;
    const totalDividendosPendientes = asignacionAccionesFormStore.totalDividendosPendientes;
    const pagadoCompletamente = asignacionAccionesFormStore.pagadoCompletamente;
    const capitalSocial = asignacionAccionesFormStore.capitalSocial;
    const prima = asignacionAccionesFormStore.prima;

    if (!accionId || cantidadSuscrita <= 0) {
      console.error("Datos del formulario inválidos", {
        accionId,
        cantidadSuscrita,
      });
      return;
    }

    const payload = {
      accionId,
      cantidadSuscrita,
      porcentaje: 0, // Se recalculará automáticamente
      precioPorAccion,
      porcentajePagadoPorAccion,
      totalDividendosPendientes,
      pagadoCompletamente,
      capitalSocial,
      prima,
    };

    const profileId = societyProfileId.value;
    if (!profileId) {
      console.error("No hay societyProfileId disponible");
      return;
    }

    if (props.mode === "editar" && props.accionId && props.accionistaId) {
      // Actualizar asignación existente
      await asignacionAccionesStore.updateAsignacionAccion(
        profileId,
        props.accionistaId,
        props.accionId,
        payload
      );
    } else if (props.accionistaId) {
      // Crear nueva asignación
      await asignacionAccionesStore.addAsignacionAccion(
        profileId,
        props.accionistaId,
        payload
      );
    }

    resetForm();
    emits("submit");
    emits("close");
    modelValue.value = false;
  };

  const handleInvalidSubmit = () => {
    // Los campos requeridos son: tipoAccion y cantidadAccionesSuscritas > 0
    // La validación se maneja automáticamente por vee-validate
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
      <CardTitle
        title="Asignar Acciones"
        body="Define la cantidad de acciones para cada accionista."
      />
      <AsignaAccionesForm />
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
