<script setup lang="ts">
/**
 * DualPanelLayout - Layout con sidebars estilo wizard
 * 
 * Similar a universal-flow-layout pero usa DualPanelSidebar
 * con UI profesional estilo Registro de Sociedades
 * 
 * Soporta:
 * - Sidebar izquierdo (navegación principal)
 * - Sidebar derecho contextual (opcional)
 * - ProboSidebar global
 */

import ProboSidebar from "~/components/ProboSidebar.vue";
import DualPanelSidebar from "~/components/dual-panel-sidebar/DualPanelSidebar.vue";
import { useFlowLayoutConfig } from "~/composables/useFlowLayoutConfig";
import { buildFlowItemTree, findItemByRoute } from "~/utils/flowHelpers";
import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
import type { FlowItemTree } from "~/types/flow-system";

/**
 * Cargar configuración del layout
 */
const { layoutConfig } = useFlowLayoutConfig();

/**
 * Estado del ProboSidebar global
 */
const isProboSidebarCollapsed = ref(false);
const toggleProboSidebar = () => {
  isProboSidebarCollapsed.value = !isProboSidebarCollapsed.value;
};

/**
 * Routing
 */
const route = useRoute();
const currentPath = computed(() => route.path);

/**
 * FlowConfig como árbol
 */
const flowConfig = computed(() => layoutConfig.value?.flowConfig);

const flowTree = computed<FlowItemTree[]>(() => {
  if (!flowConfig.value) return [];
  return buildFlowItemTree(flowConfig.value.items);
});

/**
 * Item actual basado en la ruta
 */
const currentItem = computed<FlowItemTree | undefined>(() => {
  if (!flowTree.value.length) return undefined;
  return findItemByRoute(flowTree.value, currentPath.value);
});

/**
 * Evaluar regla de visibilidad de sidebar
 */
function evaluateVisibilityRule(rule: SidebarConfig["visibilityRule"]): boolean {
  if (!rule) return true;

  switch (rule.type) {
    case "property": {
      if (!currentItem.value) return false;
      // Simplificado: siempre visible si hay currentItem
      return true;
    }
    case "route": {
      if (!rule.pattern) return true;
      const pattern = rule.pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath.value);
    }
    case "custom": {
      if (typeof rule.fn !== "function") return true;
      return rule.fn({
        currentPath: currentPath.value,
        currentItem: currentItem.value,
        allItems: flowConfig.value?.items || [],
      });
    }
    default:
      return true;
  }
}

/**
 * Sidebars activos (evaluando visibilityRule)
 */
const activeSidebars = computed<SidebarConfig[]>(() => {
  if (!layoutConfig.value) return [];

  return layoutConfig.value.sidebars.filter((sidebar) => {
    if (!sidebar.visibilityRule) return true;
    return evaluateVisibilityRule(sidebar.visibilityRule);
  });
});

/**
 * Sidebars izquierdos
 */
const leftSidebars = computed<SidebarConfig[]>(() => {
  return activeSidebars.value.filter((s) => s.position === "left");
});

/**
 * Sidebars derechos (con filtrado contextual)
 */
const rightSidebars = computed<SidebarConfig[]>(() => {
  return activeSidebars.value.filter((s) => s.position === "right");
});

/**
 * Aplicar filtrado contextual al sidebar derecho
 */
function getContextualSidebarConfig(sidebar: SidebarConfig): SidebarConfig {
  // Si no es sidebar derecho o no hay filtrado contextual, retornar como está
  if (sidebar.position !== "right" || !currentItem.value) {
    return sidebar;
  }

  const level = currentItem.value.hierarchy.level;
  let contextualItems: FlowItemTree[] = [];

  // Nivel 2: mostrar hijos (nivel 3)
  if (level === 2) {
    contextualItems = currentItem.value.children || [];
  }
  // Nivel 3: mostrar hermanos (otros hijos del mismo padre)
  else if (level === 3) {
    const parentId = currentItem.value.hierarchy.parentId;
    if (parentId) {
      const parent = findItemById(flowTree.value, parentId);
      if (parent && parent.children) {
        contextualItems = parent.children;
      }
    }
  }
  // Nivel 4: mostrar hermanos del nivel 4
  else if (level === 4) {
    const parentId = currentItem.value.hierarchy.parentId;
    if (parentId) {
      const parent = findItemById(flowTree.value, parentId);
      if (parent && parent.children) {
        contextualItems = parent.children;
      }
    }
  }

  // Si hay items contextuales, reemplazar los items del sidebar
  if (contextualItems.length > 0) {
    return {
      ...sidebar,
      items: contextualItems,
    };
  }

  return sidebar;
}

/**
 * Buscar item por ID
 */
function findItemById(
  items: FlowItemTree[],
  id: string
): FlowItemTree | undefined {
  for (const item of items) {
    if (item.identity.id === id) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
</script>

<template>
  <div class="dual-panel-layout">
    <!-- ProboSidebar global (izquierda) -->
    <ProboSidebar
      :is-collapsed="isProboSidebarCollapsed"
      :toggle-sidebar="toggleProboSidebar"
    />

    <!-- Container principal -->
    <div class="main-container">
      <!-- Sidebar izquierdo (flujo) -->
      <DualPanelSidebar
        v-for="sidebar in leftSidebars"
        :key="sidebar.id"
        :config="sidebar"
        mode="wizard"
        :current-path="currentPath"
      />

      <!-- Contenido principal -->
      <main class="content-area">
        <NuxtPage />
      </main>

      <!-- Sidebar derecho (contextual) -->
      <DualPanelSidebar
        v-for="sidebar in rightSidebars"
        :key="sidebar.id"
        :config="getContextualSidebarConfig(sidebar)"
        mode="wizard"
        :current-path="currentPath"
      />
    </div>
  </div>
</template>

<style scoped>
.dual-panel-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.main-container {
  display: flex;
  flex: 1;
  min-width: 0; /* Permite que el contenido se contraiga */
}

.content-area {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #ffffff;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
  }
}
</style>

