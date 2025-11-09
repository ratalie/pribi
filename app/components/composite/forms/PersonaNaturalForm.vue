<script setup lang="ts">
  import { computed, watch } from "vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { civilState } from "~/constants/civil-state";
  import { documentTypes } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    estadoCivilSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";

  const props = withDefaults(
    defineProps<{
      showEstadoCivil?: boolean;
    }>(),
    {
      showEstadoCivil: true,
    }
  );

  const personaNaturalStore = usePersonaNaturalStore();

  const estadoCivil = computed({
    get: () => personaNaturalStore.estadoCivil ?? "",
    set: (value: string) => {
      personaNaturalStore.estadoCivil = value || null;
    },
  });

  watch(
    () => props.showEstadoCivil,
    (value) => {
      if (!value) {
        personaNaturalStore.estadoCivil = null;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="personaNaturalStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="documentTypes"
      :schema="tipoDocumentoSchema"
    />

    <SearchInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.nombre"
      name="nombre"
      label="Nombres"
      placeholder="Nombres"
      :schema="nombreAccionistaSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoPaterno"
      name="apellido_paterno"
      label="Apellido paterno"
      placeholder="Apellido paterno"
      :schema="apellidoPaternoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoMaterno"
      name="apellido_materno"
      label="Apellido materno"
      placeholder="Apellido materno"
      :schema="apellidoMaternoSchema"
    />

    <SelectInputZod
      v-if="showEstadoCivil"
      v-model="estadoCivil"
      name="estado_civil"
      label="Estado civil"
      placeholder="Selecciona el estado civil"
      :options="civilState"
      :schema="estadoCivilSchema"
    />
  </div>
</template>
