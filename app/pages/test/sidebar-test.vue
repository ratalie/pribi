<template>
  <div class="sidebar-test p-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">🧪 Test de Sidebars - Sistema Universal</h1>
      <p class="text-muted-foreground">
        Herramienta de debugging para visualizar el árbol de FlowItems y estado del sistema
      </p>
    </div>

    <!-- Selector de flujo -->
    <div class="flow-selector mb-8 p-6 border rounded-lg bg-card">
      <h2 class="text-2xl font-semibold mb-4">Seleccionar Flujo</h2>
      <div class="flex gap-4">
        <button
          class="px-6 py-3 rounded-lg font-medium transition-colors"
          :class="
            currentFlow === 'juntas'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          "
          @click="selectFlow('juntas')"
        >
          📋 Junta de Accionistas
        </button>
        <button
          class="px-6 py-3 rounded-lg font-medium transition-colors"
          :class="
            currentFlow === 'sucursales'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          "
          @click="selectFlow('sucursales')"
        >
          🏢 Sucursales
        </button>
      </div>
    </div>

    <!-- Info del flujo actual -->
    <div v-if="flowConfig" class="flow-info mb-8 p-6 border rounded-lg bg-card">
      <h2 class="text-2xl font-semibold mb-4">Información del Flujo</h2>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-semibold">ID:</span>
          {{ flowConfig.id }}
        </div>
        <div>
          <span class="font-semibold">Nombre:</span>
          {{ flowConfig.name }}
        </div>
        <div>
          <span class="font-semibold">Total Items:</span>
          {{ flowConfig.items.length }}
        </div>
        <div>
          <span class="font-semibold">Items en Árbol:</span>
          {{ flowTree.length }} (root items)
        </div>
      </div>
    </div>

    <!-- Árbol de FlowItems -->
    <div class="tree-view mb-8">
      <h2 class="text-2xl font-semibold mb-4">Árbol de Navegación</h2>
      <div class="border rounded-lg p-6 bg-card overflow-auto max-h-[600px]">
        <TreeViewer v-if="flowTree.length" :items="flowTree" :current-path="currentPath" />
        <p v-else class="text-muted-foreground">No hay items en el árbol</p>
      </div>
    </div>

    <!-- Layout Config -->
    <div v-if="layoutConfig" class="layout-config mb-8">
      <h2 class="text-2xl font-semibold mb-4">Configuración de Layout</h2>
      <div class="border rounded-lg p-6 bg-card">
        <div class="mb-4">
          <span class="font-semibold">Layout ID:</span>
          {{ layoutConfig.id }}
        </div>
        <div class="mb-4">
          <span class="font-semibold">Tipo:</span>
          {{ layoutConfig.type }}
        </div>
        <div class="mb-4">
          <span class="font-semibold">Sidebars configurados:</span>
          {{ layoutConfig.sidebars.length }}
        </div>

        <!-- Lista de sidebars -->
        <div class="sidebars-list mt-6">
          <h3 class="text-lg font-semibold mb-3">Sidebars:</h3>
          <div
            v-for="sidebar in layoutConfig.sidebars"
            :key="sidebar.id"
            class="sidebar-card mb-4 p-4 border rounded bg-background"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="font-semibold">{{ sidebar.id }}</span>
              <span class="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                {{ sidebar.position }}
              </span>
            </div>
            <div class="text-sm space-y-1">
              <div>
                <span class="font-medium">Modo:</span>
                {{ sidebar.mode }}
              </div>
              <div>
                <span class="font-medium">Items:</span>
                {{ sidebar.items.length }}
              </div>
              <div v-if="sidebar.filter">
                <span class="font-medium">Filtro:</span>
                {{ sidebar.filter.type }}
                <span v-if="sidebar.filter.criteria" class="ml-2 text-muted-foreground">
                  {{ JSON.stringify(sidebar.filter.criteria) }}
                </span>
              </div>
              <div v-if="sidebar.visibilityRule">
                <span class="font-medium text-orange-500">Visibility Rule:</span>
                {{ sidebar.visibilityRule.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado actual -->
    <div class="current-state">
      <h2 class="text-2xl font-semibold mb-4">Estado Actual (Debug Info)</h2>
      <div class="border rounded-lg p-6 bg-card">
        <pre class="text-xs overflow-auto">{{ debugInfo }}</pre>
      </div>
    </div>

    <!-- Links rápidos de testing -->
    <div class="quick-links mt-8 p-6 border rounded-lg bg-card">
      <h2 class="text-2xl font-semibold mb-4">Links Rápidos de Testing</h2>

      <div class="mb-6">
        <h3 class="font-semibold mb-2">Juntas - Nivel 0 (Sin sidebar derecho)</h3>
        <div class="space-y-2">
          <NuxtLink
            to="/operaciones/junta-accionistas/seleccion-agenda"
            class="block text-blue-500 hover:underline"
          >
            → Selección de Agenda (Nivel 0)
          </NuxtLink>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-semibold mb-2">Juntas - Nivel 1-2 (Sin sidebar derecho)</h3>
        <div class="space-y-2">
          <NuxtLink
            to="/operaciones/junta-accionistas/aporte-dinerario"
            class="block text-blue-500 hover:underline"
          >
            → Aporte Dinerario (Nivel 2)
          </NuxtLink>
          <NuxtLink
            to="/operaciones/junta-accionistas/nombramiento-apoderados"
            class="block text-blue-500 hover:underline"
          >
            → Nombramiento Apoderados (Nivel 2)
          </NuxtLink>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-semibold mb-2 text-green-600">
          Juntas - Nivel 3 (CON sidebar derecho ✨)
        </h3>
        <div class="space-y-2">
          <NuxtLink
            to="/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento"
            class="block text-green-500 hover:underline font-semibold"
          >
            → Nombramiento Apoderados - Designación (Nivel 3) ⭐
          </NuxtLink>
          <NuxtLink
            to="/operaciones/junta-accionistas/aporte-dinerario/aportantes"
            class="block text-green-500 hover:underline font-semibold"
          >
            → Aporte Dinerario - Aportantes (Nivel 3) ⭐
          </NuxtLink>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Sucursales - Flat (Sin jerarquía)</h3>
        <div class="space-y-2">
          <NuxtLink
            to="/registro-societario/sucursales/datos-sociedad"
            class="block text-purple-500 hover:underline"
          >
            → Datos Sociedad
          </NuxtLink>
          <NuxtLink
            to="/registro-societario/sucursales/capital-social"
            class="block text-purple-500 hover:underline"
          >
            → Capital Social
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";
  import TreeViewer from "~/components/test/TreeViewer.vue";
  import juntasLayoutConfig from "~/config/flows/juntas.layout";
  import sucursalesLayoutConfig from "~/config/flows/sucursales.layout";
  import type { FlowLayoutConfig } from "~/types/flow-layout";
  import type { FlowConfig, FlowItemTree } from "~/types/flow-system";
  import { buildFlowItemTree } from "~/utils/flowHelpers";

  const route = useRoute();

  // Estado
  const currentFlow = ref<"juntas" | "sucursales">("juntas");

  // FlowConfig actual
  const flowConfig = computed<FlowConfig | null>(() => {
    if (currentFlow.value === "juntas") {
      return juntasLayoutConfig.flowConfig || null;
    }
    if (currentFlow.value === "sucursales") {
      return sucursalesLayoutConfig.flowConfig || null;
    }
    return null;
  });

  // Layout Config actual
  const layoutConfig = computed<FlowLayoutConfig | null>(() => {
    if (currentFlow.value === "juntas") {
      return juntasLayoutConfig;
    }
    if (currentFlow.value === "sucursales") {
      return sucursalesLayoutConfig;
    }
    return null;
  });

  // Árbol construido
  const flowTree = computed<FlowItemTree[]>(() => {
    if (!flowConfig.value?.items) return [];
    return buildFlowItemTree(flowConfig.value.items);
  });

  // Ruta actual
  const currentPath = computed(() => route.path);

  // Info de debug
  const debugInfo = computed(() => {
    return {
      currentFlow: currentFlow.value,
      currentPath: currentPath.value,
      flowId: flowConfig.value?.id || null,
      totalItems: flowConfig.value?.items.length || 0,
      treeRootItems: flowTree.value.length,
      layoutConfigured: !!layoutConfig.value,
      sidebarsCount: layoutConfig.value?.sidebars.length || 0,
    };
  });

  // Función para cambiar flujo
  function selectFlow(flow: "juntas" | "sucursales") {
    currentFlow.value = flow;
  }
</script>

<style scoped>
  .sidebar-test {
    max-width: 1400px;
    margin: 0 auto;
  }

  pre {
    background-color: hsl(var(--muted));
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
</style>
