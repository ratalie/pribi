<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
  import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
  import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
  import DirectorForm from "~/core/presentation/registros/sociedades/pasos/directorio/components/forms/DirectorForm.vue";
  import { TiposDirectoresEnum } from "~/core/presentation/registros/sociedades/pasos/directorio/enums/TiposDirectoresEnum";
  import { useDirectores } from "~/core/presentation/registros/sociedades/pasos/directorio/useDirectores";
  import { useDirectoresComputed } from "~/core/presentation/registros/sociedades/pasos/directorio/utils/useDirectoresComputed";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface Props {
    modelValue?: boolean;
    mode?: "create" | "edit";
    directorToEdit?: DirectorConfig | null;
    societyId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    directorToEdit: null,
    societyId: "",
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
    (e: "saved", director: DirectorConfig): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const personaNaturalStore = usePersonaNaturalStore();
  const { directores, create, update, isSaving } = useDirectores(
    computed(() => props.societyId)
  );
  const { presidenteOptions } = useDirectoresComputed(directores);
  const tipoDirector = ref<TiposDirectoresEnum | "">("");
  const reemplazoAsignado = ref("");
  const isEditMode = computed(() => props.mode === "edit" && !!props.directorToEdit);
  const submitLabel = computed(() => (isEditMode.value ? "Editar" : "Guardar"));

  // Función para generar UUID (igual que en AccionistaModal)
  const generateUuid = (): string => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  };

  const ensureUuid = (value?: string | null) =>
    value && value.length > 0 ? value : generateUuid();

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
          tipoDocumento: director.persona.tipoDocumento,
          numeroDocumento: director.persona.numeroDocumento,
          nombre: director.persona.nombre,
          apellidoPaterno: director.persona.apellidoPaterno,
          apellidoMaterno: director.persona.apellidoMaterno,
          paisPasaporte: director.persona.paisEmision || "",
        });
        // Mapear rolDirector (TipoDirector) a TiposDirectoresEnum
        const rolDirectorToTiposMap: Record<TipoDirector, TiposDirectoresEnum> = {
          [TipoDirector.TITULAR]: TiposDirectoresEnum.TITULAR,
          [TipoDirector.SUPLENTE]: TiposDirectoresEnum.SUPLENTE,
          [TipoDirector.ALTERNO]: TiposDirectoresEnum.ALTERNO,
        };
        tipoDirector.value = rolDirectorToTiposMap[director.rolDirector] || "";
        reemplazoAsignado.value = director.reemplazaId ?? "";
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
    if (isSubmitDisabled.value || !props.societyId) {
      return;
    }

    try {
      // Mapear TiposDirectoresEnum a TipoDirector
      const rolDirectorMap: Record<TiposDirectoresEnum, TipoDirector> = {
        [TiposDirectoresEnum.TITULAR]: TipoDirector.TITULAR,
        [TiposDirectoresEnum.SUPLENTE]: TipoDirector.SUPLENTE,
        [TiposDirectoresEnum.ALTERNO]: TipoDirector.ALTERNO,
      };

      const selectedTipoDirector = tipoDirector.value as TiposDirectoresEnum;

      // Generar UUIDs si no existen (igual que en AccionistaModal)
      const directorId =
        isEditMode.value && props.directorToEdit ? props.directorToEdit.id : ensureUuid(null);

      const personaId =
        isEditMode.value && props.directorToEdit
          ? props.directorToEdit.persona.id
          : ensureUuid(null);

      const directorDTO: DirectorDTO = {
        id: directorId,
        persona: {
          id: personaId,
          nombre: personaNaturalStore.nombre,
          apellidoPaterno: personaNaturalStore.apellidoPaterno,
          apellidoMaterno: personaNaturalStore.apellidoMaterno,
          numeroDocumento: personaNaturalStore.numeroDocumento,
          tipoDocumento: personaNaturalStore.tipoDocumento as TipoDocumentosEnum,
          paisEmision: personaNaturalStore.paisPasaporte || null,
        },
        rolDirector: rolDirectorMap[selectedTipoDirector],
        reemplazaId:
          selectedTipoDirector === TiposDirectoresEnum.ALTERNO
            ? reemplazoAsignado.value || null
            : null,
      };

      let savedDirector: DirectorConfig;
      if (isEditMode.value && props.directorToEdit) {
        savedDirector = await update(props.directorToEdit.id, directorDTO);
      } else {
        savedDirector = await create(directorDTO);
      }

      emits("saved", savedDirector);
      handleCancel();
    } catch (error) {
      console.error("Error al guardar director:", error);
      // Aquí puedes agregar un toast de error
    }
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
        :presidente-options="presidenteOptions"
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
          :is-disabled="isSubmitDisabled || isSaving"
        />
      </div>
    </template>
  </BaseModal>
</template>
