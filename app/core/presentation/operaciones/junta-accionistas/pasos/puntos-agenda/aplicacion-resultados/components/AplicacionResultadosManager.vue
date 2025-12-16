<template>
  <div class="flex flex-col gap-10">
    <ValoresPreliminaresSection />
    <CalculoUtilidadAntesReservaSection />
    <CalculoReservaLegalSection />
    <ValoresUtilidadDistribuibleSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAplicacionResultadosController } from "../composables/useAplicacionResultadosController";
import ValoresPreliminaresSection from "./organisms/ValoresPreliminaresSection.vue";
import CalculoUtilidadAntesReservaSection from "./organisms/CalculoUtilidadAntesReservaSection.vue";
import CalculoReservaLegalSection from "./organisms/CalculoReservaLegalSection.vue";
import ValoresUtilidadDistribuibleSection from "./organisms/ValoresUtilidadDistribuibleSection.vue";

const route = useRoute();
const { cargarDatos } = useAplicacionResultadosController();

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos();
});

// Función para hacer scroll a un elemento por su ID
const scrollToAnchor = (anchorId: string) => {
  const element = document.getElementById(anchorId);
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
};

// Hacer scroll cuando se carga la página con un hash
onMounted(() => {
  const hash = route.hash?.replace("#", "");
  if (hash) {
    scrollToAnchor(hash);
  }
});
</script>


