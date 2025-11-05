<script setup lang="ts">
/**
 * HierarchicalPanel - Panel con jerarquías visuales
 * 
 * Características:
 * - UI profesional (checkmarks + líneas conectoras)
 * - Jerarquías de 4 niveles
 * - Expand/collapse por item
 * - Indent visual por nivel
 * - Badges de nivel (opcional)
 * 
 * Combina:
 * - UI de Registro de Sociedades (checkmarks, líneas)
 * - Funcionalidad de jerarquías (nuestro sistema)
 */

import type { FlowItemTree } from "~/types/flow-system";
import HierarchicalItem from "../shared/HierarchicalItem.vue";

interface Props {
  items: FlowItemTree[];
  currentPath: string;
  title?: string;
  showTitle?: boolean;
  showLevelBadges?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: false,
  showLevelBadges: false,
});
</script>

<template>
  <div class="hierarchical-panel">
    <!-- Título opcional -->
    <h3 v-if="showTitle && title" class="panel-title">{{ title }}</h3>

    <!-- Lista de items jerárquicos -->
    <div class="items-list">
      <HierarchicalItem
        v-for="(item, index) in items"
        :key="item.identity.id"
        :item="item"
        :current-path="currentPath"
        :level="0"
        :show-level-badge="showLevelBadges"
        :is-last="index === items.length - 1"
      />
    </div>

    <!-- Mensaje si no hay items -->
    <div v-if="items.length === 0" class="empty-state">
      <p class="text-gray-500 text-sm">No hay items disponibles</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos base del panel */
.hierarchical-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.panel-title {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.empty-state {
  padding: 24px;
  text-align: center;
}
</style>

