<template>
  <FinancialSectionCard
    title="Valores Preliminares"
    anchor-id="valores-preliminares"
  >
    <Form class="flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Columna 1 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="capitalSocialPagadoInicial"
            label="Capital Social Pagado"
            :model-value="store.capitalSocialPagadoInicial"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.capitalSocialPagadoInicial = $event"
          />

          <NumberInputZod
            name="resultadoEjercicioInicial"
            label="Resultado del Ejercicio"
            :model-value="store.resultadoEjercicioInicial"
            placeholder="S/ Escribe el monto aquí"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.resultadoEjercicioInicial = $event"
          />
        </div>

        <!-- Columna 2 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="utilidadPerdidaAcumuladaInicial"
            label="Utilidad o Pérdida Acumulada"
            :model-value="store.utilidadPerdidaAcumuladaInicial"
            placeholder="S/ Escribe el monto aquí"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.utilidadPerdidaAcumuladaInicial = $event"
          />

          <NumberInputZod
            name="patrimonioNetoInicial"
            label="Patrimonio Neto"
            :model-value="store.patrimonioNetoInicial"
            placeholder="S/ Escribe el monto aquí"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.patrimonioNetoInicial = $event"
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



