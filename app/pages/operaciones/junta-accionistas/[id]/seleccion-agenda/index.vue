<script setup lang="ts">
import SeleccionPuntosAgenda from "~/components/juntas/SeleccionPuntosAgenda.vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";

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

// Stores
const juntasFlowStore = useJuntasFlowStore();
const agendaItemsStore = useAgendaItemsStore();
const juntaHistorialStore = useJuntaHistorialStore();

// Obtener societyId del store de juntas historial
const societyId = computed(() => {
  // Intentar obtener del store de historial
  if (juntaHistorialStore.selectedSocietyId) {
    return juntaHistorialStore.selectedSocietyId;
  }
  // Si no está en el store, intentar obtener de la junta actual
  const junta = juntaHistorialStore.juntas.find((j) => j.id === juntaId.value);
  return junta?.societyId ?? null;
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // Validar que al menos un punto esté seleccionado
  const selectedPuntos = juntasFlowStore.getDynamicSubSteps;

  if (selectedPuntos.length === 0) {
    throw new Error("Debes seleccionar al menos un punto de agenda para continuar.");
  }

  // Validar que tengamos societyId y flowId
  if (!societyId.value || !juntaId.value) {
    throw new Error("No se pudo identificar la sociedad o la junta. Por favor, recarga la página.");
  }

  // Convertir IDs del frontend a estructura del backend
  const payload = AgendaItemsMapper.frontendIdsToDTO(selectedPuntos);

  // Guardar en el backend
  const flowIdNumber = parseInt(juntaId.value, 10);
  if (Number.isNaN(flowIdNumber)) {
    throw new Error("ID de junta inválido.");
  }

  await agendaItemsStore.saveAgendaItems(societyId.value, flowIdNumber, payload);
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

    <SeleccionPuntosAgenda :society-id="societyId" :flow-id="juntaId" />
  </section>
</template>

