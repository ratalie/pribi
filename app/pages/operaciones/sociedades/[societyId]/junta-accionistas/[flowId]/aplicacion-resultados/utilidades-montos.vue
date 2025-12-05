<template>
  <SlotWrapper>
    <TitleH2
      title="Utilidades y Montos a Distribuir"
      subtitle="Cálculos y valores relacionados con la distribución de utilidades."
    />

    <div class="flex flex-col gap-8">
      <!-- Sub-sección: Valores Preliminares -->
      <div id="valores-preliminares" class="flex flex-col gap-4 pt-4">
        <TitleH4
          title="Valores Preliminares"
          subtitle="Valores iniciales para el cálculo de utilidades."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>

      <!-- Sub-sección: Cálculo de la Utilidad antes de la Reserva Legal -->
      <div id="calculo-utilidad-antes-reserva" class="flex flex-col gap-4 pt-4">
        <TitleH4
          title="Cálculo de la Utilidad antes de la Reserva Legal"
          subtitle="Cálculo de la utilidad neta antes de aplicar la reserva legal."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>

      <!-- Sub-sección: Cálculo de la Reserva Legal -->
      <div id="calculo-reserva-legal" class="flex flex-col gap-4 pt-4">
        <TitleH4
          title="Cálculo de la Reserva Legal"
          subtitle="Cálculo de la reserva legal según normativa vigente."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>

      <!-- Sub-sección: Valores de la Utilidad Distribuible -->
      <div id="valores-utilidad-distribuible" class="flex flex-col gap-4 pt-4">
        <TitleH4
          title="Valores de la Utilidad Distribuible"
          subtitle="Valores finales de la utilidad que puede ser distribuida."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import Titles from "~/types/enums/Titles.enum";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

/**
 * Página: Utilidades y Montos a Distribuir
 * 
 * Sub-sección de Aplicación de Resultados.
 * Esta página contiene 4 sub-secciones que son anclas dentro de la misma página.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados/utilidades-montos
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

const route = useRoute();

// Función para hacer scroll a un elemento por su ID
const scrollToAnchor = (anchorId: string) => {
  nextTick(() => {
    const element = document.getElementById(anchorId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  });
};

// Hacer scroll cuando se carga la página con un hash
onMounted(() => {
  const hash = route.hash?.replace("#", "");
  if (hash) {
    scrollToAnchor(hash);
  }
});

// Hacer scroll cuando cambia el hash
watch(
  () => route.hash,
  (newHash) => {
    if (newHash) {
      const anchorId = newHash.replace("#", "");
      scrollToAnchor(anchorId);
    }
  }
);

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>

