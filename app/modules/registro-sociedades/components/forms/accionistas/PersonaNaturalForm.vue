<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { documentTypes } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    estadoCivilSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";
  import { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
  import { usePersonaNaturalStore } from "../../../stores/modal/accionistas/usePersonaNaturalStore";

  const personaNaturalStore = usePersonaNaturalStore();

  const estadoCivilOptions = Object.values(EstadoCivilEnum).map((estado, index) => ({
    id: index + 1,
    value: estado,
    label: estado,
  }));
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
      v-model="personaNaturalStore.estadoCivil"
      name="estado_civil"
      label="Estado civil"
      placeholder="Selecciona el estado civil"
      :options="estadoCivilOptions"
      :schema="estadoCivilSchema"
    />
  </div>
</template>
