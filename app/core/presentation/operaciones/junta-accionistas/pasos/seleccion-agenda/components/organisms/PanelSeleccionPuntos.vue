<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <div
      class="bg-white border rounded-xl p-6 flex-1 overflow-y-auto min-h-0"
      style="
        border-color: var(--border-default, #e5e7eb);
        border-radius: var(--radius-large, 0.75rem);
      "
    >
      <!-- Header con Toggle Junta Obligatoria -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3
            class="text-lg mb-1 font-primary font-semibold"
            style="color: var(--text-primary, #111827)"
          >
            Puntos de Agenda
          </h3>
          <p class="text-sm font-secondary" style="color: var(--text-muted, #6b7280)">
            Selecciona los puntos a incluir en la junta
          </p>
        </div>

        <!-- Toggle Junta Obligatoria -->
        <JuntaObligatoriaToggle />
      </div>

      <!-- Categorías con Checkboxes -->
      <div class="space-y-4">
        <CategoriaPuntosList
          v-for="(puntos, categoria) in categorias.puntosPorCategoria.value"
          :key="categoria"
          :categoria="categoria"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePanelSeleccionPuntos } from "../../composables/usePanelSeleccionPuntos";
  import JuntaObligatoriaToggle from "../atoms/JuntaObligatoriaToggle.vue";
  import CategoriaPuntosList from "../molecules/CategoriaPuntosList.vue";

  // Composable que maneja toda la lógica del panel
  const { categorias } = usePanelSeleccionPuntos();
</script>
