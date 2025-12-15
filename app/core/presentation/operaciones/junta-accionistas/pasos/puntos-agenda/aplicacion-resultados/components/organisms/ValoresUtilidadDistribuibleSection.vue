<template>
  <FinancialSectionCard
    title="Valores de la Utilidad Distribuible"
    anchor-id="valores-utilidad-distribuible"
  >
    <Form class="flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Columna 1 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="capitalSocialPagadoFinal"
            label="Capital Social Pagado"
            :model-value="store.capitalSocialPagadoFinal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.capitalSocialPagadoFinal = $event"
          />

          <NumberInputZod
            name="resultadoEjercicioFinal"
            label="Resultado del Ejercicio"
            :model-value="store.resultadoEjercicioFinal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.resultadoEjercicioFinal = $event"
          />

          <NumberInputZod
            name="utilidadNoDistribuida"
            label="Utilidad No Distribuida"
            :model-value="store.utilidadNoDistribuida"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.utilidadNoDistribuida = $event"
          />
        </div>

        <!-- Columna 2 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="utilidadPerdidaAcumuladaFinal"
            label="Utilidad o Pérdida Acumulada"
            :model-value="store.utilidadPerdidaAcumuladaFinal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.utilidadPerdidaAcumuladaFinal = $event"
          />

          <NumberInputZod
            name="patrimonioNetoFinal"
            label="Patrimonio Neto"
            :model-value="store.patrimonioNetoFinal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.patrimonioNetoFinal = $event"
          />

          <NumberInputZod
            name="utilidadDistribuibleFinal"
            label="Utilidad Distribuible"
            :model-value="store.utilidadDistribuibleFinal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.utilidadDistribuibleFinal = $event"
          />

          <NumberInputZod
            name="utilidadADistribuir"
            label="Utilidad a Distribuir"
            :model-value="store.utilidadADistribuir"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.utilidadADistribuir = $event"
          />
        </div>
      </div>
    </Form>
  </FinancialSectionCard>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { z } from "zod";
import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
import { useAplicacionResultadosStore } from "../../stores/useAplicacionResultadosStore";
import FinancialSectionCard from "../molecules/FinancialSectionCard.vue";

const store = useAplicacionResultadosStore();
</script>



