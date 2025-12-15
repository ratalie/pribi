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
          :is-enabled="juntaObligatoria.isJuntaObligatoria.value"
          @toggle="juntaObligatoria.toggleJuntaObligatoria()"
        />
      </div>

      <!-- Categorías con Checkboxes -->
      <div class="space-y-4">
        <CategoriaPuntosList
          v-for="(puntos, categoria) in categorias.puntosPorCategoria.value"
          :key="categoria"
          :categoria="categoria"
          :puntos="puntos"
          :selected-puntos="puntosAgenda.selectedPuntos.value"
          :is-expanded="categorias.isCategoryExpanded(categoria)"
          @toggle-category="categorias.toggleCategory(categoria)"
          @toggle-punto="handleTogglePunto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import JuntaObligatoriaToggle from "../atoms/JuntaObligatoriaToggle.vue";
  import CategoriaPuntosList from "../molecules/CategoriaPuntosList.vue";
  import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";

  // Obtener composables compartidos
  const { puntosAgenda, categorias, juntaObligatoria } = useSeleccionAgendaSetup();

  const handleTogglePunto = (puntoId: string, checked: boolean) => {
    if (checked) {
      puntosAgenda.addPunto(puntoId);
    } else {
      puntosAgenda.removePunto(puntoId);
    }
    // Sincronizar junta obligatoria después de cambiar puntos
    juntaObligatoria.syncFromPuntos();
  };
</script>
