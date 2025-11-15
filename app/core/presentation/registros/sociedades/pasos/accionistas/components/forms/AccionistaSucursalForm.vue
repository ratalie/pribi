<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import PersonaNatural from "~/components/composite/forms/PersonaNatural.vue";
import {
  domicilioFiscalAccSchema,
  nombreSucursalAccSchema,
  numeroDocumentoJurAccSchema,
  partidaRegistralAccSchema,
  sedeRegistralAccSchema,
} from "../../schemas/accionistasSchemas";
import { useAccionistaSucursalStore } from "../../stores/forms/useAccionistaSucursalStore";

  const accionistaSucursalStore = useAccionistaSucursalStore();
</script>

<template>
  <div class="flex flex-col gap-12">
    <!-- formulario sucursal-->
    <div class="grid grid-cols-2 gap-12">
      <SearchInputZod
        v-model="accionistaSucursalStore.numeroDocumento"
        name="numero_ruc"
        label="Número de RUC"
        placeholder="Ingresa el número de RUC"
        :schema="numeroDocumentoJurAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucursalStore.nombreSucursal"
        name="nombre_sucursal"
        label="Nombre de la Sucursal"
        placeholder="Nombre de la Sucursal"
        :schema="nombreSucursalAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucursalStore.partidaRegistral"
        name="partida_registral"
        label="Partida Registral"
        placeholder="Partida Registral"
        :schema="partidaRegistralAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucursalStore.sedeRegistral"
        name="direccion"
        label="Sede Registral"
        placeholder="Sede Registral"
        :schema="sedeRegistralAccSchema"
      />

      <TextInputZod
        v-model="accionistaSucursalStore.domicilioFiscal"
        name="domicilio_fiscal"
        label="Domicilio Fiscal"
        placeholder="Domicilio Fiscal"
        :schema="domicilioFiscalAccSchema"
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
              :checked="accionistaSucursalStore.tieneRepresentante"
              @update:checked="accionistaSucursalStore.tieneRepresentante = $event"
            />
          </div>
        </template>
        <template v-if="accionistaSucursalStore.tieneRepresentante" #content>
          <PersonaNatural class="px-12 py-10" />
        </template>
      </SimpleCardDropDown>
    </div>
  </div>
</template>
