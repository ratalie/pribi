<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
  import { countriesOptions } from "~/constants/inputs/countries-options";
  import {
    departamentoAccSchema,
    direccionAccSchema,
    distritoAccSchema,
    nombreComercialAccSchema,
    numeroDocumentoJurAccSchema,
    paisOrigenAccSchema,
    provinciaAccSchema,
    razonSocialAccSchema,
    tipoDocumentoAccSchema,
  } from "~/schemas/registro-sociedades/accionistasSchemas";

  const personaJuridicaStore = usePersonaJuridicaStore();
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- formulario persona juridica -->
    <div class="flex flex-col gap-4">
      <p class="t-h6 text-gray-800 font-semibold font-primary">Datos de la persona jurídica</p>
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between items-center px-12 py-6">
            <h1 class="t-t1 text-gray-800 font-bold font-secondary">
              La empresa se constituyó en Perú
            </h1>
            <CustomSwitch
              :checked="personaJuridicaStore.seConstituyoEnPeru"
              @update:checked="personaJuridicaStore.seConstituyoEnPeru = $event"
            />
          </div>
        </template>
        <template #content>
          <div
            v-if="personaJuridicaStore.seConstituyoEnPeru"
            class="grid grid-cols-2 gap-12 px-12 py-10"
          >
            <SearchInputZod
              v-model="personaJuridicaStore.numeroDocumento"
              name="numero_ruc"
              label="Número de RUC"
              placeholder="Ingresa el número de RUC"
              :schema="numeroDocumentoJurAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.razonSocial"
              name="razon_social"
              label="Razón Social"
              placeholder="Razón Social"
              :schema="razonSocialAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.nombreComercial"
              name="nombre_comercial"
              label="Nombre Comercial"
              placeholder="Nombre Comercial"
              :schema="nombreComercialAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.direccion"
              name="direccion"
              label="Dirección"
              placeholder="Dirección"
              :schema="direccionAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.distrito"
              name="distrito"
              label="Distrito"
              placeholder="Distrito"
              :schema="distritoAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.provincia"
              name="provincia"
              label="Provincia"
              placeholder="Provincia"
              :schema="provinciaAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.departamento"
              name="departamento"
              label="Departamento"
              placeholder="Departamento"
              :schema="departamentoAccSchema"
            />
          </div>

          <div v-else class="grid grid-cols-2 gap-12 px-12 py-10">
            <TextInputZod
              v-model="personaJuridicaStore.tipoDocumento"
              name="tipo_documento_extranjero"
              label="Tipo de Documento"
              placeholder="Escribe el tipo de documento aquí"
              :schema="tipoDocumentoAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.numeroDocumento"
              name="numero_documento_extranjero"
              label="Número de Documento"
              placeholder="Ingresa el número de documento"
              :schema="numeroDocumentoJurAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.razonSocial"
              name="razon_social_extranjero"
              label="Razón Social"
              placeholder="Escribe la razón social aquí"
              :schema="razonSocialAccSchema"
            />

            <TextInputZod
              v-model="personaJuridicaStore.direccion"
              name="direccion_extranjero"
              label="Dirección"
              placeholder="Dirección fiscal"
              :schema="direccionAccSchema"
            />

            <SelectInputZod
              v-model="personaJuridicaStore.paisOrigen"
              name="pais_origen_extranjero"
              label="País"
              placeholder="Selecciona el país"
              :options="countriesOptions"
              :schema="paisOrigenAccSchema"
            />
          </div>
        </template>
      </SimpleCardDropDown>
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
              :checked="personaJuridicaStore.tieneRepresentante"
              @update:checked="personaJuridicaStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="personaJuridicaStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
