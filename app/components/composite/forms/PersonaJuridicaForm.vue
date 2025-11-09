<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import {
    departamentoSchema,
    direccionSchema,
    distritoSchema,
    nombreComercialSchema,
    numeroRucSchema,
    provinciaSchema,
    razonSocialSchema,
  } from "~/modules/registro-sociedades/schemas/modalPersonaJuridica";
  const personaNaturalStore = usePersonaNaturalStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SearchInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de RUC"
      placeholder="Ingrese el número"
      :schema="numeroRucSchema"
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
      name="nombre_comercial"
      label="Nombre Comercial"
      placeholder="Nombre comercial"
      :schema="nombreComercialSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="provincia"
      label="Provincia"
      placeholder="Provincia"
      :schema="provinciaSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="departamento"
      label="Departamento"
      placeholder="Departamento"
      :schema="departamentoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="distrito"
      label="Distrito"
      placeholder="Distrito"
      :schema="distritoSchema"
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
