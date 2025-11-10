<template>
  <div class="page-container p-8 space-y-10">
    <header class="space-y-3">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="kicker">Junta de Accionistas</p>
          <h1 class="page-title">Resumen Ejecutivo</h1>
        </div>
        <span class="route-chip">{{ $route.path }}</span>
      </div>
      <p class="intro">
        Consolidado de los acuerdos, avances y pendientes registrados en cada etapa del flujo. Cada
        tarjeta enlaza a la sección correspondiente para profundizar o actualizar información.
      </p>
    </header>

    <section class="summary-grid">
      <article
        v-for="section in sectionsWithStatus"
        :key="section.id"
        class="summary-card"
      >
        <header class="summary-card__header">
          <NuxtLink :to="section.route" class="summary-card__title">
            {{ section.title }}
          </NuxtLink>
          <span class="summary-card__status" :class="`is-${section.status}`">
            {{ statusLabels[section.status] }}
          </span>
        </header>
        <div class="summary-card__body">
          <div
            v-for="block in section.blocks"
            :key="block.id"
            class="summary-block"
          >
            <h3 class="summary-block__title">{{ block.title }}</h3>
            <p v-if="block.description" class="summary-block__description">
              {{ block.description }}
            </p>

            <ul v-if="block.highlights?.length" class="summary-highlights">
              <li v-for="highlight in block.highlights" :key="highlight.id">
                <div class="summary-highlight">
                  <div>
                    <p class="summary-highlight__label">{{ highlight.label }}</p>
                    <p v-if="highlight.description" class="summary-highlight__description">
                      {{ highlight.description }}
                    </p>
                  </div>
                  <span class="summary-highlight__value">{{ highlight.value }}</span>
                </div>
              </li>
            </ul>

            <ul v-if="block.notes?.length" class="summary-notes">
              <li v-for="note in block.notes" :key="note">
                • {{ note }}
              </li>
            </ul>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useJuntasSummarySections } from "@/modules/junta-accionistas/summaries";
import { useFlowProgressStore } from "@/stores/flowProgress.store";

definePageMeta({
  layout: "dual-panel-layout",
});

const SUMMARY_FLOW_ID = "juntas-accionistas-layout";

const rawSections = useJuntasSummarySections();
const progressStore = useFlowProgressStore();

const statusLabels: Record<string, string> = {
  completed: "Completado",
  current: "En progreso",
  "in-progress": "En progreso",
  empty: "Pendiente",
  pending: "Pendiente",
  optional: "Opcional",
  locked: "Bloqueado",
  error: "Con observaciones",
};

const sectionsWithStatus = computed(() => {
  const flowSteps = progressStore.getFlowSteps(SUMMARY_FLOW_ID) || {};
  return rawSections.value.map((section) => {
    const status = flowSteps[section.id]?.status ?? "empty";
    return {
      ...section,
      status,
    };
  });
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
