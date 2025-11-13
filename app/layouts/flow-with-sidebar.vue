<template>
  <div class="flex min-h-screen">
    <!-- Flow Sidebar -->
    <FlowSidebar v-if="currentSidebarConfig" :config="currentSidebarConfig" />

    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { juntaAccionistasFlowConfig, sucursalesFlowConfig } from "@/config/flows";
  import type { FlowConfig } from "@/types/flow-system";
  import { SidebarPosition as FlowSidebarPosition } from "@/types/flow-system";
  import type { SidebarConfig } from "@/types/flow-layout";
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { buildFlowItemTree } from "~/utils/flowHelpers";

  const route = useRoute();

  // Detectar qué FlowConfig usar basándose en la ruta actual
  const currentFlowConfig = computed(() => {
    const path = route.path;

    // Rutas de Junta de Accionistas
    if (path.startsWith("/operaciones/junta-accionistas")) {
      return juntaAccionistasFlowConfig;
    }

    // Rutas de Sucursales
    if (path.startsWith("/registro-societario/sucursales")) {
      return sucursalesFlowConfig;
    }

    // Sin sidebar para rutas no reconocidas
    return null;
  });

  // Convertir FlowConfig con FlowItem[] a FlowConfig con FlowItemTree[]
  const mapRenderMode = (config: FlowConfig): SidebarConfig["mode"] => {
    const mode = config.renderOptions?.mode;
    if (mode === "hierarchical" || mode === "sequential") {
      return mode;
    }
    return "custom";
  };

  const mapSidebarPosition = (position: FlowSidebarPosition): SidebarConfig["position"] => {
    if (position === FlowSidebarPosition.RIGHT) {
      return "right";
    }
    return "left";
  };

  const currentSidebarConfig = computed<SidebarConfig | null>(() => {
    const config = currentFlowConfig.value;
    if (!config) return null;

    const sidebarOptions = config.sidebarOptions;
    if (!sidebarOptions) return null;

    const itemsTree = buildFlowItemTree(config.items);

    return {
      id: `${config.id}-sidebar`,
      position: mapSidebarPosition(sidebarOptions.position),
      mode: mapRenderMode(config),
      title: sidebarOptions.headerTitle ?? config.name,
      items: itemsTree,
      collapsible: sidebarOptions.collapsible ?? true,
      collapsed: sidebarOptions.startCollapsed ?? false,
      width: sidebarOptions.width ? `${sidebarOptions.width}px` : undefined,
      collapsedWidth: sidebarOptions.minWidth ? `${sidebarOptions.minWidth}px` : undefined,
      class: sidebarOptions.customClasses,
    };
  });
</script>
