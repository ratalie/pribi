<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import DirectorForm from "~/components/composite/forms/DirectorForm.vue";
  import {
    useDirectorioStore,
    type Director,
  } from "~/modules/registro-sociedades/composables/useDirectores";
  import { useDirectoresComputed } from "~/modules/registro-sociedades/composables/useDirectoresComputed";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
  import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";

  interface Props {
    modelValue?: boolean;
    mode?: "create" | "edit";
    directorToEdit?: Director | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    directorToEdit: null,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const personaNaturalStore = usePersonaNaturalStore();
  const directorioStore = useDirectorioStore();
  const { presidenteOptions } = useDirectoresComputed();
  const tipoDirector = ref<TiposDirectoresEnum | "">("");
  const reemplazoAsignado = ref("");
  const isEditMode = computed(() => props.mode === "edit" && !!props.directorToEdit);
  const submitLabel = computed(() => (isEditMode.value ? "Editar" : "Guardar"));

  const isSubmitDisabled = computed(() => {
    if (!tipoDirector.value) {
      return true;
    }

    if (tipoDirector.value === TiposDirectoresEnum.ALTERNO) {
      return !presidenteOptions.value.length || !reemplazoAsignado.value;
    }

    return false;
  });

  watch(
    () => ({
      isOpen: modelValue.value,
      mode: props.mode,
      director: props.directorToEdit,
    }),
    ({ isOpen, mode, director }) => {
      if (!isOpen) {
        return;
      }

      if (mode === "edit" && director) {
        personaNaturalStore.$patch({
          tipoDocumento: director.tipoDocumento,
          numeroDocumento: director.numeroDocumento,
          nombre: director.nombres,
          apellidoPaterno: director.apellidoPaterno,
          apellidoMaterno: director.apellidoMaterno,
        });
        tipoDirector.value = director.tipoDirector;
        reemplazoAsignado.value = director.reemplazoAsignado ?? "";
        return;
      }

      personaNaturalStore.$reset();
      tipoDirector.value = "";
      reemplazoAsignado.value = "";
    },
    { immediate: true }
  );

  watch(
    [tipoDirector, presidenteOptions],
    ([tipo, options]) => {
      if (tipo === TiposDirectoresEnum.ALTERNO) {
        if (!options.length) {
          reemplazoAsignado.value = "";
          return;
        }

        const exists = options.some((option) => option.value === reemplazoAsignado.value);

        if (!exists) {
          const firstOption = options[0];

          if (!firstOption) {
            reemplazoAsignado.value = "";
            return;
          }

          reemplazoAsignado.value = String(firstOption.value);
        }

        return;
      }

      reemplazoAsignado.value = "";
    },
    { immediate: true }
  );

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;

    personaNaturalStore.$reset();
    tipoDirector.value = "";
    reemplazoAsignado.value = "";
  };

  const handleSave = async () => {
    if (isSubmitDisabled.value) {
      return;
    }

    const selectedTipoDirector = tipoDirector.value as TiposDirectoresEnum;
    const directorPayload = {
      nombres: personaNaturalStore.nombre,
      apellidoPaterno: personaNaturalStore.apellidoPaterno,
      apellidoMaterno: personaNaturalStore.apellidoMaterno,
      numeroDocumento: personaNaturalStore.numeroDocumento,
      tipoDocumento: personaNaturalStore.tipoDocumento as TipoDocumentosEnum,
      tipoDirector: selectedTipoDirector,
      reemplazoAsignado:
        selectedTipoDirector === TiposDirectoresEnum.ALTERNO ? reemplazoAsignado.value : null,
    };

    if (isEditMode.value && props.directorToEdit) {
      directorioStore.updateDirector({
        id: props.directorToEdit.id,
        ...directorPayload,
      });
    } else {
      directorioStore.addDirector(directorPayload);
    }

    handleCancel();
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
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle title="Agregar Director" body="Completa los campos requeridos" />

      <DirectorForm
        v-model:tipo-director="tipoDirector"
        v-model:reemplazo-asignado="reemplazoAsignado"
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
