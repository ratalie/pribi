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
        <TitleH4
          :title="agreement.title"
          :subtitle="agreement.subtitle"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Titles from "~/types/enums/Titles.enum";
import { usePuntosAcuerdoSummary } from "@/modules/junta-accionistas/summaries";
import type { SummarySection } from "@/modules/junta-accionistas/summaries/types";

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
  layout: "dual-panel-layout",
});
</script>
