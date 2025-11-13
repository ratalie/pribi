<script setup lang="ts">
/**
 * RegistrosLayout - Layout con sidebars estilo wizard
 * 
 * Replica la funcionalidad de dual-panel-layout para el módulo de Registros
 * 
 * Soporta:
 * - Sidebar izquierdo (navegación principal)
 * - Sidebar derecho contextual (opcional)
 * - ProboSidebar global
 */

import { computed, ref, watch } from "vue";
import ProboSidebar from "~/components/ProboSidebar.vue";
import DualPanelSidebar from "~/presentation/dual-panel/sidebar/DualPanelSidebar.vue";
import { useFlowLayoutConfig } from "~/composables/useFlowLayoutConfig";
import { buildFlowItemTree, findItemByRoute } from "~/utils/flowHelpers";
import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
import type { FlowItemTree } from "~/types/flow-system";
import { useFlowProgressStore } from "~/stores/flowProgress.store";

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

const flowId = computed(() => layoutConfig.value?.id ?? "unknown-flow");

const progressStore = useFlowProgressStore();

function collectStepIds(items: FlowItemTree[], accumulator: string[] = []): string[] {
  for (const item of items) {
    accumulator.push(item.identity.id);
    if (item.children && item.children.length > 0) {
      collectStepIds(item.children, accumulator);
    }
  }
  return accumulator;
}

watch(
  flowTree,
  (items) => {
    if (!items || items.length === 0) return;
    const stepIds = collectStepIds(items);
    progressStore.initializeFlow(flowId.value, stepIds);
  },
  { immediate: true }
);

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
type PanelMode = "wizard" | "hierarchical" | "scroll-anchor";

function getContextualSidebarConfig(sidebar: SidebarConfig): SidebarConfig & { panelMode?: PanelMode } {
  const config: SidebarConfig & { panelMode?: PanelMode } = {
    ...sidebar,
  };

  // Si no es sidebar derecho o no hay item actual, no se aplica contextualización
  if (sidebar.position !== "right" || !currentItem.value) {
    const fallback = sidebar.mode === "sequential" ? "wizard" : sidebar.mode;
    config.panelMode = (fallback as PanelMode) ?? "wizard";
    return config;
  }

  const level = currentItem.value.hierarchy.level ?? 0;
  const levelFilterCriteria = {
    minLevel: 3,
    maxLevel: 4,
  };

  // Nivel 0-1: mostrar sub-pasos agrupados (niveles 3-4)
  if (level === 0 || level === 1) {
    config.items = currentItem.value.children || [];
    config.filter = {
      type: "level",
      criteria: levelFilterCriteria,
    };
    config.panelMode = "wizard";
  }
  // Nivel 2: mostrar hijos de nivel 3 (pasos del acuerdo) y sus secciones nivel 4
  else if (level === 2) {
    config.items = currentItem.value.children || [];
    config.filter = {
      type: "level",
      criteria: levelFilterCriteria,
    };
    config.panelMode = "wizard";
  }
  // Nivel 3: mantener listado de pasos hermanos (nivel 3) + secciones (nivel 4)
  else if (level === 3) {
    const parentId = currentItem.value.hierarchy.parentId;
    if (parentId) {
      const parent = findItemById(flowTree.value, parentId);
      if (parent?.children) {
        config.items = parent.children;
        config.filter = {
          type: "level",
          criteria: levelFilterCriteria,
        };
        config.panelMode = "wizard";
      }
    }
  }
  // Nivel 4+: mantener estructura del padre de nivel 3 y mostrar secciones hermanas sin cambiar modo
  else if (level >= 4) {
    const parentId = currentItem.value.hierarchy.parentId;
    if (parentId) {
      const parent = findItemById(flowTree.value, parentId);
      const grandParentId = parent?.hierarchy.parentId;
      const source = grandParentId ? findItemById(flowTree.value, grandParentId) : parent;

      if (source?.children) {
        config.items = source.children;
        config.filter = {
          type: "level",
          criteria: levelFilterCriteria,
        };
        config.panelMode = "wizard";
      }
    }
  }

  // Si no se asignó un modo específico, usar wizard por defecto para secuenciales
  if (!config.panelMode) {
    const fallback = sidebar.mode === "sequential" ? "wizard" : sidebar.mode;
    config.panelMode = (fallback as PanelMode) ?? "wizard";
  }

  return config;
}

const contextualRightSidebars = computed(() => {
  return rightSidebars.value.map((sidebar) => {
    const config = getContextualSidebarConfig(sidebar);
    return {
      id: sidebar.id,
      config,
      mode: config.panelMode ?? "wizard",
    };
  });
});

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
  <div class="registros-layout">
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
        :current-path="currentPath"
      />

      <!-- Contenido principal -->
      <main class="content-area">
        <slot />
      </main>

      <!-- Sidebar derecho (contextual) -->
      <DualPanelSidebar
        v-for="sidebar in contextualRightSidebars"
        :key="sidebar.id"
        :config="sidebar.config"
        :mode="sidebar.mode"
        :current-path="currentPath"
        :flow-id="flowId"
      />
    </div>
  </div>
</template>

<style scoped>
.registros-layout {
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

