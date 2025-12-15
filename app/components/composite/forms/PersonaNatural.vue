<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoNaturalSchema,
    apellidoPaternoNaturalSchema,
    nombreNaturalSchema,
    numeroDocumentoNaturalSchema,
    paisPasaporteNaturalSchema,
    tipoDocumentoNaturalSchema,
  } from "~/schemas/PersonaNatural";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

  const personaNaturalStore = usePersonaNaturalStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="personaNaturalStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="tipoDocumentoOptions"
      :schema="tipoDocumentoNaturalSchema"
    />

    <SearchInputZod
      v-if="personaNaturalStore.tipoDocumento === TipoDocumentosEnum.DNI"
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoNaturalSchema"
    />

    <TextInputZod
      v-else
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoNaturalSchema"
    />

    <SelectInputZod
      v-if="personaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
      v-model="personaNaturalStore.paisPasaporte"
      name="pais_pasaporte"
      label="País de pasaporte"
      placeholder="Selecciona el país de pasaporte"
      :options="countriesOptions"
      :schema="paisPasaporteNaturalSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.nombre"
      name="nombre"
      label="Nombres"
      placeholder="Nombres"
      :schema="nombreNaturalSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoPaterno"
      name="apellido_paterno"
      label="Apellido paterno"
      placeholder="Apellido paterno"
      :schema="apellidoPaternoNaturalSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoMaterno"
      name="apellido_materno"
      label="Apellido materno"
      placeholder="Apellido materno"
      :schema="apellidoMaternoNaturalSchema"
    />
  </div>
</template>
