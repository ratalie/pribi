<template>
  <SlotWrapper>
    <TitleH2
      title="Resumen: Aportes Dinerarios"
      subtitle="Revisa el resumen general del proceso de aporte dinerario."
    />

    <!-- Sección 1: Resumen de Capital e Incremento -->
    <section id="resumen-capital-incremento" class="flex flex-col gap-4 mt-6">
      <div class="flex flex-wrap gap-[30px] items-stretch">
        <!-- Card 1: Capital Social -->
        <div
          class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg h-full"
        >
          <div class="flex flex-col gap-[10px] items-start justify-center p-4 h-full">
            <!-- Título -->
            <div class="flex items-center justify-center w-full">
              <p
                class="font-primary font-semibold text-[20px] leading-[26px] text-primary-800"
              >
                Capital social
              </p>
            </div>

            <!-- Contenido: Antes y Después -->
            <div class="flex items-center justify-between w-full">
              <!-- Antes -->
              <div class="flex flex-col gap-4 items-start">
                <div class="flex items-center">
                  <p
                    class="font-secondary font-semibold text-[14px] leading-[18px] text-gray-700"
                  >
                    Antes
                  </p>
                </div>
                <div class="flex items-center justify-center">
                  <p
                    class="font-secondary font-extrabold text-[16px] leading-[18px] text-gray-800"
                  >
                    {{ formatCurrency(capitalSocialAntes) }}
                  </p>
                </div>
              </div>

              <!-- Flecha -->
              <div class="flex flex-col items-center justify-center">
                <ArrowRight class="w-[18px] h-[18px] text-gray-700 rotate-180" />
              </div>

              <!-- Después -->
              <div class="flex flex-col gap-4 items-start">
                <div class="flex items-center">
                  <p
                    class="font-secondary font-semibold text-[14px] leading-[18px] text-gray-700"
                  >
                    Después
                  </p>
                </div>
                <div class="flex items-center justify-center">
                  <p
                    class="font-secondary font-extrabold text-[16px] leading-[18px] text-[#00b600] text-right"
                  >
                    {{ formatCurrency(capitalSocialDespues) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Incremento -->
        <div
          class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg h-full"
        >
          <div class="flex flex-col items-start justify-center w-full h-full">
            <!-- Título -->
            <div class="flex items-center overflow-clip pb-0 pt-4 px-4">
              <div class="flex items-center justify-center">
                <p
                  class="font-primary font-semibold text-[20px] leading-[26px] text-primary-800"
                >
                  Incremento
                </p>
              </div>
            </div>

            <!-- Contenido -->
            <div class="flex flex-col gap-2 items-start p-4 w-full flex-1">
              <!-- Nuevas Acciones -->
              <div class="flex items-start justify-between w-full">
                <div class="flex-1 flex items-center">
                  <p
                    class="flex-1 font-secondary font-semibold text-[14px] leading-[18px] text-gray-700 whitespace-pre-wrap"
                  >
                    Nuevas Acciones
                  </p>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-extrabold text-[16px] leading-[18px] text-[#00b600] text-right whitespace-pre-wrap"
                  >
                    +{{ nuevasAcciones.toLocaleString("es-PE") }}
                  </p>
                </div>
              </div>

              <!-- Incremento Capital -->
              <div class="flex gap-[5px] items-start w-full">
                <div class="flex items-center justify-center w-[154px]">
                  <p
                    class="flex-1 font-secondary font-semibold text-[14px] leading-[16px] text-gray-700 whitespace-pre-wrap"
                  >
                    Incremento Capital
                  </p>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="font-secondary font-extrabold text-[16px] leading-[18px] text-[#00b600] text-right"
                  >
                    +{{ formatCurrency(incrementoCapital) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Desglose del Aporte -->
        <div
          class="flex-1 min-w-[280px] bg-primary-25 border border-primary-100 rounded-lg h-full"
        >
          <div class="flex flex-col gap-[10px] items-start justify-center p-4 w-full h-full">
            <!-- Título -->
            <div class="flex items-center justify-center w-full">
              <p
                class="font-primary font-semibold text-[20px] leading-[26px] text-primary-800"
              >
                Desglose del Aporte
              </p>
            </div>

            <!-- Contenido -->
            <div class="flex flex-col gap-[6px] items-center w-full">
              <!-- Monto al Capital -->
              <div class="flex items-start justify-between w-full">
                <div class="flex-1 flex items-center">
                  <p
                    class="flex-1 font-secondary font-semibold text-[14px] leading-[18px] text-gray-700 whitespace-pre-wrap"
                  >
                    Monto al Capital
                  </p>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-extrabold text-[16px] leading-[18px] text-gray-800 text-right whitespace-pre-wrap"
                  >
                    {{ formatCurrency(montoAlCapital) }}
                  </p>
                </div>
              </div>

              <!-- Prima de Emisión -->
              <div class="flex gap-[5px] items-start w-full">
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-semibold text-[14px] leading-[16px] text-gray-700 whitespace-pre-wrap"
                  >
                    Prima de Emisión
                  </p>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-extrabold text-[16px] leading-[18px] text-gray-800 text-right whitespace-pre-wrap"
                  >
                    {{ formatCurrency(primaEmision) }}
                  </p>
                </div>
              </div>

              <!-- Línea divisoria -->
              <div class="h-0 w-full border-t border-gray-300"></div>

              <!-- Total Aportado -->
              <div class="flex gap-[5px] items-start w-full">
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-semibold text-[14px] leading-[16px] text-gray-700 whitespace-pre-wrap"
                  >
                    Total Aportado
                  </p>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p
                    class="flex-1 font-secondary font-extrabold text-[16px] leading-[18px] text-gray-800 text-right whitespace-pre-wrap"
                  >
                    {{ formatCurrency(totalAportado) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección 2: Resultado de Votación -->
    <section id="resultado-votacion" class="flex flex-col gap-4 mt-6">
      <div
        class="bg-primary-25 border-2 border-primary-100 rounded-lg flex items-center px-4 py-3 w-full"
      >
        <div class="flex flex-1 flex-col items-center justify-center w-full">
          <p
            class="font-secondary text-[16px] leading-[18px] text-primary-800 text-center tracking-[-0.26px] w-full whitespace-pre-wrap"
          >
            <span class="font-medium">Se</span>
            <span class="font-bold">{{ votacionAprobada ? "aprobó" : "rechazó" }}</span>
            <span class="font-medium">
              {{ votacionAprobada ? " la propuesta de" : " la propuesta de" }} Aumento de
              Capital mediante
            </span>
            <span class="font-bold">Aportes Dinerarios.</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Sección 3: Distribución Accionaria -->
    <section id="distribucion-accionaria" class="flex flex-col gap-4 mt-6">
      <TablaAntesDespuesAD :lista-antes="listaAntes" :lista-despues="listaDespues" />
    </section>

    <!-- Sección 4: Detalles de los Aportes Dinerarios -->
    <section id="detalles-aportes" class="flex flex-col gap-4 mt-6">
      <TablaDetallesAportes :aportantes="listaDetallesAportes" />
    </section>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { ArrowRight } from "lucide-vue-next";
  import TablaAntesDespuesAD from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/resumen/TablaAntesDespuesAD.vue";
  import TablaDetallesAportes from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/resumen/TablaDetallesAportes.vue";
  import { useLoadDataFlowAD } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useLoadDataFlowAD";

  /**
   * Página: Resumen de Aporte Dinerario
   *
   * Vista específica del resumen dentro del punto de acuerdo "Aporte Dinerario".
   *
   * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/resumen
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const {
    capitalSocialAntes,
    capitalSocialDespues,
    nuevasAcciones,
    incrementoCapital,
    montoAlCapital,
    primaEmision,
    totalAportado,
    votacionAprobada,
    listaAntes,
    listaDespues,
    listaDetallesAportes,
  } = useLoadDataFlowAD();

  /**
   * Formatea un número como moneda en soles peruanos (PEN)
   * @param amount - Cantidad a formatear
   * @returns String formateado como "S/ X,XXX.XX"
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
</script>
