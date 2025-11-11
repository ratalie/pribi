<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { documentTypes } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    estadoCivilSchema,
    nombreSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/accionistas/personaNaturalSchemas";
  import { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
  import { useAccionistaNaturalStore } from "../../../stores/modal/accionistas/useAccionistaNaturalStore";

  const accionistaNaturalStore = useAccionistaNaturalStore();

  const estadoCivilOptions = Object.values(EstadoCivilEnum).map((estado, index) => ({
    id: index + 1,
    value: estado,
    label: estado,
  }));
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="accionistaNaturalStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="documentTypes"
      :schema="tipoDocumentoSchema"
    />

    <SearchInputZod
      v-model="accionistaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="accionistaNaturalStore.nombre"
      name="nombre"
      label="Nombres"
      placeholder="Nombres"
      :schema="nombreSchema"
    />

    <TextInputZod
      v-model="accionistaNaturalStore.apellidoPaterno"
      name="apellido_paterno"
      label="Apellido paterno"
      placeholder="Apellido paterno"
      :schema="apellidoPaternoSchema"
    />

    <TextInputZod
      v-model="accionistaNaturalStore.apellidoMaterno"
      name="apellido_materno"
      label="Apellido materno"
      placeholder="Apellido materno"
      :schema="apellidoMaternoSchema"
    />

    <SelectInputZod
      v-model="accionistaNaturalStore.estadoCivil"
      name="estado_civil"
      label="Estado civil"
      placeholder="Selecciona el estado civil"
      :options="estadoCivilOptions"
      :schema="estadoCivilSchema"
    />
  </div>
</template>
