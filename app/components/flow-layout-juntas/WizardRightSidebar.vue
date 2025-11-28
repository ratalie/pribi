<script setup lang="ts">
import type { SectionItem } from "~/types/junta-navigation.types";
import { useJuntasRightSidebarExpansion } from "~/composables/useJuntasRightSidebarExpansion";
import { isSectionActive } from "~/utils/juntas/right-sidebar.utils";
import RightSidebarHeader from "./RightSidebarHeader.vue";
import RightSidebarSectionItem from "./RightSidebarSectionItem.vue";
import RightSidebarSubSectionItem from "./RightSidebarSubSectionItem.vue";

interface Props {
  sections: SectionItem[];
  currentSectionId: string;
  onSectionClick: (sectionId: string) => void;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Secciones",
});

// Usar composable para gestión de expansión
const { expandedSections, toggleSection, isSectionExpanded } =
  useJuntasRightSidebarExpansion(
    computed(() => props.sections),
    computed(() => props.currentSectionId)
  );
</script>

<template>
  <div
    class="w-[360px] bg-white border-l flex flex-col overflow-y-auto"
    style="border-color: var(--border-light, #e5e7eb)"
  >
    <!-- Header -->
    <RightSidebarHeader :title="title" />

    <!-- Sections List -->
    <div class="flex-1 p-6">
      <div class="space-y-1">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          class="relative"
        >
          <!-- Sección Principal -->
          <RightSidebarSectionItem
            :section="section"
            :current-section-id="currentSectionId"
            :sections="sections"
            :is-expanded="isSectionExpanded(section)"
            :is-in-expanded-list="expandedSections.includes(section.id)"
            :on-toggle="() => toggleSection(section.id)"
            :on-section-click="onSectionClick"
          />

          <!-- Sub-secciones (anclas dentro de la misma página o rutas) -->
          <div
            v-if="section.subSections && section.subSections.length > 0 && isSectionExpanded(section)"
            class="ml-6 mt-[8px] space-y-0.5 border-l-2 pl-4"
            :style="{
              borderColor:
                isSectionActive(section, currentSectionId) ||
                expandedSections.includes(section.id)
                  ? 'var(--primary-800, #3C28A4)'
                  : '#e5e7eb',
            }"
          >
            <RightSidebarSubSectionItem
              v-for="subSection in section.subSections"
              :key="subSection.id"
              :sub-section="subSection"
              :current-section-id="currentSectionId"
              :on-section-click="onSectionClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
