<template>
  <label class="flex items-start gap-3 cursor-pointer group">
    <Checkbox
      :model-value="isSelected"
      @update:model-value="handleToggle"
      class="mt-0.5"
    />
    <span
      class="text-sm group-hover:text-primary-700 transition-colors font-secondary"
      :style="{
        color: isSelected ? 'var(--primary-700, #7c3aed)' : 'var(--text-secondary, #4b5563)',
      }"
    >
      {{ puntoTitle }}
    </span>
  </label>
</template>

<script setup lang="ts">
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import { usePanelSeleccionPuntos } from "../../composables/usePanelSeleccionPuntos";
  import { PUNTOS_AGENDA } from "../../types/puntos-agenda.types";

  interface Props {
    puntoId: string;
  }

  const props = defineProps<Props>();

  // Obtener composables compartidos
  const { puntosAgenda, handleTogglePunto } = usePanelSeleccionPuntos();

  // Obtener información del punto
  const punto = computed(() => {
    return PUNTOS_AGENDA.find((p) => p.id === props.puntoId);
  });

  const puntoTitle = computed(() => {
    return punto.value?.title || "";
  });

  // Verificar si el punto está seleccionado
  const isSelected = computed(() => {
    return puntosAgenda.selectedPuntos.value.includes(props.puntoId);
  });

  // Handler para toggle
  const handleToggle = (checked: boolean | string) => {
    handleTogglePunto(props.puntoId, !!checked);
  };
</script>

