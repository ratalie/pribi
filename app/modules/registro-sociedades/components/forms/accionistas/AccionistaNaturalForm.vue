<script setup lang="ts">
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { estadoCivilOptions } from "~/constants/civil-state";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import { regimenPatrimonialOptions } from "~/constants/inputs/regimen-patrimonial";
  import {
    apellidoMaternoAccSchema,
    apellidoPaternoAccSchema,
    estadoCivilAccSchema,
    nombreAccSchema,
    numeroDocumentoAccSchema,
    paisPasaporteAccSchema,
    partidaRegistralAccSchema,
    regimenPatrimonialAccSchema,
    sedeRegistralAccSchema,
    tipoDocumentoAccSchema,
  } from "~/modules/registro-sociedades/schemas/accionistasSchemas";
  import { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
  import { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
  import { useAccionistaNaturalStore } from "../../../stores/modal/accionistas/useAccionistaNaturalStore";

  const accionistaNaturalStore = useAccionistaNaturalStore();

  watch(
    () => accionistaNaturalStore.estadoCivil,
    (newVal) => {
      if (newVal !== EstadoCivilEnum.CASADO) {
        accionistaNaturalStore.regimenPatrimonial = "";
        // Limpiar datos de separación de patrimonios
        accionistaNaturalStore.partidaRegistral = "";
        accionistaNaturalStore.sedeRegistral = "";
        // Limpiar datos del cónyuge
        accionistaNaturalStore.conyuge.numeroDocumento = "";
        accionistaNaturalStore.conyuge.tipoDocumento = "";
        accionistaNaturalStore.conyuge.nombre = "";
        accionistaNaturalStore.conyuge.apellidoPaterno = "";
        accionistaNaturalStore.conyuge.apellidoMaterno = "";
      }
    }
  );

  watch(
    () => accionistaNaturalStore.regimenPatrimonial,
    (newVal) => {
      if (newVal === RegimenPatrimonialEnum.SOCIEDAD_GANANCIALES) {
        accionistaNaturalStore.partidaRegistral = "";
        accionistaNaturalStore.sedeRegistral = "";
      }

      if (newVal === RegimenPatrimonialEnum.SEPARACION_PATRIMONIOS) {
        accionistaNaturalStore.conyuge.numeroDocumento = "";
        accionistaNaturalStore.conyuge.tipoDocumento = "";
        accionistaNaturalStore.conyuge.nombre = "";
        accionistaNaturalStore.conyuge.apellidoPaterno = "";
        accionistaNaturalStore.conyuge.apellidoMaterno = "";
      }
    }
  );
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="grid grid-cols-2 gap-12">
      <SelectInputZod
        v-model="accionistaNaturalStore.tipoDocumento"
        name="tipo_documento"
        label="Tipo de documento"
        placeholder="Selecciona el tipo de documento"
        :options="tipoDocumentoOptions"
        :schema="tipoDocumentoAccSchema"
      />

      <SearchInputZod
        v-if="accionistaNaturalStore.tipoDocumento === TipoDocumentosEnum.DNI"
        v-model="accionistaNaturalStore.numeroDocumento"
        name="numero_documento"
        label="Número de documento"
        placeholder="Ingrese número de documento"
        :schema="numeroDocumentoAccSchema"
      />

      <TextInputZod
        v-else
        v-model="accionistaNaturalStore.numeroDocumento"
        name="numero_documento"
        label="Número de documento"
        placeholder="Ingrese número de documento"
        :schema="numeroDocumentoAccSchema"
      />

      <SelectInputZod
        v-if="accionistaNaturalStore.tipoDocumento === TipoDocumentosEnum.PASAPORTE"
        v-model="accionistaNaturalStore.paisPasaporte"
        name="pais_pasaporte"
        label="País de pasaporte"
        placeholder="Selecciona el país de pasaporte"
        :options="[{ id: 1, value: 'Peru', label: 'Peru' }]"
        :schema="paisPasaporteAccSchema"
      />

      <TextInputZod
        v-model="accionistaNaturalStore.nombre"
        name="nombre"
        label="Nombres"
        placeholder="Nombres"
        :schema="nombreAccSchema"
      />

      <TextInputZod
        v-model="accionistaNaturalStore.apellidoPaterno"
        name="apellido_paterno"
        label="Apellido paterno"
        placeholder="Apellido paterno"
        :schema="apellidoPaternoAccSchema"
      />

      <TextInputZod
        v-model="accionistaNaturalStore.apellidoMaterno"
        name="apellido_materno"
        label="Apellido materno"
        placeholder="Apellido materno"
        :schema="apellidoMaternoAccSchema"
      />

      <SelectInputZod
        v-model="accionistaNaturalStore.estadoCivil"
        name="estado_civil"
        label="Estado civil"
        placeholder="Selecciona el estado civil"
        :options="estadoCivilOptions"
        :schema="estadoCivilAccSchema"
      />

      <SelectInputZod
        v-if="accionistaNaturalStore.estadoCivil === EstadoCivilEnum.CASADO"
        v-model="accionistaNaturalStore.regimenPatrimonial"
        name="regimen_patrimonial"
        label="Régimen"
        placeholder="Selecciona el régimen"
        :options="regimenPatrimonialOptions"
        :schema="regimenPatrimonialAccSchema"
      />
    </div>

    <!-- Cónyuge -->

    <div
      v-if="
        accionistaNaturalStore.regimenPatrimonial ===
        RegimenPatrimonialEnum.SOCIEDAD_GANANCIALES
      "
      class="flex flex-col gap-4"
    >
      <p class="t-h6 text-gray-800 font-semibold font-primary">Datos del cónyuge</p>
      <div class="grid grid-cols-2 gap-12 border border-gray-200 rounded-md p-8">
        <SearchInputZod
          v-model="accionistaNaturalStore.conyuge.numeroDocumento"
          name="conyuge_numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumentoAccSchema"
        />

        <TextInputZod
          v-model="accionistaNaturalStore.conyuge.nombre"
          name="conyuge_nombre"
          label="Nombres"
          placeholder="Nombres"
          :schema="nombreAccSchema"
        />

        <TextInputZod
          v-model="accionistaNaturalStore.conyuge.apellidoPaterno"
          name="conyuge_apellido_paterno"
          label="Apellido paterno"
          placeholder="Apellido paterno"
          :schema="apellidoPaternoAccSchema"
        />

        <TextInputZod
          v-model="accionistaNaturalStore.conyuge.apellidoMaterno"
          name="conyuge_apellido_materno"
          label="Apellido materno"
          placeholder="Apellido materno"
          :schema="apellidoMaternoAccSchema"
        />
      </div>
    </div>

    <div
      v-else-if="
        accionistaNaturalStore.regimenPatrimonial ===
        RegimenPatrimonialEnum.SEPARACION_PATRIMONIOS
      "
      class="flex flex-col gap-4"
    >
      <p class="t-h6 text-gray-800 font-semibold font-primary">
        Datos de la Separación de Patrimonios
      </p>
      <div class="grid grid-cols-2 gap-12 border border-gray-200 rounded-md p-8">
        <TextInputZod
          v-model="accionistaNaturalStore.partidaRegistral"
          name="partida_registral"
          label="Partida Registral"
          placeholder="Ingresa la partida registral"
          :schema="partidaRegistralAccSchema"
        />

        <TextInputZod
          v-model="accionistaNaturalStore.sedeRegistral"
          name="sede_registral"
          label="Sede registral"
          placeholder="Ingresa la sede registral"
          :schema="sedeRegistralAccSchema"
        />
      </div>
    </div>
  </div>
</template>
