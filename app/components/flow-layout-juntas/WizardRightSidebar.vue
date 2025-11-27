<script setup lang="ts">
  import type { SectionItem } from "~/types/junta-navigation.types";
  import CheckIcon from "../flow-layout/CheckIcon.vue";
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    sections: SectionItem[];
    currentSectionId: string;
    onSectionClick: (sectionId: string) => void;
    title?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: "Secciones",
  });

  // Estado para controlar qué secciones están expandidas
  const expandedSections = ref<string[]>([]);

  // Auto-expandir secciones que tienen sub-secciones activas
  watch(
    () => props.currentSectionId,
    (newSectionId) => {
      props.sections.forEach((section) => {
        if (section.subSections) {
          const hasActiveSubSection = section.subSections.some(
            (sub) => sub.id === newSectionId
          );
          if (hasActiveSubSection && !expandedSections.value.includes(section.id)) {
            expandedSections.value.push(section.id);
          }
        }
      });
    },
    { immediate: true }
  );

  // Toggle expansión de sección
  const toggleSection = (sectionId: string) => {
    if (expandedSections.value.includes(sectionId)) {
      expandedSections.value = expandedSections.value.filter((id) => id !== sectionId);
    } else {
      expandedSections.value.push(sectionId);
    }
  };

  // Verificar si una sección está expandida
  const isSectionExpanded = (section: SectionItem): boolean => {
    return expandedSections.value.includes(section.id) || isSectionActive(section);
  };

  // Normalizar estado de sección
  const getSectionStatus = (section: SectionItem): "completed" | "current" | "empty" => {
    if (section.status === "completed" || section.status === "current") {
      return section.status;
    }
    if (section.id === props.currentSectionId) {
      return "current";
    }
    // Si tiene sub-secciones, verificar si alguna está activa
    if (section.subSections) {
      const hasActiveSubSection = section.subSections.some(
        (sub) => sub.id === props.currentSectionId
      );
      if (hasActiveSubSection) {
        return "current";
      }
    }
    // Determinar si es completed basado en el índice
    const currentIndex = findSectionIndex(props.currentSectionId, props.sections);
    const sectionIndex = findSectionIndex(section.id, props.sections);
    if (sectionIndex < currentIndex && sectionIndex !== -1 && currentIndex !== -1) {
      return "completed";
    }
    return "empty";
  };

  // Función recursiva para encontrar el índice de una sección (incluyendo sub-secciones)
  const findSectionIndex = (sectionId: string, sections: SectionItem[], parentIndex = 0): number => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.id === sectionId) {
        return parentIndex + i;
      }
      if (section.subSections) {
        const subIndex = findSectionIndex(sectionId, section.subSections, parentIndex + i);
        if (subIndex !== -1) {
          return subIndex;
        }
      }
    }
    return -1;
  };

  // Verificar si una sección o sus sub-secciones están activas
  const isSectionActive = (section: SectionItem): boolean => {
    if (section.id === props.currentSectionId) return true;
    if (section.subSections) {
      return section.subSections.some((sub) => sub.id === props.currentSectionId);
    }
    return false;
  };

  // Verificar si una sub-sección está activa
  const isSubSectionActive = (subSection: SectionItem): boolean => {
    return subSection.id === props.currentSectionId;
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
      <div class="space-y-1">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          class="relative"
        >
          <!-- Sección Principal -->
          <div
            :class="[
              'relative',
              isSectionActive(section) && 'bg-primary-50/50 rounded-lg',
            ]"
          >
            <!-- Barra vertical morada cuando está activa -->
            <div
              v-if="isSectionActive(section)"
              class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style="background-color: var(--primary-800, #3C28A4)"
            />

            <!-- Botón de Sección Principal -->
            <button
              @click="
                section.subSections && section.subSections.length > 0
                  ? toggleSection(section.id)
                  : onSectionClick(section.id)
              "
              :class="[
                'w-full flex items-start gap-3 text-left group relative pl-4 pr-3 py-3 rounded-lg transition-colors',
                isSectionActive(section)
                  ? 'bg-primary-50/50'
                  : 'hover:bg-gray-50',
              ]"
            >
              <!-- Contenido Principal -->
              <div class="flex-1 min-w-0">
                <h4
                  :class="[
                    'text-base mb-0.5 font-primary transition-colors',
                    isSectionActive(section)
                      ? 'text-primary-800 font-semibold'
                      : getSectionStatus(section) === 'completed'
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-600 font-medium',
                  ]"
                >
                  {{ section.title }}
                </h4>
                <p
                  v-if="section.description"
                  :class="[
                    'text-sm font-secondary',
                    isSectionActive(section) ? 'text-primary-700' : 'text-gray-600',
                  ]"
                >
                  {{ section.description }}
                </p>
              </div>
              <!-- Chevron para secciones con hijos -->
              <div
                v-if="section.subSections && section.subSections.length > 0"
                class="flex items-center justify-center w-4 h-4 shrink-0"
              >
                <component
                  :is="getIcon(isSectionExpanded(section) ? 'ChevronDown' : 'ChevronRight')"
                  v-if="getIcon('ChevronDown') && getIcon('ChevronRight')"
                  class="w-3 h-3 text-gray-600"
                />
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-600"
                >
                  <path
                    v-if="isSectionExpanded(section)"
                    d="m6 9 6 6 6-6"
                  />
                  <path
                    v-else
                    d="m9 18 6-6-6-6"
                  />
                </svg>
              </div>
            </button>

            <!-- Sub-secciones (anclas dentro de la misma página o rutas) -->
            <div
              v-if="section.subSections && section.subSections.length > 0 && isSectionExpanded(section)"
              class="ml-6 mt-[8px] space-y-0.5 border-l-2 pl-4"
              :style="{
                borderColor: isSectionActive(section) || expandedSections.includes(section.id) ? 'var(--primary-800, #3C28A4)' : '#e5e7eb',
              }"
            >
              <button
                v-for="subSection in section.subSections"
                :key="subSection.id"
                @click="onSectionClick(subSection.id)"
                :class="[
                  'w-full flex items-start gap-2 text-left py-2 px-3 rounded-md transition-colors',
                  isSubSectionActive(subSection)
                    ? 'bg-primary-100 text-primary-800'
                    : 'hover:bg-gray-50 text-gray-700',
                ]"
              >
                <div class="flex-1 min-w-0">
                  <h5
                    :class="[
                      'text-sm font-primary',
                      isSubSectionActive(subSection)
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
                      isSubSectionActive(subSection) ? 'text-primary-700' : 'text-gray-600',
                    ]"
                  >
                    {{ subSection.description }}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
