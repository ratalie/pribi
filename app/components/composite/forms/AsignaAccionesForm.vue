<script setup lang="ts">
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import { accionTypes } from "~/constants/inputs/acciones-types";
 import {
    tipoAccionSchema,
    cantidadAccionesSuscritasSchema,
    capitalSocialSchema,
    dividendoPasivoSchema,
    porcentajePagadoSchema,
    precioAccionSchema,
    primaSchema,
  } from "~/modules/registro-sociedades/schemas/modalAsignarAcciones";

  const asignacionAccionesStore = useAsignacionAccionesStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="asignacionAccionesStore.tipoAccion"
      name="tipo_accion"
      label="Tipo de Acción"
      placeholder="Seleccionar"
      :options="accionTypes"
      :schema="tipoAccionSchema"
    />
    <TextInputZod
      v-model="asignacionAccionesStore.cantidadAccionesSuscritas"
      name="cantidad_acciones_suscritas"
      label="Cantidad Suscritas de Acciones"
      placeholder="Ingrese cantidad aquí"
      :schema="cantidadAccionesSuscritasSchema"
    />

    <TextInputZod
      v-model="asignacionAccionesStore.precioAccion"
      name="nombre"
      label="Precio Pagado por Acción"
      placeholder="S/ Escribe el precio aquí"
      :schema="precioAccionSchema"
    />
    <TextInputZod
      v-model="asignacionAccionesStore.capitalSocial"
      name="capital_social"
      label="Capital Social"
      placeholder="S/ Capital Social"
      :schema="capitalSocialSchema"
    />

    <TextInputZod
      v-model="asignacionAccionesStore.prima"
      name="prima"
      label="Prima"
      placeholder="S/ Prima"
      :schema="primaSchema"
    />
    <div />

    <div class="flex justify-between gap-2 col-span-2">
      <div class="flex flex-col gap-2">
        <label for="voto-dirimente" class="t-t2 font-secondary text-gray-800 font-bold">
          ¿Todas las Acciones han sido pagadas al 100%?
        </label>
        <span class="t-b2 text-gray-500 font-secondary">
          Selecciona una de las dos opciones.
        </span>
      </div>
      <SimpleSwitchYesNo v-model="asignacionAccionesStore.totalmentePagado" label=""/>
    </div>

    <TextInputZod
      v-model="asignacionAccionesStore.porcentajePagado"
      name="porcentaje_pagado_por_accion"
      label="Porcentaje Pagado por Acción"
      placeholder="% Porcentaje pagado por acción"
      :schema="porcentajePagadoSchema"
    />
    <TextInputZod
      v-model="asignacionAccionesStore.dividendoPasivo"
      name="dividendo_pasivo"
      label="Dividendo Pasivo Total"
      placeholder="% Dividendo pasivo total"
      :schema="dividendoPasivoSchema"
    />
  </div>
</template>
