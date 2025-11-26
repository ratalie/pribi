<template>
  <SlotWrapper>
    <TitleH2
      title="Resumen de la Junta"
      subtitle="Consolidado general de los acuerdos, votaciones y documentación generada durante el flujo."
    />

    <div class="flex flex-col gap-12">
      <section
        v-for="section in baseSections"
        :id="section.id"
        :key="section.id"
        class="flex flex-col gap-5"
      >
        <TitleH4
          :title="section.title"
          :subtitle="section.subtitle"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </section>

      <section id="puntos-acuerdo" class="flex flex-col gap-6">
        <TitleH4
          title="Puntos de Acuerdo"
          subtitle="Síntesis de cada punto tratado y su estado actual dentro de la junta."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <div class="flex flex-col gap-8">
          <div
            v-for="agreement in acuerdosResumen"
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
      </section>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { usePuntosAcuerdoSummary } from "~/modules/junta-accionistas/summaries/puntos-acuerdo";
  import Titles from "~/types/enums/Titles.enum";

  const baseSections = [
    {
      id: "general",
      title: "Resumen General",
      subtitle: "Visión global del proceso: participación, acuerdos y pendientes críticos.",
    },
    {
      id: "votaciones",
      title: "Votaciones",
      subtitle: "Seguimiento de cada votación realizada y su resultado consolidado.",
    },
    {
      id: "documentos",
      title: "Documentos",
      subtitle: "Repositorio de actas, certificados y documentos generados en la junta.",
    },
  ];

  const puntosAcuerdoSummary = usePuntosAcuerdoSummary();

  const acuerdosResumen = computed(() =>
    puntosAcuerdoSummary.value.map((section) => ({
      id: section.id,
      title: section.title,
      subtitle:
        section.blocks?.[0]?.description ||
        "Resumen del acuerdo y acciones necesarias para su implementación.",
    }))
  );

  definePageMeta({
    layout: "default",
  });
</script>

<style scoped>
  .page-container {
    background: #f8f7fb;
    min-height: 100%;
  }

  .kicker {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7a7690;
  }

  .page-title {
    font-family: var(--font-primary);
    font-size: 32px;
    font-weight: 600;
    line-height: 1.15;
    color: #2e293d;
  }

  .route-chip {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    color: #3c28a4;
    background: rgba(60, 40, 164, 0.12);
    padding: 6px 12px;
    border-radius: 999px;
  }

  .intro {
    font-family: var(--font-secondary);
    font-size: 14px;
    line-height: 1.6;
    color: #4b475a;
    max-width: 720px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .summary-card {
    background: #ffffff;
    border: 1px solid #eceaf5;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(46, 41, 61, 0.08);
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
  }

  .summary-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .summary-card__title {
    font-family: var(--font-primary);
    font-size: 18px;
    font-weight: 600;
    color: #2e293d;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .summary-card__title:hover {
    color: #3c28a4;
    text-decoration: underline;
  }

  .summary-card__status {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(209, 213, 219, 0.4);
    color: #4b5563;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .summary-card__status.is-completed {
    background: rgba(60, 40, 164, 0.12);
    color: #3c28a4;
  }

  .summary-card__status.is-current,
  .summary-card__status.is-in-progress {
    background: rgba(240, 156, 0, 0.12);
    color: #f09c00;
  }

  .summary-card__status.is-optional {
    background: rgba(103, 100, 114, 0.12);
    color: #676472;
  }

  .summary-card__status.is-error {
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  }

  .summary-card__status.is-locked {
    background: rgba(107, 114, 128, 0.12);
    color: #6b7280;
  }

  .summary-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .summary-block {
    background: rgba(246, 245, 252, 0.65);
    border: 1px solid rgba(226, 224, 236, 0.6);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary-block__title {
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: 600;
    color: #2e293d;
  }

  .summary-block__description {
    font-family: var(--font-secondary);
    font-size: 13px;
    line-height: 1.5;
    color: #676472;
  }

  .summary-highlights {
    display: flex;
    flex-direction: column;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .summary-highlight {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .summary-highlight__label {
    font-family: var(--font-secondary);
    font-size: 13px;
    font-weight: 600;
    color: #3c3750;
  }

  .summary-highlight__description {
    font-family: var(--font-secondary);
    font-size: 12px;
    color: #7a7690;
    margin-top: 2px;
  }

  .summary-highlight__value {
    font-family: var(--font-primary);
    font-size: 14px;
    font-weight: 600;
    color: #3c28a4;
  }

  .summary-notes {
    font-family: var(--font-secondary);
    font-size: 12px;
    color: #7a7690;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    .page-container {
      padding: 24px;
    }
  }

  @media (max-width: 640px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
