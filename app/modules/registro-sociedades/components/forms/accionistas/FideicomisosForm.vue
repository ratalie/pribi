<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
  import {
    domicilioFiscalAccSchema,
    identificacionFideicomisosAccSchema,
    numeroDocumentoJurAccSchema,
    partidaRegistralAccSchema,
    razonSocialAccSchema,
    sedeRegistralAccSchema,
  } from "~/modules/registro-sociedades/schemas/accionistasSchemas";
  import { useAccionistaFideicomisosStore } from "~/modules/registro-sociedades/stores/modal/accionistas/useAccionistaFideicomisosStore";

  const accionistaFideicomisosStore = useAccionistaFideicomisosStore();
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- formulario fideicomisos -->
    <SimpleCardDropDown>
      <template #title>
        <div class="flex justify-between items-center px-12 py-6">
          <div class="flex flex-col gap-2">
            <h1 class="t-t1 text-gray-800 font-bold font-secondary">Tiene RUC</h1>
            <p class="t-t1 font-primary text-gray-500 font-normal">
              Esta opción puede activarse o desactivarse según corresponda
            </p>
          </div>

          <CustomSwitch
            :checked="accionistaFideicomisosStore.tieneRuc"
            @update:checked="accionistaFideicomisosStore.tieneRuc = $event"
          />
        </div>
      </template>
      <template v-if="accionistaFideicomisosStore.tieneRuc" #content>
        <div class="grid grid-cols-2 gap-12 px-12 py-10">
          <SearchInputZod
            v-model="accionistaFideicomisosStore.numeroDocumento"
            name="numero_ruc"
            label="Número de RUC"
            placeholder="Ingresa el número de RUC"
            :schema="numeroDocumentoJurAccSchema"
          />

          <TextInputZod
            v-model="accionistaFideicomisosStore.razonSocial"
            name="razon_social"
            label="Razón Social"
            placeholder="Razón Social"
            :schema="razonSocialAccSchema"
          />
        </div>
      </template>
    </SimpleCardDropDown>

    <div class="grid grid-cols-2 gap-12">
      <TextInputZod
        v-model="accionistaFideicomisosStore.identificacionFideicomiso"
        name="identificacion_fideicomiso"
        label="Identificación del Fideicomiso"
        placeholder="Escribe la Identificación del Fideicomiso aquí"
        :schema="identificacionFideicomisosAccSchema"
      />

      <TextInputZod
        v-model="accionistaFideicomisosStore.partidaRegistral"
        name="partida_registral"
        label="Partida Registral"
        placeholder="Escribe la Partida Registral aquí"
        :schema="partidaRegistralAccSchema"
      />

      <TextInputZod
        v-model="accionistaFideicomisosStore.sedeRegistral"
        name="sede_registral"
        label="Sede Registral"
        placeholder="Escribe la Sede Registral aquí"
        :schema="sedeRegistralAccSchema"
      />

      <TextInputZod
        v-model="accionistaFideicomisosStore.domicilioFiscal"
        name="domicilio_fiscal"
        label="Domicilio Fiscal"
        placeholder="Escribe el Domicilio Fiscal aquí"
        :schema="domicilioFiscalAccSchema"
      />
    </div>

    <div class="flex flex-col gap-4">
      <p class="t-h6 text-gray-800 font-semibold font-primary">
        Datos de la Sociedad Fiduciaria
      </p>

      <div class="grid grid-cols-2 gap-12 border rounded-lg px-12 py-6">
        <SearchInputZod
          v-model="accionistaFideicomisosStore.numeroDocumentoFiduciaria"
          name="numero_fiduciaria"
          label="Número de RUC"
          placeholder="Ingresa el número Fiduciaria"
          :schema="numeroDocumentoJurAccSchema"
        />

        <TextInputZod
          v-model="accionistaFideicomisosStore.razonSocialFiduciaria"
          name="razon_social_fiduciaria"
          label="Razón Social"
          placeholder="Razón Social Fiduciaria"
          :schema="razonSocialAccSchema"
        />
      </div>
    </div>

    <!-- formulario representante legal -->
    <div class="flex flex-col gap-4">
      <p class="t-h6 text-gray-800 font-semibold font-primary">Registrar representante</p>
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between items-center px-12 py-6">
            <h1 class="t-t1 text-gray-800 font-bold font-secondary">
              Registrar representante en la socicedad
            </h1>
            <CustomSwitch
              :checked="accionistaFideicomisosStore.tieneRepresentante"
              @update:checked="accionistaFideicomisosStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="accionistaFideicomisosStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
