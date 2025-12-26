<script setup lang="ts">
  import { ChevronLeft } from "lucide-vue-next";
  import type { SectionItem } from "~/types/junta-navigation.types";
  import { useJuntasResponsive } from "~/composables/useJuntasResponsive";
  import { useJuntasRightSidebarSheet } from "~/composables/useJuntasRightSidebarSheet";
  import WizardRightSidebar from "./WizardRightSidebar.vue";
  import WizardRightSidebarSheet from "./WizardRightSidebarSheet.vue";

  interface Props {
    hasRightSidebar: boolean;
    finalSections: SectionItem[];
    currentSectionId: string;
    rightSidebarTitle: string;
    onSectionClick: (sectionId: string) => void;
  }

  const props = defineProps<Props>();
  const { isMobileLayout } = useJuntasResponsive();
  const { isSheetOpen, openSheet, closeSheet } = useJuntasRightSidebarSheet();

  // Verificar condiciones del botón
  const shouldShowButton = computed(() => {
    return (
      isMobileLayout.value &&
      props.hasRightSidebar &&
      props.finalSections &&
      props.finalSections.length > 0 &&
      !isSheetOpen.value
    );
  });
</script>

<template>
  <div class="flex-1 overflow-hidden min-h-0 relative">
    <div v-if="hasRightSidebar" class="flex h-full">
      <!-- Contenido Principal (con sidebar derecho) -->
      <div
        :class="[
          'flex-1 overflow-y-auto min-h-0 relative',
          isMobileLayout ? 'px-4 py-4' : 'px-8 py-6',
        ]"
      >
        <slot />

        <!-- Botón flotante en la esquina superior derecha del contenedor -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-90 translate-x-2"
          enter-to-class="opacity-100 scale-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-x-0"
          leave-to-class="opacity-0 scale-90 translate-x-2"
        >
          <button
            v-if="shouldShowButton"
            @click="openSheet"
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg bg-primary-800/90 backdrop-blur-sm text-white shadow-md hover:bg-primary-700/90 hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center group"
            aria-label="Abrir panel de secciones"
          >
            <ChevronLeft
              class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            />
          </button>
        </Transition>
      </div>

      <!-- Sidebar Derecho Desktop (>= 1280px) -->
      <WizardRightSidebar
        v-if="!isMobileLayout && finalSections && finalSections.length > 0"
        :sections="finalSections"
        :current-section-id="currentSectionId || finalSections[0]?.id || ''"
        :on-section-click="onSectionClick"
        :title="rightSidebarTitle"
        :show-close-button="true"
      />

      <!-- Sheet Mobile (< 1280px) -->
      <WizardRightSidebarSheet
        v-if="isMobileLayout && finalSections && finalSections.length > 0"
        :sections="finalSections"
        :current-section-id="currentSectionId || finalSections[0]?.id || ''"
        :on-section-click="onSectionClick"
        :title="rightSidebarTitle"
        :open="isSheetOpen"
        :on-open-change="(val: boolean) => (val ? openSheet() : closeSheet())"
      />
    </div>

    <!-- Contenido Principal (sin sidebar derecho) -->
    <div
      v-else
      :class="['overflow-y-auto min-h-0 h-full', isMobileLayout ? 'px-4 py-4' : 'px-8 py-6']"
    >
      <slot />
    </div>
  </div>
</template>
