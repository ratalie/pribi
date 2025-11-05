<script setup lang="ts">
/**
 * HierarchicalItem - Item recursivo con jerarquía visual
 * 
 * Características:
 * - Checkmarks y líneas conectoras (como StepWizard)
 * - Expand/collapse para items con hijos
 * - Indent por nivel (visual hierarchy)
 * - Badge de nivel (opcional)
 * - Recursivo (se llama a sí mismo para children)
 */

import { ref } from "vue";
import type { FlowItemTree } from "~/types/flow-system";
import StatusIcon from "./StatusIcon.vue";

interface Props {
  item: FlowItemTree;
  currentPath: string;
  level?: number;
  showLevelBadge?: boolean;
  isLast?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
  showLevelBadge: false,
  isLast: false,
});

// Estado de expand/collapse
const isExpanded = ref(true);

// Tiene hijos
const hasChildren = computed(() => props.item.children && props.item.children.length > 0);

// Toggle expand/collapse
const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

// Status del item
const itemStatus = computed(() => {
  // Completado
  if (props.item.behavior.isCompleted) {
    return "completed";
  }
  
  // Actual
  if (props.item.navigation.route === props.currentPath) {
    return "current";
  }
  
  // Vacío
  return "empty";
});

// Indent según nivel (16px por nivel)
const indentStyle = computed(() => ({
  paddingLeft: `${props.level * 16}px`,
}));

// Color del badge según nivel
const levelBadgeClass = computed(() => {
  switch (props.item.hierarchy.level) {
    case 0: return "bg-purple-100 text-purple-700";
    case 1: return "bg-blue-100 text-blue-700";
    case 2: return "bg-green-100 text-green-700";
    case 3: return "bg-yellow-100 text-yellow-700";
    case 4: return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-700";
  }
});
</script>

<template>
  <div class="hierarchical-item">
    <!-- Item principal -->
    <div class="item-row" :style="indentStyle">
      <!-- StatusIcon -->
      <StatusIcon
        :status="itemStatus"
        :is-final-item="isLast && !hasChildren"
        :show-line="!isLast || hasChildren"
      />

      <!-- Contenido -->
      <div class="item-content">
        <!-- Expand/Collapse button (si tiene hijos) -->
        <button
          v-if="hasChildren"
          @click="toggleExpand"
          class="expand-button"
          :aria-expanded="isExpanded"
        >
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-90': isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Link del item -->
        <NuxtLink :to="item.navigation.route" class="item-link group">
          <div class="flex items-center gap-2">
            <!-- Badge de nivel (opcional) -->
            <span
              v-if="showLevelBadge"
              class="level-badge"
              :class="levelBadgeClass"
            >
              L{{ item.hierarchy.level }}
            </span>

            <!-- Título -->
            <p class="item-title">
              {{ item.identity.label }}
            </p>
          </div>

          <!-- Descripción (si existe) -->
          <span v-if="item.behavior.description" class="item-description">
            {{ item.behavior.description }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Hijos (recursivo) -->
    <div v-if="hasChildren && isExpanded" class="children-container">
      <HierarchicalItem
        v-for="(child, index) in item.children"
        :key="child.identity.id"
        :item="child"
        :current-path="currentPath"
        :level="level + 1"
        :show-level-badge="showLevelBadge"
        :is-last="index === item.children!.length - 1"
      />
    </div>
  </div>
</template>

<style scoped>
/* Container del item */
.hierarchical-item {
  display: flex;
  flex-direction: column;
}

/* Fila del item */
.item-row {
  display: flex;
  align-items: start;
  gap: 12px;
  transition: padding-left 0.2s ease;
}

/* Contenido del item */
.item-content {
  display: flex;
  align-items: start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

/* Botón expand/collapse */
.expand-button {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;
  margin-top: 2px;
}

.expand-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Link del item */
.item-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  text-decoration: none;
  min-width: 0;
}

/* Título del item */
.item-title {
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 15px;
  color: #4b5563;
  transition: color 0.2s ease;
}

.item-link:hover .item-title {
  color: var(--primary-800);
  text-decoration: underline;
}

/* Descripción del item */
.item-description {
  font-family: var(--font-secondary);
  font-weight: 400;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.item-link:hover .item-description {
  text-decoration: underline;
}

/* Badge de nivel */
.level-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Container de hijos */
.children-container {
  display: flex;
  flex-direction: column;
}
</style>

