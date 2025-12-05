<script setup lang="ts">
import { computed } from "vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useSeleccionAgendaController } from "./composables/useSeleccionAgendaController";
import SlotWrapper from "~/components/containers/SlotWrapper.vue";
import TitleH2 from "~/components/titles/TitleH2.vue";
import SimpleCard from "~/components/base/cards/SimpleCard.vue";
import CardTitle from "~/components/base/cards/CardTitle.vue";
import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";

/**
 * Manager: Selección de Puntos de Agenda
 * 
 * Paso 1 del flujo de Juntas de Accionistas.
 * Permite seleccionar los puntos de agenda que se tratarán en la junta.
 * 
 * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/seleccion-agenda
 */

// ========================================
// PAGE META
// ========================================
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// ========================================
// ROUTE PARAMS
// ========================================
const route = useRoute();
const juntaId = computed(() => route.params.flowId as string);

// ========================================
// CONTROLLER
// ========================================
const {
  puntosSeleccionados,
  loading,
  error,
  togglePunto,
  isPuntoSeleccionado,
  handleNext,
} = useSeleccionAgendaController(juntaId);

// ========================================
// CONFIGURAR BOTÓN SIGUIENTE
// ========================================
useJuntasFlowNext(handleNext);

// ========================================
// PUNTOS DE AGENDA DISPONIBLES
// ========================================
const puntosDisponibles = [
  // Aumento de Capital
  { id: "aporte-dinerarios", nombre: "Aporte Dinerario", categoria: "Aumento de Capital" },
  { id: "aporte-no-dinerario", nombre: "Aporte no Dinerario", categoria: "Aumento de Capital" },
  { id: "capitalizacion-creditos", nombre: "Capitalización de Créditos", categoria: "Aumento de Capital" },
  
  // Nombramiento
  { id: "nombramiento-gerente", nombre: "Nombramiento de Gerente General", categoria: "Nombramiento" },
  { id: "nombramiento-apoderados", nombre: "Nombramiento de Apoderados", categoria: "Nombramiento" },
  { id: "nombramiento-directores", nombre: "Nombramiento de Directores", categoria: "Nombramiento" },
  { id: "nombramiento-nuevo-directorio", nombre: "Nombramiento de Directorio", categoria: "Nombramiento" },
  { id: "delegacion-auditores", nombre: "Designación de Auditores Externos", categoria: "Nombramiento" },
  
  // Remoción
  { id: "remocion-gerente", nombre: "Remoción de Gerente General", categoria: "Remoción" },
  { id: "remocion-apoderados", nombre: "Remoción de Apoderados", categoria: "Remoción" },
  { id: "remocion-directores", nombre: "Remoción de Directores", categoria: "Remoción" },
  
  // Gestión Social
  { id: "pronunciamiento-gestion", nombre: "Pronunciamiento sobre Gestión", categoria: "Gestión Social y Resultados Económicos" },
  { id: "aplicacion-resultados", nombre: "Aplicación de Resultados", categoria: "Gestión Social y Resultados Económicos" },
  { id: "estados-financieros", nombre: "Estados Financieros", categoria: "Gestión Social y Resultados Económicos" },
  { id: "reparto-dividendos", nombre: "Reparto de Dividendos", categoria: "Gestión Social y Resultados Económicos" },
];

// Agrupar por categoría
const categorias = computed(() => {
  const grupos: Record<string, typeof puntosDisponibles> = {};
  
  puntosDisponibles.forEach(punto => {
    if (!grupos[punto.categoria]) {
      grupos[punto.categoria] = [];
    }
    grupos[punto.categoria]!.push(punto);
  });
  
  return grupos;
});
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Puntos de Agenda"
      subtitle="Selecciona los puntos que se tratarán en esta junta de accionistas."
    />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="text-slate-500">Cargando puntos de agenda...</span>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Resumen de selección -->
      <SimpleCard v-if="puntosSeleccionados.length > 0" class="bg-primary-50 border-primary-200">
        <div class="flex items-center gap-3">
          <span class="text-primary-800 font-bold">{{ puntosSeleccionados.length }}</span>
          <span class="text-primary-700">
            {{ puntosSeleccionados.length === 1 ? 'punto seleccionado' : 'puntos seleccionados' }}
          </span>
        </div>
      </SimpleCard>

      <!-- Puntos de agenda por categoría -->
      <SimpleCard v-for="(puntos, categoria) in categorias" :key="categoria">
        <CardTitle :title="categoria" />

        <div class="flex flex-col gap-3">
          <div
            v-for="punto in puntos"
            :key="punto.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ punto.nombre }}</h4>
            </div>

            <SimpleSwitchYesNo
              :model-value="isPuntoSeleccionado(punto.id)"
              @update:model-value="togglePunto(punto.id)"
            />
          </div>
        </div>
      </SimpleCard>
    </div>
  </SlotWrapper>
</template>

