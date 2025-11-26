<script setup lang="ts">
  import type { SectionItem } from "~/types/junta-navigation.types";
  import CheckIcon from "../flow-layout/CheckIcon.vue";

  interface Props {
    sections: SectionItem[];
    currentSectionId: string;
    onSectionClick: (sectionId: string) => void;
    title?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: "Secciones",
  });

  // Normalizar estado de sección
  const getSectionStatus = (section: SectionItem): "completed" | "current" | "empty" => {
    if (section.status === "completed" || section.status === "current") {
      return section.status;
    }
    if (section.id === props.currentSectionId) {
      return "current";
    }
    // Determinar si es completed basado en el índice
    const currentIndex = props.sections.findIndex((s) => s.id === props.currentSectionId);
    const sectionIndex = props.sections.findIndex((s) => s.id === section.id);
    if (sectionIndex < currentIndex) {
      return "completed";
    }
    return "empty";
  };
</script>

<template>
  <div
    class="w-[360px] bg-white border-l flex flex-col overflow-y-auto"
    style="border-color: var(--border-light, #e5e7eb)"
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b" style="border-color: var(--border-light, #e5e7eb)">
      <h3 class="text-sm font-primary font-semibold text-gray-600 uppercase tracking-wide">
        {{ title }}
      </h3>
    </div>

    <!-- Sections List -->
    <div class="flex-1 p-6">
      <div class="space-y-4">
        <div v-for="(section, index) in sections" :key="section.id" class="relative">
          <!-- Vertical Line -->
          <div
            v-if="index < sections.length - 1"
            :class="[
              'absolute left-[9px] top-[20px] w-[2px] h-[calc(100%+16px)] transition-colors',
              getSectionStatus(section) === 'empty' ? 'bg-gray-300' : 'bg-primary-800',
            ]"
          />

          <!-- Section Item -->
          <button
            @click="onSectionClick(section.id)"
            class="w-full flex items-start gap-4 text-left group relative"
          >
            <!-- Circle Icon -->
            <div class="relative z-10 shrink-0 mt-0.5">
              <CheckIcon
                :status="getSectionStatus(section)"
                :is-final-item="index === sections.length - 1"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 pb-4">
              <h4
                :class="[
                  'text-base mb-1 font-primary transition-colors',
                  section.id === currentSectionId
                    ? 'text-primary-800 font-semibold'
                    : getSectionStatus(section) === 'completed'
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 font-medium',
                ]"
              >
                {{ section.title }}
              </h4>
              <p v-if="section.description" class="text-sm font-secondary text-gray-600">
                {{ section.description }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
