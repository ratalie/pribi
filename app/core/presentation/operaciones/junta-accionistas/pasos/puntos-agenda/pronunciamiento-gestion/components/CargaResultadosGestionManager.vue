<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePronunciamientoController } from "../composables/usePronunciamientoController";
import AgregarEstadoFinancieroModal from "./organisms/AgregarEstadoFinancieroModal.vue";
import EstadosFinancierosSection from "./organisms/EstadosFinancierosSection.vue";
import MemoriaAnualSection from "./organisms/MemoriaAnualSection.vue";

const { cargarDatos } = usePronunciamientoController();

// Estado del modal
const isModalOpen = ref(false);

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <div class="flex flex-col gap-10">
    <MemoriaAnualSection />
    <EstadosFinancierosSection @open-modal="isModalOpen = true" />
    <AgregarEstadoFinancieroModal
      v-model="isModalOpen"
      @close="isModalOpen = false"
      @submit="isModalOpen = false"
    />
  </div>
</template>
