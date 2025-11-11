<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
  import { tipoFondoOptions } from "~/constants/inputs/tipo-fondos";
  import {
    direccionAccSchema,
    numeroDocumentoJurAccSchema,
    razonSocialAccSchema,
    tipoFondoAccSchema,
  } from "~/modules/registro-sociedades/schemas/accionistasSchemas";
  import { useAccionistaFondosInversionStore } from "~/modules/registro-sociedades/stores/modal/accionistas/useAccionistaFondosInversionStore";

  const accionistaFondosInversionStore = useAccionistaFondosInversionStore();
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- formulario fondos de inversión -->
    <div class="grid grid-cols-2 gap-12">
      <SearchInputZod
        v-model="accionistaFondosInversionStore.numeroDocumento"
        name="numero_documento"
        label="Número de documento"
        placeholder="Ingresa el número de documento"
        :schema="numeroDocumentoJurAccSchema"
      />

      <TextInputZod
        v-model="accionistaFondosInversionStore.razonSocial"
        name="razon_social"
        label="Razón Social"
        placeholder="Razón Social"
        :schema="razonSocialAccSchema"
      />

      <TextInputZod
        v-model="accionistaFondosInversionStore.direccion"
        name="direccion"
        label="Dirección"
        placeholder="Escribe la Dirección aquí"
        :schema="direccionAccSchema"
      />

      <SelectInputZod
        v-model="accionistaFondosInversionStore.tipoFondo"
        name="tipo_fondo"
        label="Tipo de Fondo"
        placeholder="Selecciona el tipo de Fondo"
        :options="tipoFondoOptions"
        :schema="tipoFondoAccSchema"
      />
    </div>

    <div class="flex flex-col gap-4">
      <p class="t-h6 text-gray-800 font-semibold font-primary">
        Datos de la Sociedad Administradora
      </p>

      <div class="grid grid-cols-2 gap-12 border rounded-lg px-12 py-6">
        <SearchInputZod
          v-model="accionistaFondosInversionStore.numeroDocumentoSociedadAdministradora"
          name="numero_sociedad_administradora"
          label="Número de RUC"
          placeholder="Ingresa el número de la Sociedad Administradora"
          :schema="numeroDocumentoJurAccSchema"
        />

        <TextInputZod
          v-model="accionistaFondosInversionStore.razonSocialSociedadAdministradora"
          name="razon_social_sociedad_administradora"
          label="Razón Social"
          placeholder="Razón Social de la Sociedad Administradora"
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
              :checked="accionistaFondosInversionStore.tieneRepresentante"
              @update:checked="accionistaFondosInversionStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="accionistaFondosInversionStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
