<template>
  <SlotWrapper>
    <TitleH2
      title="Aplicación de Resultados"
      subtitle="Define cómo se distribuyen o absorben los resultados del ejercicio."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta introducción como guía y luego completa los apartados de resultados, aplicación y votación desde el panel derecho.
      </p>

      <!-- Sección: Utilidades y Montos a Distribuir (con anclas) -->
      <section id="utilidades-montos" class="flex flex-col gap-6">
        <TitleH4
          title="Utilidades y Montos a Distribuir"
          subtitle="Cálculos y valores relacionados con la distribución de utilidades."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />

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
      </section>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import Titles from "~/types/enums/Titles.enum";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Aplicación de Resultados
 * 
 * Sub-step del Paso 4 (Puntos de Acuerdo).
 * Este sub-step tiene secciones con anclas (sub-secciones dentro de la misma página).
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados
 */

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
