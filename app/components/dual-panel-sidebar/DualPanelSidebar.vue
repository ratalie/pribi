<script setup lang="ts">
/**
 * DualPanelSidebar - Componente orquestador
 * 
 * Renderiza diferentes modos de panel según configuración:
 * - "wizard": UI estilo Registro de Sociedades (paso a paso)
 * - "hierarchical": UI con jerarquías (futuro - Fase 3)
 * - "admin": UI simple de navegación (futuro)
 * 
 * Recibe SidebarConfig y lo convierte al formato apropiado para cada panel
 */

import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
import { flowConfigToSteps, childrenToSteps, siblingsToSteps } from "./adapters/flowConfigToSteps";
import StepWizardPanel from "./panels/StepWizardPanel.vue";
import HierarchicalPanel from "./panels/HierarchicalPanel.vue";

type PanelMode = "wizard" | "hierarchical" | "admin";

interface Props {
  config: SidebarConfig;
  mode?: PanelMode;
  currentPath: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "wizard",
});

/**
 * Convertir FlowItemTree[] a NavigationStep[] según modo
 */
const steps = computed(() => {
  // Convertir items a steps según modo y filtros
  const items = Array.isArray(props.config.items) ? props.config.items : [];
  
  // Aplicar filtros si existen
  let filteredItems = items;
  
  if (props.config.filter) {
    const filter = props.config.filter;
    
    // Filtro por nivel
    if (filter.type === "level" && filter.criteria) {
      const { minLevel, maxLevel } = filter.criteria;
      return flowConfigToSteps(items, props.currentPath, {
        startLevel: minLevel,
        maxLevel: maxLevel,
        includeChildren: true,
      });
    }
    
    // Filtro por propiedad (simplificado por ahora)
    if (filter.type === "property") {
      // Por ahora solo convertimos todos
      return flowConfigToSteps(items, props.currentPath, {
        includeChildren: true,
      });
    }
  }
  
  // Sin filtro: convertir todos los items
  return flowConfigToSteps(filteredItems, props.currentPath, {
    includeChildren: true,
  });
});

/**
 * Seleccionar componente de panel según modo
 */
const panelComponent = computed(() => {
  switch (props.mode) {
    case "wizard":
      return StepWizardPanel;
    case "hierarchical":
      return HierarchicalPanel;
    // case "admin":
    //   return AdminNavPanel; // Futuro
    default:
      return StepWizardPanel;
  }
});

/**
 * Props para el panel según modo
 */
const panelProps = computed(() => {
  const items = Array.isArray(props.config.items) ? props.config.items : [];
  
  if (props.mode === "hierarchical") {
    // HierarchicalPanel recibe FlowItemTree[]
    return {
      items,
      currentPath: props.currentPath,
      title: props.config.title,
      showTitle: false,
      showLevelBadges: false,
    };
  }
  
  // wizard mode: StepWizardPanel recibe NavigationStep[]
  return {
    steps: steps.value,
    title: props.config.title,
    showTitle: false,
  };
});

/**
 * Clases CSS según posición del sidebar
 */
const sidebarClasses = computed(() => {
  const classes = ["dual-panel-sidebar"];
  
  if (props.config.position) {
    classes.push(`sidebar-${props.config.position}`);
  }
  
  if (props.config.class) {
    classes.push(props.config.class);
  }
  
  return classes;
});

/**
 * Estilos inline según configuración
 */
const sidebarStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.config.width) {
    styles.width = props.config.width;
  }
  
  return styles;
});
</script>

<template>
  <aside :class="sidebarClasses" :style="sidebarStyles">
    <!-- Título del sidebar (opcional) -->
    <div v-if="config.title" class="sidebar-header">
      <h2 class="sidebar-title">{{ config.title }}</h2>
    </div>

    <!-- Panel dinámico según modo -->
    <component
      :is="panelComponent"
      v-bind="panelProps"
    />
  </aside>
</template>

<style scoped>
/**
 * Estilos base del sidebar
 * Ancho fijo de 401px como Registro de Sociedades
 */

.dual-panel-sidebar {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  flex-shrink: 0;
}

/* Sidebar izquierdo */
.sidebar-left {
  border-right: 1px solid #e5e7eb;
  border-left: none;
}

/* Sidebar derecho */
.sidebar-right {
  border-left: 1px solid #e5e7eb;
  border-right: none;
}

/* Header del sidebar */
.sidebar-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.sidebar-title {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 18px;
  color: #1f2937;
  margin: 0;
}

/* Padding interno como Registro de Sociedades */
.dual-panel-sidebar :deep(.step-wizard-panel) {
  padding: 56px 24px;
}

/* Ancho por defecto (401px como Sociedades) */
.dual-panel-sidebar {
  width: 401px;
}

/* Responsive: en pantallas pequeñas, ancho completo */
@media (max-width: 768px) {
  .dual-panel-sidebar {
    width: 100%;
  }
}
</style>

