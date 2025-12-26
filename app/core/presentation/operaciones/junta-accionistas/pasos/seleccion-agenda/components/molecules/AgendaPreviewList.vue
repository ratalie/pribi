<template>
  <div
    v-if="!hasPuntos"
    class="text-center py-12 border-2 border-dashed rounded-lg"
    style="border-color: var(--border-default, #e5e7eb)"
  >
    <p
      class="text-sm flex flex-col items-center justify-center gap-2 font-secondary"
      style="color: var(--text-muted, #6b7280)"
    >
      <Icon name="ph:smiley-sad" size="16" class="text-gray-600" />
      <span>No hay contenidos en esta lista.</span>
    </p>
  </div>

  <div v-else class="space-y-3">
    <!-- Grupos por categoría -->
    <template
      v-for="(puntos, categoria) in agendaPreview.agendaPorCategoria.value"
      :key="categoria"
    >
      <!-- Título de categoría y Items -->
      <div class="space-y-2">
        <!-- Título de categoría alineado con items -->
        <div
          class="flex items-center gap-3 text-sm"
          style="font-family: var(--font-secondary)"
        >
          <!-- Espacio reservado para icono (mismo tamaño que en items) -->
          <div class="w-4 shrink-0"></div>
          <!-- Espacio reservado para número (mismo tamaño que en items) -->
          <div class="w-6 shrink-0"></div>
          <!-- Texto del título -->
          <span class="flex-1 font-secondary font-bold text-gray-600">{{ categoria }}</span>
        </div>
        <!-- Items de la categoría -->
        <AgendaItemPreview v-for="punto in puntos" :key="punto.id" :punto-id="punto.id" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";
  import AgendaItemPreview from "../atoms/AgendaItemPreview.vue";

  // Obtener composables compartidos
  const { agendaPreview } = useSeleccionAgendaSetup();

  const hasPuntos = computed(() => {
    return agendaPreview.agendaOrdenada.value.length > 0;
  });
</script>
