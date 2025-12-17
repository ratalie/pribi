<script setup lang="ts">
import { computed } from "vue";
import { useSummarySection } from "~/core/hexag/juntas/summaries";
import type { SummarySection } from "~/core/hexag/juntas/summaries/types";

interface Props {
  sectionId: string;
  titleOverride?: string;
  description?: string;
}

const props = defineProps<Props>();

const section = useSummarySection(props.sectionId);

const resolvedSection = computed<SummarySection | null>(() => {
  return section.value ?? null;
});
</script>

<template>
  <div v-if="resolvedSection" class="summary-section space-y-6">
    <header class="summary-section__header">
      <h1 class="summary-section__title">
        {{ titleOverride || resolvedSection.title }}
      </h1>
      <p v-if="description" class="summary-section__description">
        {{ description }}
      </p>
    </header>

    <div class="summary-section__blocks">
      <article
        v-for="block in resolvedSection.blocks"
        :key="block.id"
        class="summary-block"
      >
        <h2 class="summary-block__title">{{ block.title }}</h2>
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
      </article>
    </div>
  </div>
  <div v-else class="summary-section__empty">
    <p>No se encontró información de resumen para esta sección.</p>
  </div>
</template>

<style scoped>
.summary-section__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-section__title {
  font-family: var(--font-primary);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-gray-800);
}

.summary-section__description {
  font-family: var(--font-secondary);
  font-size: 14px;
  color: #676472;
  max-width: 720px;
  line-height: 1.6;
}

.summary-section__blocks {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-block {
  background: rgba(246, 245, 252, 0.7);
  border: 1px solid rgba(226, 224, 236, 0.6);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-block__title {
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: 600;
  color: #2e293d;
}

.summary-block__description {
  font-family: var(--font-secondary);
  font-size: 14px;
  line-height: 1.5;
  color: #4b475a;
}

.summary-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-highlight {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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
  font-size: 16px;
  font-weight: 600;
  color: #3c28a4;
}

.summary-notes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-secondary);
  font-size: 12px;
  color: #7a7690;
}

.summary-section__empty {
  padding: 24px;
  text-align: center;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  color: #6b7280;
  font-family: var(--font-secondary);
}
</style>

