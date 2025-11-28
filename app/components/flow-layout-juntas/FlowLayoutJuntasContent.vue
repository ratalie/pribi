<script setup lang="ts">
import WizardRightSidebar from "./WizardRightSidebar.vue";
import type { SectionItem } from "~/types/junta-navigation.types";

interface Props {
  hasRightSidebar: boolean;
  finalSections: SectionItem[];
  currentSectionId: string;
  rightSidebarTitle: string;
  onSectionClick: (sectionId: string) => void;
}

defineProps<Props>();
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <div v-if="hasRightSidebar" class="flex h-full">
      <!-- Contenido Principal (con sidebar derecho) -->
      <div class="flex-1 overflow-y-auto px-8 py-6">
        <slot />
      </div>

      <!-- Sidebar Derecho (solo cuando hay sub-step activo o en resumen) -->
      <WizardRightSidebar
        v-if="finalSections && finalSections.length > 0"
        :sections="finalSections"
        :current-section-id="currentSectionId || finalSections[0]?.id || ''"
        :on-section-click="onSectionClick"
        :title="rightSidebarTitle"
      />
    </div>

    <!-- Contenido Principal (sin sidebar derecho) -->
    <div v-else class="overflow-y-auto px-8 py-6">
      <slot />
    </div>
  </div>
</template>

