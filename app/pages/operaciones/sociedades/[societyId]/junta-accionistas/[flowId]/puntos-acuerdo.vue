<template>
  <SlotWrapper>
    <TitleH2
      title="Puntos de Acuerdo"
      subtitle="Administra las categorías y acuerdos que serán tratados durante la junta."
    />

    <div class="flex flex-col gap-10">
      <div
        v-for="section in sections"
        :key="section.id"
        class="flex flex-col gap-5"
      >
        <TitleH4
          :title="section.title"
          :subtitle="section.subtitle"
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

/**
 * Página: Puntos de Acuerdo
 * 
 * Paso 4 del flujo de Juntas de Accionistas.
 * Página principal que muestra las categorías de puntos de acuerdo.
 * Los sub-steps específicos se muestran en el sidebar izquierdo (filtrados dinámicamente).
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/puntos-acuerdo
 */

const sections = [
  {
    id: "aumento-capital",
    title: "Aumento de Capital",
    subtitle: "Aportes dinerarios, capitalización de créditos y otras acciones para incrementar el capital social.",
  },
  {
    id: "nombramientos",
    title: "Nombramientos",
    subtitle: "Designación de apoderados, directores, gerentes y auditores que asumirán funciones dentro de la organización.",
  },
  {
    id: "remociones",
    title: "Remociones",
    subtitle: "Procesos de remoción de apoderados, directores y gerentes con registro de causales y resultados.",
  },
  {
    id: "gestion-social",
    title: "Gestión Social",
    subtitle: "Pronunciamiento de gestión, estados financieros y aplicación de resultados para la junta actual.",
  },
];

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>
