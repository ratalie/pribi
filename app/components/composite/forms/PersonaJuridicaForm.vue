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
  import { usePersonaJuridicaStore } from "~/stores/usePersonaJuridicaStore";
  const personaJuridicaStore = usePersonaJuridicaStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SearchInputZod
      v-model="personaJuridicaStore.numeroDocumento"
      name="numero_documento"
      label="Número de RUC"
      placeholder="Ingrese el número"
      :schema="numeroRucSchema"
    />
    <TextInputZod
      v-model="personaJuridicaStore.razonSocial"
      name="razon_social"
      label="Razón Social"
      placeholder="Razón social"
      :schema="razonSocialSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.nombreComercial"
      name="nombre_comercial"
      label="Nombre Comercial"
      placeholder="Nombre comercial"
      :schema="nombreComercialSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.provincia"
      name="provincia"
      label="Provincia"
      placeholder="Provincia"
      :schema="provinciaSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.departamento"
      name="departamento"
      label="Departamento"
      placeholder="Departamento"
      :schema="departamentoSchema"
    />

    <TextInputZod
      v-model="personaJuridicaStore.distrito"
      name="distrito"
      label="Distrito"
      placeholder="Distrito"
      :schema="distritoSchema"
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
