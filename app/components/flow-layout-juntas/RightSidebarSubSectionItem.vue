<script setup lang="ts">
import type { SectionItem } from "~/types/junta-navigation.types";
import { isSubSectionActive } from "~/utils/juntas/right-sidebar.utils";

interface Props {
  subSection: SectionItem;
  currentSectionId: string;
  onSectionClick: (sectionId: string) => void;
}

const { subSection, currentSectionId, onSectionClick } = defineProps<Props>();

const subSectionActive = computed(() =>
  isSubSectionActive(subSection, currentSectionId)
);
</script>

<template>
  <button
    @click="() => onSectionClick(subSection.id)"
    :class="[
      'w-full flex items-start gap-2 text-left py-2 px-3 rounded-md transition-colors',
      subSectionActive
        ? 'bg-primary-100 text-primary-800'
        : 'hover:bg-gray-50 text-gray-700',
    ]"
  >
    <div class="flex-1 min-w-0">
      <h5
        :class="[
          'text-sm font-primary',
          subSectionActive
            ? 'font-semibold text-primary-800'
            : 'font-medium text-gray-700',
        ]"
      >
        {{ subSection.title }}
      </h5>
      <p
        v-if="subSection.description"
        :class="[
          'text-xs font-secondary mt-0.5',
          subSectionActive ? 'text-primary-700' : 'text-gray-600',
        ]"
      >
        {{ subSection.description }}
      </p>
    </div>
  </button>
</template>

