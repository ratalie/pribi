<script setup lang="ts">
  import type { SectionItem } from "~/types/junta-navigation.types";
  import { getIcon } from "~/utils/iconMapper";
  import { getSectionStatus, isSectionActive } from "~/utils/juntas/right-sidebar.utils";

  interface Props {
    section: SectionItem;
    currentSectionId: string;
    sections: SectionItem[];
    isExpanded: boolean;
    isInExpandedList: boolean;
    onToggle: () => void;
    onSectionClick: (sectionId: string) => void;
  }

  const props = defineProps<Props>();

  const sectionActive = computed(() => isSectionActive(props.section, props.currentSectionId));
  const sectionStatus = computed(() =>
    getSectionStatus(props.section, props.currentSectionId, props.sections)
  );
</script>

<template>
  <div :class="['relative', sectionActive && 'bg-primary-50/50 rounded-lg']">
    <!-- Barra vertical morada cuando está activa -->
    <div
      v-if="sectionActive"
      class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-primary-800"
    />

    <!-- Botón de Sección Principal -->
    <button
      @click="
        section.subSections && section.subSections.length > 0
          ? onToggle
          : onSectionClick(section.id)
      "
      :class="[
        'w-full flex items-center gap-3 text-left group relative pl-4 pr-3 py-2.5 rounded-lg transition-colors',
        sectionActive ? 'bg-primary-50/50' : 'hover:bg-gray-50',
      ]"
    >
      <!-- Contenido Principal -->
      <div class="flex-1 min-w-0">
        <h4
          :class="[
            'text-sm font-primary transition-colors leading-relaxed',
            sectionActive
              ? 'text-primary-800 font-semibold'
              : sectionStatus === 'completed'
              ? 'text-gray-900 font-medium'
              : 'text-gray-600 font-medium',
          ]"
        >
          {{ section.title }}
        </h4>
      </div>
      <!-- Chevron para secciones con hijos -->
      <div
        v-if="section.subSections && section.subSections.length > 0"
        class="flex items-center justify-center w-4 h-4 shrink-0"
      >
        <component
          :is="getIcon(isExpanded ? 'ChevronDown' : 'ChevronRight')"
          v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
          class="w-3 h-3 text-gray-600"
        />
      </div>
    </button>
  </div>
</template>
