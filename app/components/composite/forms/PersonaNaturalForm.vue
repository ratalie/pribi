<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";

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
  </div>
</template>
