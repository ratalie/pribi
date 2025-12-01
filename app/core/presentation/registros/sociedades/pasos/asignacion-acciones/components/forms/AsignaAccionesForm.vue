<script setup lang="ts">
  import { computed } from "vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import { useRegistroAccionesStore } from "../../../acciones/stores/useRegistroAccionesStore";
  import {
    cantidadAccionesSuscritasSchema,
    capitalSocialSchema,
    dividendoPasivoSchema,
    porcentajePagadoSchema,
    precioAccionSchema,
    primaSchema,
    tipoAccionSchema,
  } from "../../schemas/modalAsignarAcciones";
  import { useAsignacionAccionesStore } from "../../stores/useAsignacionAccionesStore";

  const asignacionAccionesStore = useAsignacionAccionesStore();
  const registroAccionesStore = useRegistroAccionesStore();

  // Obtener opciones de acciones disponibles desde el store
  const accionesOptions = computed(() => {
    const acciones = registroAccionesStore.acciones;

    // Si no hay acciones registradas, usar opciones hardcodeadas
    if (acciones.length === 0) {
      return [
        { id: "1", value: "Comunes", label: "Comunes" },
        { id: "2", value: "Preferentes", label: "Preferentes" },
        { id: "3", value: "Clase A", label: "Clase A" },
        { id: "4", value: "Clase B", label: "Clase B" },
      ];
    }

    return acciones.map((accion) => ({
      id: accion.id,
      value: accion.nombreAccion,
      label: accion.nombreAccion,
    }));
  });
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="asignacionAccionesStore.tipoAccion"
      name="tipo_accion"
      label="Tipo de Acción"
      placeholder="Seleccionar"
      :options="accionesOptions"
      :schema="tipoAccionSchema"
    />
    <NumberInputZod
      v-model="asignacionAccionesStore.cantidadAccionesSuscritas"
      name="cantidad_acciones_suscritas"
      label="Cantidad Suscritas de Acciones"
      placeholder="Ingrese cantidad aquí"
      :schema="cantidadAccionesSuscritasSchema"
    />

    <NumberInputZod
      v-model="asignacionAccionesStore.precioAccion"
      name="precio_accion"
      label="Precio Pagado por Acción"
      placeholder="S/ Escribe el precio aquí"
      currency="PEN"
      format="decimal"
      :schema="precioAccionSchema"
    />
    <NumberInputZod
      v-model="asignacionAccionesStore.capitalSocial"
      name="capital_social"
      label="Capital Social"
      placeholder="S/ Capital Social"
      currency="PEN"
      format="decimal"
      :schema="capitalSocialSchema"
    />

    <NumberInputZod
      v-model="asignacionAccionesStore.prima"
      name="prima"
      label="Prima"
      placeholder="S/ Prima"
      currency="PEN"
      format="decimal"
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
      <SimpleSwitchYesNo v-model="asignacionAccionesStore.totalmentePagado" label="" />
    </div>

    <NumberInputZod
      v-if="asignacionAccionesStore.totalmentePagado"
      v-model="asignacionAccionesStore.porcentajePagado"
      name="porcentaje_pagado_por_accion"
      label="Porcentaje Pagado por Acción"
      placeholder="% Porcentaje pagado por acción"
      :schema="porcentajePagadoSchema"
    />
    <NumberInputZod
      v-if="asignacionAccionesStore.totalmentePagado"
      v-model="asignacionAccionesStore.dividendoPasivo"
      name="dividendo_pasivo"
      label="Dividendo Pasivo Total"
      placeholder="% Dividendo pasivo total"
      :schema="dividendoPasivoSchema"
    />
  </div>
</template>
