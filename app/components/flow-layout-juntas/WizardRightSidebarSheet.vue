<script setup lang="ts">
  import { X } from "lucide-vue-next";
  import { Sheet, SheetContent } from "@/components/ui/sheet";
  import { useJuntasRightSidebarExpansion } from "~/composables/useJuntasRightSidebarExpansion";
  import type { SectionItem } from "~/types/junta-navigation.types";
  import { isSectionActive } from "~/utils/juntas/right-sidebar.utils";
  import RightSidebarSectionItem from "./RightSidebarSectionItem.vue";
  import RightSidebarSubSectionItem from "./RightSidebarSubSectionItem.vue";

  interface Props {
    sections: SectionItem[];
    currentSectionId: string;
    onSectionClick: (sectionId: string) => void;
    title?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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
  <Sheet :open="open" @update:open="onOpenChange">
    <SheetContent
      side="right"
      class="w-[360px] p-0 overflow-hidden flex flex-col [&>button]:hidden"
      :class="{
        'sm:w-[360px]': true,
      }"
    >
      <div class="flex flex-col h-full overflow-hidden">
        <!-- Header con botón de cerrar -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0"
        >
          <h3 class="text-sm font-primary font-semibold text-gray-600 uppercase tracking-wide">
            {{ title }}
          </h3>
          <button
            @click="onOpenChange(false)"
            class="p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Cerrar panel"
          >
            <X class="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <!-- Contenido del sidebar -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div class="space-y-0.5">
            <div v-for="section in sections" :key="section.id" class="relative">
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

              <!-- Sub-secciones -->
              <div
                v-if="
                  section.subSections &&
                  section.subSections.length > 0 &&
                  isSectionExpanded(section)
                "
                class="ml-6 mt-1 space-y-0.5 border-l-2 pl-4"
                :class="[
                  isSectionActive(section, currentSectionId) ||
                  expandedSections.includes(section.id)
                    ? 'border-primary-800'
                    : 'border-gray-200',
                ]"
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
    </SheetContent>
  </Sheet>
</template>
