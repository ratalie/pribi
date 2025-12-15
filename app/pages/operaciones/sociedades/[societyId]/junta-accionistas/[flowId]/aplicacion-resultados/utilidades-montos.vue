<template>
  <SlotWrapper>
    <TitleH2
      title="Análisis del Patrimonio Neto"
      subtitle="Define el destino de las utilidades del ejercicio y montos a distribuir."
      title-color="text-primary-800"
    />

    <div class="flex flex-col gap-10">
      <!-- Sub-sección: Valores Preliminares -->
      <div id="valores-preliminares" class="flex flex-col gap-4">
        <p class="t-h5 text-gray-800 font-primary">Valores Preliminares</p>
        <SimpleCard>
          <Form class="flex flex-col gap-6">
            <div class="grid grid-cols-2 gap-6">
              <!-- Columna 1 -->
              <div class="flex flex-col gap-6">
                <!-- Capital Social Pagado -->
                <NumberInputZod
                  name="capitalSocialPagado"
                  label="Capital Social Pagado"
                  :model-value="formData.capitalSocialPagado"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.capitalSocialPagado = $event"
                />

                <!-- Utilidad o Pérdida del Ejercicio -->
                <NumberInputZod
                  name="utilidadPerdidaEjercicio"
                  label="Utilidad o Pérdida del Ejercicio"
                  :model-value="formData.utilidadPerdidaEjercicio"
                  placeholder="S/ Escribe el monto aquí"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.utilidadPerdidaEjercicio = $event"
                />
              </div>

              <!-- Columna 2 -->
              <div class="flex flex-col gap-6">
                <!-- Utilidad o Pérdida Acumulada -->
                <NumberInputZod
                  name="utilidadPerdidaAcumulada"
                  label="Utilidad o Pérdida Acumulada"
                  :model-value="formData.utilidadPerdidaAcumulada"
                  placeholder="S/ Escribe el monto aquí"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.utilidadPerdidaAcumulada = $event"
                />

                <!-- Patrimonio Neto -->
                <NumberInputZod
                  name="patrimonioNeto"
                  label="Patrimonio Neto"
                  :model-value="formData.patrimonioNeto"
                  placeholder="S/ Escribe el monto aquí"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.patrimonioNeto = $event"
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
                  name="diferenciaPatrimonioCapital"
                  label="Diferencia entre patrimonio y el capital pagado"
                  :model-value="formData.diferenciaPatrimonioCapital"
                  placeholder="S/ Escribe el monto aquí"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.diferenciaPatrimonioCapital = $event"
                />
              </div>

              <!-- Columna 2 -->
              <div class="flex flex-col gap-6">
                <!-- Utilidad Distribuible antes de la Reserva -->
                <NumberInputZod
                  name="utilidadDistribuibleAntesReserva"
                  label="Utilidad Distribuible antes de la Reserva"
                  :model-value="formData.utilidadDistribuibleAntesReserva"
                  placeholder="S/ Escribe el monto aquí"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.utilidadDistribuibleAntesReserva = $event"
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
                  :model-value="formData.capitalSocialSuscrito"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.capitalSocialSuscrito = $event"
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
                        formData.porcentajeReservaLegal === 0
                          ? ''
                          : formData.porcentajeReservaLegal
                      "
                      placeholder="0"
                      class="w-full border-none bg-transparent outline-none focus:outline-none focus:ring-0 p-0 font-secondary t-t2"
                      @input="
                        (e: Event) => {
                          const target = e.target as HTMLInputElement;
                          const value = target.value === '' ? 0 : parseFloat(target.value) || 0;
                          formData.porcentajeReservaLegal = value;
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
                  :model-value="formData.nuevaReservaLegal"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.nuevaReservaLegal = $event"
                />
              </div>

              <!-- Columna 2 -->
              <div class="flex flex-col gap-6">
                <!-- Reserva Legal Actual -->
                <NumberInputZod
                  name="reservaLegalActual"
                  label="Reserva Legal Actual"
                  :model-value="formData.reservaLegalActual"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.reservaLegalActual = $event"
                />

                <!-- Monto Destinado a la Reserva Legal -->
                <NumberInputZod
                  name="montoDestinadoReservaLegal"
                  label="Monto Destinado a la Reserva Legal"
                  :model-value="formData.montoDestinadoReservaLegal"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.montoDestinadoReservaLegal = $event"
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
                <!-- Capital Social Pagado -->
                <NumberInputZod
                  name="capitalSocialPagadoDistribuible"
                  label="Capital Social Pagado"
                  :model-value="formData.capitalSocialPagadoDistribuible"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.capitalSocialPagadoDistribuible = $event"
                />

                <!-- Utilidad o Pérdida del Ejercicio -->
                <NumberInputZod
                  name="utilidadPerdidaEjercicioDistribuible"
                  label="Utilidad o Pérdida del Ejercicio"
                  :model-value="formData.utilidadPerdidaEjercicioDistribuible"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.utilidadPerdidaEjercicioDistribuible = $event"
                />

                <!-- Reserva Voluntaria -->
                <NumberInputZod
                  name="reservaVoluntaria"
                  label="Reserva Voluntaria"
                  :model-value="formData.reservaVoluntaria"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number().min(0, 'El monto debe ser mayor o igual a 0')"
                  @update:model-value="formData.reservaVoluntaria = $event"
                />
              </div>

              <!-- Columna 2 -->
              <div class="flex flex-col gap-6">
                <!-- Utilidad o Pérdida Acumulada -->
                <NumberInputZod
                  name="utilidadPerdidaAcumuladaDistribuible"
                  label="Utilidad o Pérdida Acumulada"
                  :model-value="formData.utilidadPerdidaAcumuladaDistribuible"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.utilidadPerdidaAcumuladaDistribuible = $event"
                />

                <!-- Patrimonio Neto -->
                <NumberInputZod
                  name="patrimonioNetoDistribuible"
                  label="Patrimonio Neto"
                  :model-value="formData.patrimonioNetoDistribuible"
                  placeholder="S/ 0"
                  currency="PEN"
                  :schema="z.number()"
                  @update:model-value="formData.patrimonioNetoDistribuible = $event"
                />
              </div>
            </div>
          </Form>
        </SimpleCard>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { nextTick, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { z } from "zod";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useAplicacionResultadosController } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/composables/useAplicacionResultadosController";
  import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";
  import { useAplicacionResultadosStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/stores/useAplicacionResultadosStore";

  /**
   * Página: Utilidades y Montos a Distribuir
   *
   * Sub-sección de Aplicación de Resultados.
   * Esta página contiene 4 sub-secciones que son anclas dentro de la misma página.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados/utilidades-montos
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();

  // Estado del formulario - Sección 1: Valores Preliminares
  const formData = ref({
    capitalSocialPagado: 0,
    utilidadPerdidaEjercicio: 0,
    utilidadPerdidaAcumulada: 0,
    patrimonioNeto: 0,
    // Sección 2: Cálculo de la Utilidad antes de la Reserva Legal
    diferenciaPatrimonioCapital: 0,
    utilidadDistribuibleAntesReserva: 0,
    // Sección 3: Cálculo de la Reserva Legal
    capitalSocialSuscrito: 0,
    porcentajeReservaLegal: 0,
    nuevaReservaLegal: 0,
    reservaLegalActual: 0,
    montoDestinadoReservaLegal: 0,
    // Sección 4: Valores de la Utilidad Distribuible
    capitalSocialPagadoDistribuible: 0,
    utilidadPerdidaEjercicioDistribuible: 0,
    reservaVoluntaria: 0,
    utilidadPerdidaAcumuladaDistribuible: 0,
    patrimonioNetoDistribuible: 0,
  });

  // Función para hacer scroll a un elemento por su ID
  const scrollToAnchor = (anchorId: string) => {
    nextTick(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    });
  };

  // ✅ Conectar con el controller para guardar y cargar datos
  const { handleNext, cargarDatos } = useAplicacionResultadosController();
  const { societyId, flowIdNumber } = useJuntasRouteParams();
  const store = useAplicacionResultadosStore();

  // ✅ Sincronizar store → formData (cuando se cargan datos del backend)
  const syncStoreToFormData = () => {
    console.log("🔄 [UtilidadesMontos] Sincronizando store → formData...");
    console.log("🔄 [UtilidadesMontos] Store:", {
      capitalSocialPagadoInicial: store.capitalSocialPagadoInicial,
      patrimonioNetoInicial: store.patrimonioNetoInicial,
    });
    
    // Mapear campos del store al formulario
    // Valores Preliminares
    formData.value.capitalSocialPagado = store.capitalSocialPagadoInicial;
    formData.value.utilidadPerdidaAcumulada = store.utilidadPerdidaAcumuladaInicial;
    formData.value.utilidadPerdidaEjercicio = store.resultadoEjercicioInicial;
    formData.value.patrimonioNeto = store.patrimonioNetoInicial;
    
    // Cálculo Utilidad Antes de Reserva Legal
    formData.value.diferenciaPatrimonioCapital = store.diferenciaPatrimonioCapitalPagado;
    formData.value.utilidadDistribuibleAntesReserva = store.utilidadDistribuibleAntesReservaLegal;
    
    // Cálculo de Reserva Legal
    formData.value.capitalSocialSuscrito = store.capitalSocialSuscrito;
    formData.value.reservaLegalActual = store.reservaLegalActual;
    formData.value.porcentajeReservaLegal = store.porcentajeReservaLegal;
    formData.value.montoDestinadoReservaLegal = store.montoReservaLegal;
    formData.value.nuevaReservaLegal = store.nuevaReservaLegal;
    
    // Valores Finales
    formData.value.capitalSocialPagadoDistribuible = store.capitalSocialPagadoFinal;
    formData.value.utilidadPerdidaAcumuladaDistribuible = store.utilidadPerdidaAcumuladaFinal;
    formData.value.utilidadPerdidaEjercicioDistribuible = store.resultadoEjercicioFinal;
    formData.value.patrimonioNetoDistribuible = store.patrimonioNetoFinal;
    
    console.log("✅ [UtilidadesMontos] Sincronización store → formData completada");
    console.log("✅ [UtilidadesMontos] formData actualizado:", formData.value);
  };

  // Hacer scroll cuando cambia el hash
  watch(
    () => route.hash,
    (newHash) => {
      if (newHash) {
        const anchorId = newHash.replace("#", "");
        scrollToAnchor(anchorId);
      }
    }
  );

  // ✅ Cargar datos del backend al montar
  onMounted(async () => {
    console.log("📥 [UtilidadesMontos] Montando componente, cargando datos del backend...");
    console.log("📥 [UtilidadesMontos] societyId:", societyId.value, "flowId:", flowIdNumber.value);
    
    try {
      // Cargar datos del backend
      await cargarDatos();
      
      // Sincronizar store → formData después de cargar
      syncStoreToFormData();
      
      console.log("✅ [UtilidadesMontos] Datos cargados y sincronizados exitosamente");
    } catch (error: any) {
      console.error("❌ [UtilidadesMontos] Error al cargar datos:", error);
      // No bloquear la UI, el usuario puede seguir trabajando
    }
    
    // Hacer scroll cuando se carga la página con un hash
    const hash = route.hash?.replace("#", "");
    if (hash) {
      scrollToAnchor(hash);
    }
  });

  // ✅ Sincronizar formData local con el store antes de guardar
  const syncFormDataToStore = () => {
    console.log("🔄 [UtilidadesMontos] Sincronizando formData con store...");
    console.log("🔄 [UtilidadesMontos] formData:", formData.value);
    
    // Mapear campos del formulario al store
    // Valores Preliminares
    store.capitalSocialPagadoInicial = formData.value.capitalSocialPagado;
    store.utilidadPerdidaAcumuladaInicial = formData.value.utilidadPerdidaAcumulada;
    store.resultadoEjercicioInicial = formData.value.utilidadPerdidaEjercicio;
    store.patrimonioNetoInicial = formData.value.patrimonioNeto;
    
    // Cálculo Utilidad Antes de Reserva Legal
    store.diferenciaPatrimonioCapitalPagado = formData.value.diferenciaPatrimonioCapital;
    store.utilidadDistribuibleAntesReservaLegal = formData.value.utilidadDistribuibleAntesReserva;
    
    // Cálculo de Reserva Legal
    store.capitalSocialSuscrito = formData.value.capitalSocialSuscrito;
    store.reservaLegalActual = formData.value.reservaLegalActual;
    store.porcentajeReservaLegal = formData.value.porcentajeReservaLegal;
    store.montoReservaLegal = formData.value.montoDestinadoReservaLegal;
    store.nuevaReservaLegal = formData.value.nuevaReservaLegal;
    
    // Valores Finales
    store.capitalSocialPagadoFinal = formData.value.capitalSocialPagadoDistribuible;
    store.utilidadPerdidaAcumuladaFinal = formData.value.utilidadPerdidaAcumuladaDistribuible;
    store.resultadoEjercicioFinal = formData.value.utilidadPerdidaEjercicioDistribuible;
    store.patrimonioNetoFinal = formData.value.patrimonioNetoDistribuible;
    
    console.log("✅ [UtilidadesMontos] Sincronización completada");
    console.log("✅ [UtilidadesMontos] Store actualizado:", {
      capitalSocialPagadoInicial: store.capitalSocialPagadoInicial,
      patrimonioNetoInicial: store.patrimonioNetoInicial,
    });
  };

  // Configurar el botón "Siguiente"
  console.log("⚙️ [UtilidadesMontos] Configurando handler de 'Siguiente'...");
  useJuntasFlowNext(async () => {
    console.log("🚀 [UtilidadesMontos] Handler ejecutado - Guardando datos antes de navegar...");
    console.log("🚀 [UtilidadesMontos] societyId:", societyId.value, "flowId:", flowIdNumber.value);
    
    try {
      // Sincronizar formulario con store
      syncFormDataToStore();
      
      // Guardar usando el controller
      console.log("💾 [UtilidadesMontos] Llamando handleNext del controller...");
      await handleNext(societyId.value, flowIdNumber.value);
      
      console.log("✅ [UtilidadesMontos] Datos guardados exitosamente");
    } catch (error: any) {
      console.error("❌ [UtilidadesMontos] Error al guardar:", error);
      throw error; // Re-lanzar para que useJuntasFlowNext no navegue
    }
  });
  console.log("✅ [UtilidadesMontos] Handler configurado");
</script>
