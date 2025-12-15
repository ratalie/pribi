<template>
  <div
    class="flex items-center gap-3 text-sm transition-colors"
    style="font-family: var(--font-secondary); cursor: default"
  >
    <!-- Icono de arrastre -->
    <Icon name="ph:dots-six-vertical" size="16" class="text-gray-600 shrink-0" />
    <!-- Número global -->
    <span class="shrink-0 font-semibold font-secondary w-6 text-center text-gray-600">
      {{ numero }}.
    </span>
    <!-- Título -->
    <span class="flex-1 font-secondary text-gray-600">
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
