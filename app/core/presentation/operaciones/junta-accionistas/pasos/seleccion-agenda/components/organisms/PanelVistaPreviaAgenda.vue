<template>
  <div class="w-96 min-h-0 flex flex-col">
    <div
      class="bg-white border rounded-xl p-6 flex-1 overflow-y-auto min-h-0"
      style="
        border-color: var(--border-default, #e5e7eb);
        border-radius: var(--radius-large, 0.75rem);
      "
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h4
          class="text-base font-primary font-semibold"
          style="color: var(--text-primary, #111827)"
        >
          Agenda
        </h4>
      </div>

      <!-- Alerta Junta Obligatoria -->
      <JuntaObligatoriaBanner :is-enabled="juntaObligatoria.isJuntaObligatoria.value" />

      <!-- Lista de Agenda -->
      <AgendaPreviewList
        :agenda-ordenada="agendaPreview.agendaOrdenada.value"
        :agenda-por-categoria="agendaPreview.agendaPorCategoria.value"
        :get-punto-number="agendaPreview.getPuntoNumber"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import JuntaObligatoriaBanner from "../molecules/JuntaObligatoriaBanner.vue";
import AgendaPreviewList from "../molecules/AgendaPreviewList.vue";
import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";

// Obtener composables compartidos
const { agendaPreview, juntaObligatoria } = useSeleccionAgendaSetup();
</script>
