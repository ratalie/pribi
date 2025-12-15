<template>
  <FinancialSectionCard
    title="Cálculo de la Reserva Legal"
    anchor-id="calculo-reserva-legal"
  >
    <Form class="flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-6">
        <!-- Columna 1 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="capitalSocialSuscrito"
            label="Capital Social Suscrito"
            :model-value="store.capitalSocialSuscrito"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.capitalSocialSuscrito = $event"
          />

          <PorcentajeReservaLegalInput
            :model-value="store.porcentajeReservaLegal"
            @update:model-value="store.porcentajeReservaLegal = $event"
          />

          <NumberInputZod
            name="nuevaReservaLegal"
            label="Nueva Reserva Legal"
            :model-value="store.nuevaReservaLegal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.nuevaReservaLegal = $event"
          />
        </div>

        <!-- Columna 2 -->
        <div class="flex flex-col gap-6">
          <NumberInputZod
            name="reservaLegalActual"
            label="Reserva Legal Actual"
            :model-value="store.reservaLegalActual"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.reservaLegalActual = $event"
          />

          <NumberInputZod
            name="montoReservaLegal"
            label="Monto Destinado a la Reserva Legal"
            :model-value="store.montoReservaLegal"
            placeholder="S/ 0"
            currency="PEN"
            :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
            @update:model-value="store.montoReservaLegal = $event"
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
import PorcentajeReservaLegalInput from "../molecules/PorcentajeReservaLegalInput.vue";

const store = useAplicacionResultadosStore();
</script>



