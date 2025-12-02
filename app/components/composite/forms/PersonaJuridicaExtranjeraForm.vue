<script setup lang="ts">
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import {
    direccionSchema,
    numeroDocumentoSchema,
    paisSchema,
    razonSocialSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalPersonaJuridica";
  import { usePersonaJuridicaStore } from "~/stores/usePersonaJuridicaStore";

  const personaJuridicaStore = usePersonaJuridicaStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="(personaJuridicaStore as any).pais"
      name="pais"
      label="País"
      :schema="paisSchema"
      placeholder="Seleccionar"
      :options="countriesOptions"
    />

    <TextInputZod
      v-model="personaJuridicaStore.razonSocial"
      name="razon_social"
      label="Razón Social"
      placeholder="Razón social"
      :schema="razonSocialSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de Documento"
      placeholder="Escribe el tipo de documento aquí"
      :schema="tipoDocumentoSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.numeroDocumento"
      name="numero_documento"
      label="Número de Documento"
      placeholder="Ingrese el número"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.direccion"
      name="Dirección"
      label="Dirección"
      placeholder="Dirección"
      :schema="direccionSchema"
    />
  </div>
</template>
