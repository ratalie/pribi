<script setup lang="ts">
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import {
    direccionSchema,
    razonSocialSchema,
    tipoDocumentoSchema,
    numeroDocumentoSchema,
    paisSchema,
  } from "~/modules/registro-sociedades/schemas/modalPersonaJuridica";
  import { countriesOptions } from "~/constants/inputs/countries-options";

  const personaNaturalStore = usePersonaNaturalStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="pais"
      label="País"
      :schema="paisSchema"
      placeholder="Seleccionar"
      :options="countriesOptions"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="razon_social"
      label="Razón Social"
      placeholder="Razón social"
      :schema="razonSocialSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="tipo_documento"
      label="Tipo de Documento"
      placeholder="Escribe el tipo de documento aquí"
      :schema="tipoDocumentoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de Documento"
      placeholder="Ingrese el número"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="Dirección"
      label="Dirección"
      placeholder="Dirección"
      :schema="direccionSchema"
    />
  </div>
</template>
