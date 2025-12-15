<template>
  <FinancialSectionCard
    title="Cálculo de la Utilidad antes de la Reserva Legal"
    anchor-id="calculo-utilidad-antes-reserva"
  >
    <Form class="flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Columna 1 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="diferenciaPatrimonioCapitalPagado"
            label="Diferencia entre patrimonio y el capital pagado"
            :model-value="store.diferenciaPatrimonioCapitalPagado"
            placeholder="S/ Escribe el monto aquí"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.diferenciaPatrimonioCapitalPagado = $event"
          />
        </div>

        <!-- Columna 2 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="utilidadDistribuibleAntesReservaLegal"
            label="Utilidad Distribuible antes de la Reserva Legal"
            :model-value="store.utilidadDistribuibleAntesReservaLegal"
            placeholder="S/ Escribe el monto aquí"
            currency="PEN"
            :schema="z.number()"
            @update:model-value="store.utilidadDistribuibleAntesReservaLegal = $event"
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



