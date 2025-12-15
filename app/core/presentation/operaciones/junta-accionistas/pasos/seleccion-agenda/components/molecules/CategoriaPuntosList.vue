<template>
  <div>
    <!-- Category Header -->
    <CategoriaHeader :categoria="categoria" />

    <!-- Puntos -->
    <div v-if="isExpanded" class="ml-6 mt-2 space-y-3">
      <PuntoAgendaCheckbox
        v-for="punto in puntos"
        :key="punto.id"
        :punto-id="punto.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CategoriaHeader from "../atoms/CategoriaHeader.vue";
  import PuntoAgendaCheckbox from "../atoms/PuntoAgendaCheckbox.vue";
  import { usePanelSeleccionPuntos } from "../../composables/usePanelSeleccionPuntos";
  import { PUNTOS_AGENDA } from "../../types/puntos-agenda.types";

  interface Props {
    categoria: string;
  }

  const props = defineProps<Props>();

  // Obtener composables compartidos
  const { categorias } = usePanelSeleccionPuntos();

  // Obtener puntos de esta categoría
  const puntos = computed(() => {
    return PUNTOS_AGENDA.filter((p) => p.category === props.categoria);
  });

  // Verificar si la categoría está expandida
  const isExpanded = computed(() => {
    return categorias.isCategoryExpanded(props.categoria);
  });
</script>

