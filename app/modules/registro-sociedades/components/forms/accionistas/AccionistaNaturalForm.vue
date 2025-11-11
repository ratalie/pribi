<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { estadoCivilOptions } from "~/constants/civil-state";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    estadoCivilSchema,
    nombreSchema,
    numeroDocumentoSchema,
    paisPasaporteSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/accionistas/personaNaturalSchemas";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
  import { useAccionistaNaturalStore } from "../../../stores/modal/accionistas/useAccionistaNaturalStore";

  const accionistaNaturalStore = useAccionistaNaturalStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="accionistaNaturalStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="tipoDocumentoOptions"
      :schema="tipoDocumentoSchema"
    />

    <SearchInputZod
      v-if="accionistaNaturalStore.tipoDocumento === TipoDocumentosEnum.DNI"
      v-model="accionistaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-else
      v-model="accionistaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <SelectInputZod
      v-if="accionistaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
      v-model="accionistaNaturalStore.paisPasaporte"
      name="pais_pasaporte"
      label="País de pasaporte"
      placeholder="Selecciona el país de pasaporte"
      :options="[{ id: 1, value: 'Peru', label: 'Peru' }]"
      :schema="paisPasaporteSchema"
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
