<template>
  <div
    class="flex items-center gap-3 text-sm p-3 rounded-lg transition-colors"
    style="
      background-color: var(--gray-50, #f9fafb);
      font-family: var(--font-secondary);
      cursor: default;
    "
  >
    <!-- Número global -->
    <span
      class="shrink-0 font-semibold font-secondary w-6 text-center"
      style="color: var(--primary-700, #7c3aed)"
    >
      {{ numero }}.
    </span>
    <!-- Título -->
    <span
      class="flex-1 font-secondary"
      style="color: var(--text-secondary, #4b5563)"
    >
      {{ puntoTitle }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useSeleccionAgendaSetup } from "../../composables/useSeleccionAgendaSetup";
import { PUNTOS_AGENDA } from "../../types/puntos-agenda.types";

interface Props {
  puntoId: string;
}

const props = defineProps<Props>();

// Obtener composables compartidos
const { agendaPreview } = useSeleccionAgendaSetup();

// Obtener información del punto
const punto = computed(() => {
  return PUNTOS_AGENDA.find((p) => p.id === props.puntoId);
});

const puntoTitle = computed(() => {
  return punto.value?.title || "";
});

// Obtener número de orden
const numero = computed(() => {
  return agendaPreview.getPuntoNumber(props.puntoId);
});
</script>

