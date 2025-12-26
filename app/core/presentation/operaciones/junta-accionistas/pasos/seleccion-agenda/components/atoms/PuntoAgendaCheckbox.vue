<template>
  <label
    :class="[
      'flex items-start gap-3 cursor-pointer group px-3 py-1 rounded transition-colors',
      isSelected ? 'bg-primary-50' : '',
    ]"
  >
    <Checkbox
      :model-value="isSelected"
      @update:model-value="handleToggle"
      :class="[
        'mt-0.5 !border-gray-600',
        isSelected
          ? '!bg-primary-400 !border-primary-400 data-[state=checked]:!bg-primary-400 data-[state=checked]:!border-primary-400'
          : '',
      ]"
    />
    <span
      :class="[
        'text-sm transition-colors font-secondary',
        isSelected ? 'text-primary-400' : 'text-gray-600',
      ]"
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
