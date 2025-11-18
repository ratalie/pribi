<script setup lang="ts">
/**
 * DualPanelSidebar - Componente orquestador
 *
 * Renderiza diferentes modos de panel según configuración:
 * - "wizard": UI estilo Registro de Sociedades (paso a paso)
 * - "hierarchical": UI con jerarquías
 * - "scroll-anchor": UI con anchors de secciones
 *
 * Recibe SidebarConfig y lo convierte al formato apropiado para cada panel
 */

import type { SidebarConfig } from "~/types/flow-layout/sidebar-config";
import { flowConfigToSteps } from "~/application/dual-panel/flowConfigToSteps";
import HierarchicalPanel from "./panels/HierarchicalPanel.vue";
import ScrollAnchorPanel from "./panels/ScrollAnchorPanel.vue";
import StepWizardPanel from "./panels/StepWizardPanel.vue";
import type { FlowItemTree } from "~/types/flow-system";
import type { NavigationStep } from "~/types/navigationSteps";

type PanelMode = "wizard" | "hierarchical" | "admin" | "scroll-anchor";

type WizardPanelVariant = "default" | "sections";

interface WizardPanelProps {
  steps: NavigationStep[];
  title?: string;
  showTitle: boolean;
  variant: WizardPanelVariant;
}

interface HierarchicalPanelProps {
  items: FlowItemTree[];
  currentPath: string;
  title?: string;
  showTitle: boolean;
  showLevelBadges: boolean;
}

interface ScrollAnchorPanelProps {
  items: FlowItemTree[];
  currentPath: string;
}

type PanelSetup =
  | {
      kind: "wizard";
      component: typeof StepWizardPanel;
      props: WizardPanelProps;
    }
  | {
      kind: "hierarchical";
      component: typeof HierarchicalPanel;
      props: HierarchicalPanelProps;
    }
  | {
      kind: "scroll-anchor";
      component: typeof ScrollAnchorPanel;
      props: ScrollAnchorPanelProps;
    };

interface Props {
  config: SidebarConfig;
  mode?: PanelMode;
  currentPath: string;
  flowId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "wizard",
  flowId: "unknown-flow",
});

const steps = computed(() => {
  const items = Array.isArray(props.config.items) ? props.config.items : [];

  if (props.config.filter) {
    const filter = props.config.filter;

    if (filter.type === "level" && filter.criteria) {
      const { minLevel, maxLevel } = filter.criteria as {
        minLevel: number;
        maxLevel: number;
      };
      return flowConfigToSteps(items, props.currentPath, {
        startLevel: minLevel,
        maxLevel: maxLevel,
        includeChildren: true,
        flowId: props.flowId,
      });
    }

    if (filter.type === "property") {
      return flowConfigToSteps(items, props.currentPath, {
        includeChildren: true,
        flowId: props.flowId,
      });
    }
  }

  return flowConfigToSteps(items, props.currentPath, {
    includeChildren: true,
    flowId: props.flowId,
  });
});

const panelSetup = computed<PanelSetup>(() => {
  const items = Array.isArray(props.config.items) ? props.config.items : [];
  const mode: PanelMode = props.mode ?? "wizard";

  if (mode === "hierarchical") {
    return {
      kind: "hierarchical",
      component: HierarchicalPanel,
      props: {
        items,
        currentPath: props.currentPath,
        title: props.config.title,
        showTitle: false,
        showLevelBadges: false,
      },
    };
  }

  if (mode === "scroll-anchor") {
    return {
      kind: "scroll-anchor",
      component: ScrollAnchorPanel,
      props: {
        items,
        currentPath: props.currentPath,
      },
    };
  }

  const variant: WizardPanelVariant = props.config.position === "right" ? "sections" : "default";

  return {
    kind: "wizard",
    component: StepWizardPanel,
    props: {
      steps: steps.value,
      title: props.config.title,
      showTitle: false,
      variant,
    },
  };
});

const sidebarClasses = computed(() => {
  const classes = ["dual-panel-sidebar"];

  if (props.config.position) {
    classes.push(`sidebar-${props.config.position}`);
  }

  if (props.config.class) {
    classes.push(props.config.class as string);
  }

  return classes;
});

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
    <div v-if="config.title" class="sidebar-header">
      <h2 class="sidebar-title">{{ config.title }}</h2>
    </div>

    <component :is="panelSetup.component" v-bind="panelSetup.props" />
  </aside>
</template>

<style scoped>
  .dual-panel-sidebar {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .sidebar-left {
    border-right: 1px solid #e5e7eb;
    border-left: none;
  }

  .sidebar-right {
    border-left: 1px solid #e5e7eb;
    border-right: none;
  }

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

  .dual-panel-sidebar :deep(.step-wizard-panel) {
    padding: 24px;
  }

  .dual-panel-sidebar {
    width: var(--sidebar-width, 540px);
    background: white;
    min-height: 100vh;
  }

  .sidebar-left {
    border-right: 1px solid #e2e2e4;
  }

  @media (max-width: 768px) {
    .dual-panel-sidebar {
      width: 100%;
    }
  }
</style>
