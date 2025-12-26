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
      <JuntaObligatoriaBanner />

      <!-- Lista de Agenda -->
      <AgendaPreviewList />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AgendaPreviewList from "../molecules/AgendaPreviewList.vue";
  import JuntaObligatoriaBanner from "../molecules/JuntaObligatoriaBanner.vue";
</script>
