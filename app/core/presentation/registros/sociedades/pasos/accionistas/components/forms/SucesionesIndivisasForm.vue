<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
import {
  departamentoAccSchema,
  direccionAccSchema,
  distritoAccSchema,
  numeroDocumentoJurAccSchema,
  provinciaAccSchema,
  razonSocialAccSchema,
} from "../../schemas/accionistasSchemas";
import { useAccionistaSucesionesIndivisasStore } from "../../stores/forms/useAccionistaSucesionesIndivisasStore";

  const accionistaSucesionesIndivisasStore = useAccionistaSucesionesIndivisasStore();
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- formulario sucesiones indivisas -->
    <div class="grid grid-cols-2 gap-12">
      <SearchInputZod
        v-model="accionistaSucesionesIndivisasStore.numeroDocumento"
        name="numero_ruc"
        label="Número de RUC"
        placeholder="Ingresa el número de RUC"
        :schema="numeroDocumentoJurAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucesionesIndivisasStore.razonSocial"
        name="razon_social"
        label="Razón Social"
        placeholder="Razón Social"
        :schema="razonSocialAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucesionesIndivisasStore.distrito"
        name="distrito"
        label="Distrito"
        placeholder="Distrito"
        :schema="distritoAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucesionesIndivisasStore.provincia"
        name="provincia"
        label="Provincia"
        placeholder="Provincia"
        :schema="provinciaAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucesionesIndivisasStore.departamento"
        name="departamento"
        label="Departamento"
        placeholder="Departamento"
        :schema="departamentoAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucesionesIndivisasStore.direccion"
        name="direccion"
        label="Dirección"
        placeholder="Dirección"
        :schema="direccionAccSchema"
      />
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
              :checked="accionistaSucesionesIndivisasStore.tieneRepresentante"
              @update:checked="accionistaSucesionesIndivisasStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="accionistaSucesionesIndivisasStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
