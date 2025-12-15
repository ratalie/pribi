<template>
  <div class="flex flex-col gap-10">
    <!-- Sub-sección: Valores Preliminares -->
    <div id="valores-preliminares" class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Valores Preliminares</p>
      <SimpleCard>
        <Form class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Columna 1 -->
            <div class="flex flex-col gap-6">
              <!-- Capital Social Pagado Inicial -->
              <NumberInputZod
                name="capitalSocialPagadoInicial"
                label="Capital Social Pagado"
                :model-value="store.capitalSocialPagadoInicial"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                @update:model-value="store.capitalSocialPagadoInicial = $event"
              />

              <!-- Resultado del Ejercicio Inicial -->
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
              <!-- Utilidad o Pérdida Acumulada Inicial -->
              <NumberInputZod
                name="utilidadPerdidaAcumuladaInicial"
                label="Utilidad o Pérdida Acumulada"
                :model-value="store.utilidadPerdidaAcumuladaInicial"
                placeholder="S/ Escribe el monto aquí"
                currency="PEN"
                :schema="z.number()"
                @update:model-value="store.utilidadPerdidaAcumuladaInicial = $event"
              />

              <!-- Patrimonio Neto Inicial -->
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
      </SimpleCard>
    </div>

    <!-- Sub-sección: Cálculo de la Utilidad antes de la Reserva Legal -->
    <div id="calculo-utilidad-antes-reserva" class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">
        Cálculo de la Utilidad antes de la Reserva Legal
      </p>
      <SimpleCard>
        <Form class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Columna 1 -->
            <div class="flex flex-col gap-6">
              <!-- Diferencia entre patrimonio y el capital pagado -->
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
              <!-- Utilidad Distribuible antes de la Reserva -->
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
      </SimpleCard>
    </div>

    <!-- Sub-sección: Cálculo de la Reserva Legal -->
    <div id="calculo-reserva-legal" class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Cálculo de la Reserva Legal</p>
      <SimpleCard>
        <Form class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Columna 1 -->
            <div class="flex flex-col gap-6">
              <!-- Capital Social Suscrito -->
              <NumberInputZod
                name="capitalSocialSuscrito"
                label="Capital Social Suscrito"
                :model-value="store.capitalSocialSuscrito"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                @update:model-value="store.capitalSocialSuscrito = $event"
              />

              <!-- Porcentaje a detraerse como Reserva Legal -->
              <div class="flex flex-col w-full">
                <label
                  for="porcentajeReservaLegal"
                  class="t-t2 font-secondary text-gray-800 font-bold mb-5"
                >
                  Porcentaje a detraerse como Reserva Legal
                </label>
                <div
                  class="relative flex items-center gap-[5px] border border-gray-500 rounded-md bg-background h-10 px-3"
                >
                  <input
                    id="porcentajeReservaLegal"
                    type="text"
                    :value="
                      store.porcentajeReservaLegal === 0
                        ? ''
                        : store.porcentajeReservaLegal
                    "
                    placeholder="0"
                    class="w-full border-none bg-transparent outline-none focus:outline-none focus:ring-0 p-0 font-secondary t-t2"
                    @input="
                      (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const value = target.value === '' ? 0 : parseFloat(target.value) || 0;
                        store.porcentajeReservaLegal = value;
                      }
                    "
                  />
                  <span class="font-secondary font-bold text-gray-700 shrink-0 t-t2">%</span>
                </div>
                <p class="t-t2 font-secondary text-gray-600 mt-1">
                  Entre 10% y 20%, salvo que se necesite menos para llegar al 20% del capital
                </p>
              </div>

              <!-- Nueva Reserva Legal -->
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
              <!-- Reserva Legal Actual -->
              <NumberInputZod
                name="reservaLegalActual"
                label="Reserva Legal Actual"
                :model-value="store.reservaLegalActual"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                @update:model-value="store.reservaLegalActual = $event"
              />

              <!-- Monto Destinado a la Reserva Legal -->
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
      </SimpleCard>
    </div>

    <!-- Sub-sección: Valores de la Utilidad Distribuible -->
    <div id="valores-utilidad-distribuible" class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Valores de la Utilidad Distribuible</p>
      <SimpleCard>
        <Form class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Columna 1 -->
            <div class="flex flex-col gap-6">
              <!-- Capital Social Pagado Final -->
              <NumberInputZod
                name="capitalSocialPagadoFinal"
                label="Capital Social Pagado"
                :model-value="store.capitalSocialPagadoFinal"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                @update:model-value="store.capitalSocialPagadoFinal = $event"
              />

              <!-- Resultado del Ejercicio Final -->
              <NumberInputZod
                name="resultadoEjercicioFinal"
                label="Resultado del Ejercicio"
                :model-value="store.resultadoEjercicioFinal"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number()"
                @update:model-value="store.resultadoEjercicioFinal = $event"
              />

              <!-- Utilidad No Distribuida -->
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
              <!-- Utilidad o Pérdida Acumulada Final -->
              <NumberInputZod
                name="utilidadPerdidaAcumuladaFinal"
                label="Utilidad o Pérdida Acumulada"
                :model-value="store.utilidadPerdidaAcumuladaFinal"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number()"
                @update:model-value="store.utilidadPerdidaAcumuladaFinal = $event"
              />

              <!-- Patrimonio Neto Final -->
              <NumberInputZod
                name="patrimonioNetoFinal"
                label="Patrimonio Neto"
                :model-value="store.patrimonioNetoFinal"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number()"
                @update:model-value="store.patrimonioNetoFinal = $event"
              />

              <!-- Utilidad Distribuible Final -->
              <NumberInputZod
                name="utilidadDistribuibleFinal"
                label="Utilidad Distribuible"
                :model-value="store.utilidadDistribuibleFinal"
                placeholder="S/ 0"
                currency="PEN"
                :schema="z.number()"
                @update:model-value="store.utilidadDistribuibleFinal = $event"
              />

              <!-- Utilidad a Distribuir -->
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
      </SimpleCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { z } from "zod";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import { useAplicacionResultadosStore } from "../stores/useAplicacionResultadosStore";
  import { useAplicacionResultadosController } from "../composables/useAplicacionResultadosController";

  const route = useRoute();
  const store = useAplicacionResultadosStore();
  const { cargarDatos } = useAplicacionResultadosController();

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos();
  });

  // Función para hacer scroll a un elemento por su ID
  const scrollToAnchor = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Hacer scroll cuando se carga la página con un hash
  onMounted(() => {
    const hash = route.hash?.replace("#", "");
    if (hash) {
      scrollToAnchor(hash);
    }
  });
</script>


