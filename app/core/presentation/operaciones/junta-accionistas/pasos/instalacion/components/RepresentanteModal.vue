<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed, ref, watch } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import {
    apellidoMaternoNaturalSchema,
    apellidoPaternoNaturalSchema,
    nombreNaturalSchema,
    numeroDocumentoNaturalSchema,
    paisPasaporteNaturalSchema,
    tipoDocumentoNaturalSchema,
  } from "~/schemas/PersonaNatural";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  interface Props {
    isOpen: boolean;
    accionistaId: string | null;
    representanteData?: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno?: string | null;
      tipoDocumento: string;
      numeroDocumento: string;
      paisEmision?: string | null;
    } | null;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: "update:isOpen", value: boolean): void;
    (e: "close"): void;
    (e: "save", representante: any): void;
  }>();

  // ========================================
  // STATE
  // ========================================
  const formData = ref({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoDocumento: TipoDocumentosEnum.DNI,
    numeroDocumento: "",
    paisPasaporte: "",
  });

  const tipoDocumentoOptions = [
    { id: 1, value: TipoDocumentosEnum.DNI, label: "DNI" },
    { id: 3, value: TipoDocumentosEnum.PASAPORTE, label: "Pasaporte" },
    { id: 4, value: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA, label: "Carnet de Extranjería" },
  ];

  // ========================================
  // METHODS
  // ========================================

  /**
   * Guardar representante (manejado por BaseModal submit)
   */
  async function handleSave() {
    try {
      emit("save", { ...formData.value });

      handleCancel();
    } catch (error) {
      console.error("❌ [RepresentanteModal] Error:", error);
    }
  }

  /**
   * Cancelar
   */
  function handleCancel() {
    emit("update:isOpen", false);
    resetForm();
  }

  /**
   * Reset form
   */
  function resetForm() {
    formData.value = {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      tipoDocumento: TipoDocumentosEnum.DNI,
      numeroDocumento: "",
      paisPasaporte: "",
    };
  }

  const isModalOpen = useVModel(props, "isOpen", emit, {
    passive: true,
  });

  // Título y descripción del modal
  const modalTitle = computed(() =>
    props.representanteData ? "Editar Representante" : "Agregar Representante"
  );

  const modalDescription = computed(() =>
    props.representanteData
      ? "Modifica los datos del representante."
      : "Registra quién será el representante."
  );

  // Cargar datos cuando se abre el modal (para editar)
  watch(
    () => isModalOpen.value,
    (isOpen) => {
      if (isOpen && props.representanteData) {
        // Modo editar: cargar datos existentes
        // Convertir string a TipoDocumentosEnum si es necesario
        const tipoDoc =
          (props.representanteData.tipoDocumento as TipoDocumentosEnum) ||
          TipoDocumentosEnum.DNI;
        formData.value = {
          nombre: props.representanteData.nombre || "",
          apellidoPaterno: props.representanteData.apellidoPaterno || "",
          apellidoMaterno: props.representanteData.apellidoMaterno || "",
          tipoDocumento: tipoDoc,
          numeroDocumento: props.representanteData.numeroDocumento || "",
          paisPasaporte: props.representanteData.paisEmision || "",
        };
      }
    }
  );
</script>

<template>
  <BaseModal
    v-model="isModalOpen"
    :a11y-title="modalTitle"
    :a11y-description="modalDescription"
    @submit="handleSave"
    @close="handleCancel"
  >
    <!-- Contenido del modal -->
    <div class="flex flex-col gap-6">
      <CardTitle :title="modalTitle" :body="modalDescription" />

      <!-- FORMULARIO -->
      <div class="grid grid-cols-2 gap-6">
        <SelectInputZod
          v-model="formData.tipoDocumento"
          name="tipo_documento"
          label="Tipo de documento"
          placeholder="Selecciona el tipo de documento"
          :options="tipoDocumentoOptions"
          :schema="tipoDocumentoNaturalSchema"
        />

        <SearchInputZod
          v-if="formData.tipoDocumento === TipoDocumentosEnum.DNI"
          v-model="formData.numeroDocumento"
          name="numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumentoNaturalSchema"
        />

        <TextInputZod
          v-else
          v-model="formData.numeroDocumento"
          name="numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumentoNaturalSchema"
        />

        <SelectInputZod
          v-if="formData.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
          v-model="formData.paisPasaporte"
          name="pais_pasaporte"
          label="País de pasaporte"
          placeholder="Selecciona el país de pasaporte"
          :options="countriesOptions"
          :schema="paisPasaporteNaturalSchema"
        />

        <TextInputZod
          v-model="formData.nombre"
          name="nombre"
          label="Nombres"
          placeholder="Nombres"
          :schema="nombreNaturalSchema"
        />

        <TextInputZod
          v-model="formData.apellidoPaterno"
          name="apellido_paterno"
          label="Apellido paterno"
          placeholder="Apellido paterno"
          :schema="apellidoPaternoNaturalSchema"
        />

        <TextInputZod
          v-model="formData.apellidoMaterno"
          name="apellido_materno"
          label="Apellido materno"
          placeholder="Apellido materno"
          :schema="apellidoMaternoNaturalSchema"
        />
      </div>
    </div>

    <!-- Footer con botones -->
    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />
        <ActionButton
          :label="representanteData ? 'Guardar cambios' : 'Agregar'"
          size="md"
          type="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>
