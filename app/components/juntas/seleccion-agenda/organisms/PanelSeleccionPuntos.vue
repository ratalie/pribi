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
        <JuntaObligatoriaToggle
          :is-enabled="isJuntaObligatoria"
          @toggle="$emit('toggle-junta-obligatoria')"
        />
      </div>

      <!-- Categorías con Checkboxes -->
      <div class="space-y-4">
        <CategoriaPuntosList
          v-for="(puntos, categoria) in puntosPorCategoria"
          :key="categoria"
          :categoria="categoria"
          :puntos="puntos"
          :selected-puntos="selectedPuntos"
          :is-expanded="isCategoryExpanded(categoria)"
          @toggle-category="$emit('toggle-category', categoria)"
          @toggle-punto="(puntoId: string, checked: boolean) => $emit('toggle-punto', puntoId, checked)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import JuntaObligatoriaToggle from "../atoms/JuntaObligatoriaToggle.vue";
  import type { PuntoAgenda } from "../composables/usePuntosAgenda";
  import CategoriaPuntosList from "../molecules/CategoriaPuntosList.vue";

  interface Props {
    puntosPorCategoria: Record<string, PuntoAgenda[]>;
    selectedPuntos: string[];
    isJuntaObligatoria: boolean;
    isCategoryExpanded: (categoria: string) => boolean;
  }

  defineProps<Props>();

  defineEmits<{
    "toggle-junta-obligatoria": [];
    "toggle-category": [categoria: string];
    "toggle-punto": [puntoId: string, checked: boolean];
  }>();
</script>
