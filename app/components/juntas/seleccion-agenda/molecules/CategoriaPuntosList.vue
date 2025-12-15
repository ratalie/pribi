<template>
  <div>
    <!-- Category Header -->
    <CategoriaHeader
      :categoria="categoria"
      :is-expanded="isExpanded"
      @toggle="$emit('toggle-category')"
    />

    <!-- Puntos -->
    <div v-if="isExpanded" class="ml-6 mt-2 space-y-3">
      <PuntoAgendaCheckbox
        v-for="punto in puntos"
        :key="punto.id"
        :punto-id="punto.id"
        :title="punto.title"
        :is-selected="isPuntoSelected(punto.id)"
        @toggle="(checked: boolean) => handleTogglePunto(punto.id, checked)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CategoriaHeader from "../atoms/CategoriaHeader.vue";
  import PuntoAgendaCheckbox from "../atoms/PuntoAgendaCheckbox.vue";
  import type { PuntoAgenda } from "../composables/usePuntosAgenda";

  interface Props {
    categoria: string;
    puntos: PuntoAgenda[];
    selectedPuntos: string[];
    isExpanded: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "toggle-category": [];
    "toggle-punto": [puntoId: string, checked: boolean];
  }>();

  // Usar computed directamente para mejor reactividad
  // Vue detectará automáticamente cuando cambie props.selectedPuntos
  const isPuntoSelected = (puntoId: string): boolean => {
    return props.selectedPuntos.includes(puntoId);
  };

  // Handler para el toggle del punto
  const handleTogglePunto = (puntoId: string, checked: boolean) => {
    console.log(`🟡 [CategoriaPuntosList] Toggle punto:`, { puntoId, checked });
    emit("toggle-punto", puntoId, checked);
  };
</script>
