<template>
  <div v-if="!hasPuntos" class="text-center py-12 border-2 border-dashed rounded-lg" style="border-color: var(--border-default, #e5e7eb)">
    <p
      class="text-sm flex flex-col items-center justify-center gap-2 font-secondary"
      style="color: var(--text-muted, #6b7280)"
    >
      <span class="text-2xl">😢</span>
      <span>No hay contenidos en esta lista.</span>
    </p>
  </div>

  <div v-else class="space-y-3">
    <!-- Grupos por categoría -->
    <template v-for="(puntos, categoria) in agendaPreview.agendaPorCategoria.value" :key="categoria">
      <!-- Título de categoría -->
      <p
        class="text-xs mb-2 font-secondary font-semibold"
        style="color: var(--text-muted, #6b7280)"
      >
        {{ categoria }}
      </p>
      <!-- Items de la categoría -->
      <div class="space-y-2">
        <AgendaItemPreview
          v-for="punto in puntos"
          :key="punto.id"
          :punto-id="punto.id"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AgendaItemPreview from "../atoms/AgendaItemPreview.vue";
import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";

// Obtener composables compartidos
const { agendaPreview } = useSeleccionAgendaSetup();

const hasPuntos = computed(() => {
  return agendaPreview.agendaOrdenada.value.length > 0;
});
</script>

