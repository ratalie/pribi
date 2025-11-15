<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
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
  } from "../../schemas/accionistasSchemas";
      import { useAccionistaJuridicoStore } from "../../stores/forms/useAccionistaJuridicoStore";

  const accionistaJuridicoStore = useAccionistaJuridicoStore();
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
              :checked="accionistaJuridicoStore.seConstituyoEnPeru"
              @update:checked="accionistaJuridicoStore.seConstituyoEnPeru = $event"
            />
          </div>
        </template>
        <template #content>
          <div
            v-if="accionistaJuridicoStore.seConstituyoEnPeru"
            class="grid grid-cols-2 gap-12 px-12 py-10"
          >
            <SearchInputZod
              v-model="accionistaJuridicoStore.numeroDocumento"
              name="numero_ruc"
              label="Número de RUC"
              placeholder="Ingresa el número de RUC"
              :schema="numeroDocumentoJurAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.razonSocial"
              name="razon_social"
              label="Razón Social"
              placeholder="Razón Social"
              :schema="razonSocialAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.nombreComercial"
              name="nombre_comercial"
              label="Nombre Comercial"
              placeholder="Nombre Comercial"
              :schema="nombreComercialAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.direccion"
              name="direccion"
              label="Dirección"
              placeholder="Dirección"
              :schema="direccionAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.distrito"
              name="distrito"
              label="Distrito"
              placeholder="Distrito"
              :schema="distritoAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.provincia"
              name="provincia"
              label="Provincia"
              placeholder="Provincia"
              :schema="provinciaAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.departamento"
              name="departamento"
              label="Departamento"
              placeholder="Departamento"
              :schema="departamentoAccSchema"
            />
          </div>

          <div v-else class="grid grid-cols-2 gap-12 px-12 py-10">
            <TextInputZod
              v-model="accionistaJuridicoStore.tipoDocumento"
              name="tipo_documento_extranjero"
              label="Tipo de Documento"
              placeholder="Escribe el tipo de documento aquí"
              :schema="tipoDocumentoAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.numeroDocumento"
              name="numero_documento_extranjero"
              label="Número de Documento"
              placeholder="Ingresa el número de documento"
              :schema="numeroDocumentoJurAccSchema"
            />

            <TextInputZod
              v-model="accionistaJuridicoStore.razonSocial"
              name="razon_social_extranjero"
              label="Razón Social"
              placeholder="Escribe la razón social aquí"
              :schema="razonSocialAccSchema"
            />

            <SelectInputZod
              v-model="accionistaJuridicoStore.paisOrigen"
              name="pais_origen_extranjero"
              label="País"
              placeholder="Selecciona el país"
              :options="[{ id: 1, value: 'Peru', label: 'Peru' }]"
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
              :checked="accionistaJuridicoStore.tieneRepresentante"
              @update:checked="accionistaJuridicoStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="accionistaJuridicoStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
