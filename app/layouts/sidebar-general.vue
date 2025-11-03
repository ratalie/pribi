<script setup lang="ts">
  import SidebarGeneral from "@/components/sidebar/SidebarGeneral.vue";
  import { juntaAccionistasFlowConfig, sucursalesFlowConfig } from "@/config/flows";
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";
  import { buildFlowItemTree } from "@/utils/flowHelpers";
  import { computed, ref } from "vue";

  type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
    items: FlowItemTree[];
  };

  const route = useRoute();

  // Estado del sidebar principal
  const isCollapsed = ref(false);
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // Detectar FlowConfig según la ruta
  const currentFlowConfig = computed<FlowConfigWithTree | null>(() => {
    const path = route.path;

    // Juntas de Accionistas
    if (path.startsWith("/operaciones/junta-accionistas")) {
      const treeItems = buildFlowItemTree(juntaAccionistasFlowConfig.items);
      return {
        ...juntaAccionistasFlowConfig,
        items: treeItems,
      };
    }

    // Sucursales
    if (path.startsWith("/registro-societario/sucursales")) {
      const treeItems = buildFlowItemTree(sucursalesFlowConfig.items);
      return {
        ...sucursalesFlowConfig,
        items: treeItems,
      };
    }

    return null;
  });

  // Determinar si mostrar el sidebar de flujo
  const showFlowSidebar = computed(() => {
    return currentFlowConfig.value !== null;
  });
</script>

<template>
  <div class="layout-with-sidebar-general flex min-h-screen">
    <!-- Sidebar General (con sidebar de flujo opcional) -->
    <SidebarGeneral
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
      :flow-config="currentFlowConfig"
      :show-flow-sidebar="showFlowSidebar"
    />

    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<style scoped>
  .layout-with-sidebar-general {
    background-color: var(--color-background);
  }
</style>
