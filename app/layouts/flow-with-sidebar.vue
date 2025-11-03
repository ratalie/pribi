<template>
  <div class="flex min-h-screen">
    <!-- Flow Sidebar -->
    <FlowSidebar v-if="currentFlowConfigWithTree" :config="currentFlowConfigWithTree" />

    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { juntaAccionistasFlowConfig, sucursalesFlowConfig } from "@/config/flows";
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";
  import { buildFlowItemTree } from "@/utils/flowHelpers";
  import { computed } from "vue";
  import { useRoute } from "vue-router";

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
  const currentFlowConfigWithTree = computed(() => {
    if (!currentFlowConfig.value) return null;

    return {
      ...currentFlowConfig.value,
      items: buildFlowItemTree(currentFlowConfig.value.items),
    } as FlowConfig & { items: FlowItemTree[] };
  });
</script>
