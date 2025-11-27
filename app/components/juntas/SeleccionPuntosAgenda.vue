<script setup lang="ts">
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

/**
 * Componente para seleccionar puntos de agenda
 * 
 * Muestra checkboxes agrupados por categoría para seleccionar
 * los sub-steps que aparecerán en el Paso 4 (Puntos de Acuerdo).
 * 
 * Los sub-steps seleccionados se guardan en useJuntasFlowStore
 * para filtrar dinámicamente los pasos en el sidebar.
 */

// Todos los sub-steps posibles, agrupados por categoría
const PUNTOS_AGENDA = [
  // CATEGORÍA: Aumento de Capital
  {
    id: "aporte-dinerarios",
    title: "Aporte Dinerario",
    category: "Aumento de Capital",
  },
  {
    id: "aporte-no-dinerario",
    title: "Aporte no Dinerario",
    category: "Aumento de Capital",
  },
  {
    id: "capitalizacion-creditos",
    title: "Capitalización de Créditos",
    category: "Aumento de Capital",
  },

  // CATEGORÍA: Remoción
  {
    id: "remocion-gerente",
    title: "Remoción de Gerente General",
    category: "Remoción",
  },
  {
    id: "remocion-apoderados",
    title: "Remoción de Apoderados",
    category: "Remoción",
  },
  {
    id: "remocion-directores",
    title: "Remoción de Directores",
    category: "Remoción",
  },

  // CATEGORÍA: Nombramiento
  {
    id: "nombramiento-gerente",
    title: "Nombramiento de Gerente General",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-apoderados",
    title: "Nombramiento de Apoderados",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-directores",
    title: "Nombramiento de Directores",
    category: "Nombramiento",
  },
  {
    id: "nombramiento-nuevo-directorio",
    title: "Nombramiento del Nuevo Directorio",
    category: "Nombramiento",
  },

  // CATEGORÍA: Gestión Social y Resultados Económicos
  {
    id: "pronunciamiento-gestion",
    title: "Pronunciamiento de la Gestión Social y Resultados Económicos",
    category: "Gestión Social y Resultados Económicos",
  },
  {
    id: "aplicacion-resultados",
    title: "Aplicación de Resultados",
    category: "Gestión Social y Resultados Económicos",
  },
  {
    id: "delegacion-auditores",
    title: "Designación y/o Delegación en el Directorio de la Designación de Auditores Externos",
    category: "Gestión Social y Resultados Económicos",
  },
] as const;

const juntasFlowStore = useJuntasFlowStore();

// Estado local de checkboxes seleccionados
const selectedPuntos = ref<string[]>([]);

// Cargar selección previa del store
onMounted(() => {
  selectedPuntos.value = [...juntasFlowStore.getDynamicSubSteps];
});

// Agrupar puntos por categoría
const puntosPorCategoria = computed(() => {
  const categorias: Record<string, typeof PUNTOS_AGENDA> = {};

  PUNTOS_AGENDA.forEach((punto) => {
    const categoria = punto.category;
    if (!categorias[categoria]) {
      categorias[categoria] = [];
    }
    categorias[categoria].push(punto);
  });

  return categorias;
});

// Manejar cambio en checkbox
const handlePuntoChange = (puntoId: string, checked: boolean) => {
  console.log("🔵 [SeleccionPuntosAgenda] handlePuntoChange:", { puntoId, checked });
  
  if (checked) {
    if (!selectedPuntos.value.includes(puntoId)) {
      selectedPuntos.value.push(puntoId);
    }
  } else {
    selectedPuntos.value = selectedPuntos.value.filter((id) => id !== puntoId);
  }

  console.log("🔵 [SeleccionPuntosAgenda] selectedPuntos actualizado:", selectedPuntos.value);

  // Guardar en el store inmediatamente
  juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
  
  console.log("🔵 [SeleccionPuntosAgenda] Store actualizado con:", juntasFlowStore.getDynamicSubSteps);
};

// Verificar si un punto está seleccionado
const isPuntoSelected = (puntoId: string) => {
  return selectedPuntos.value.includes(puntoId);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Instrucciones -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-800">
        <strong>Instrucciones:</strong> Selecciona los puntos de agenda que se tratarán en la junta
        de accionistas. Los puntos seleccionados aparecerán como sub-pasos en el Paso 4 (Puntos de
        Acuerdo).
      </p>
    </div>

    <!-- Checkboxes agrupados por categoría -->
    <div v-for="(puntos, categoria) in puntosPorCategoria" :key="categoria" class="space-y-3">
      <!-- Header de Categoría -->
      <div class="border-b border-gray-200 pb-2">
        <h3 class="text-lg font-semibold font-primary text-gray-900">{{ categoria }}</h3>
        <p class="text-sm text-gray-600 font-secondary">
          {{ puntos.length }} {{ puntos.length === 1 ? "punto disponible" : "puntos disponibles" }}
        </p>
      </div>

      <!-- Checkboxes de la categoría -->
      <div class="space-y-2 pl-4">
        <label
          v-for="punto in puntos"
          :key="punto.id"
          class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            :checked="isPuntoSelected(punto.id)"
            @change="handlePuntoChange(punto.id, ($event.target as HTMLInputElement).checked)"
            class="mt-1 w-4 h-4 text-primary-800 border-gray-300 rounded focus:ring-primary-800 focus:ring-2"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-900 font-primary">{{ punto.title }}</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Resumen de selección -->
    <div v-if="selectedPuntos.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <p class="text-sm text-green-800">
        <strong>{{ selectedPuntos.length }}</strong>
        {{ selectedPuntos.length === 1 ? "punto seleccionado" : "puntos seleccionados" }}
      </p>
    </div>

    <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-sm text-yellow-800">
        <strong>Advertencia:</strong> No has seleccionado ningún punto de agenda. Debes seleccionar
        al menos uno para continuar.
      </p>
    </div>
  </div>
</template>

