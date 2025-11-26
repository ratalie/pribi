<script setup lang="ts">
import SeleccionPuntosAgenda from "~/components/juntas/SeleccionPuntosAgenda.vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Selección de Puntos de Agenda
 * 
 * Paso 1 del flujo de Juntas de Accionistas.
 * Permite seleccionar los puntos de agenda que se tratarán en la junta.
 * Los puntos seleccionados determinan qué sub-steps aparecerán en el Paso 4.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/seleccion-agenda
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

const route = useRoute();
const juntaId = computed(() => route.params.id as string);

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // Validar que al menos un punto esté seleccionado
  const juntasFlowStore = useJuntasFlowStore();
  const selectedPuntos = juntasFlowStore.getDynamicSubSteps;

  if (selectedPuntos.length === 0) {
    throw new Error("Debes seleccionar al menos un punto de agenda para continuar.");
  }

  // Aquí se puede agregar lógica adicional de guardado si es necesario
  // Por ahora, los puntos ya están guardados en el store cuando se seleccionan
});
</script>

<template>
  <section class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h2 class="text-2xl font-bold font-primary text-gray-900 mb-2">
        Selección de Puntos de Agenda
      </h2>
      <p class="text-gray-600 font-secondary">
        Selecciona los puntos de agenda que se tratarán en la junta de accionistas. Los puntos
        seleccionados aparecerán como sub-pasos en el Paso 4 (Puntos de Acuerdo).
      </p>
    </div>

    <SeleccionPuntosAgenda />
  </section>
</template>

