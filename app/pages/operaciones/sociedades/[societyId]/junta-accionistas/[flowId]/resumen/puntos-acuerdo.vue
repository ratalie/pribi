<template>
  <SlotWrapper>
    <TitleH2
      title="Puntos de Acuerdo"
      subtitle="Detalle de cada acuerdo aprobado, observaciones registradas y responsables asignados."
    />

    <div class="flex flex-col gap-10">
      <div
        v-for="agreement in acuerdos"
        :key="agreement.id"
        class="flex flex-col gap-5"
      >
        <!-- Si es "aporte-dinerario", usar el componente reutilizable -->
        <ResumenAporteDinerario
          v-if="agreement.id === 'aporte-dinerarios' || agreement.id === 'aporte-dinerario'"
          context="resumen-general"
        />
        <!-- Para otros acuerdos, mostrar el formato estándar -->
        <template v-else>
          <TitleH4
            :title="agreement.title"
            :subtitle="agreement.subtitle"
            :variant="Titles.WITH_SUBTITLE_SPACING"
          />
          <BlankContainer />
        </template>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Titles from "~/types/enums/Titles.enum";
import ResumenAporteDinerario from "~/components/juntas/ResumenAporteDinerario.vue";
import { usePuntosAcuerdoSummary } from "~/core/hexag/juntas/summaries";
import type { SummarySection } from "~/core/hexag/juntas/summaries/types";

const puntosSummary = usePuntosAcuerdoSummary();

const acuerdos = computed(() =>
  puntosSummary.value.map((section: SummarySection) => ({
    id: section.id,
    title: section.title,
    subtitle:
      section.blocks?.[0]?.description ||
      "Resumen del acuerdo y sus pasos claves para ejecución.",
  }))
);

definePageMeta({
  layout: "default",
});
</script>
