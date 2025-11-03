<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Test: Flow Sucursales</h1>
      <p class="text-muted-foreground">Visualización y testing del FlowConfig de Sucursales</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Card: FlowConfig Info -->
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">FlowConfig Info</h2>
        <dl class="space-y-2">
          <div>
            <dt class="text-sm font-medium text-muted-foreground">ID:</dt>
            <dd class="text-sm font-mono">{{ flowConfig.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted-foreground">Name:</dt>
            <dd class="text-sm">{{ flowConfig.name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted-foreground">Version:</dt>
            <dd class="text-sm">{{ flowConfig.version }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted-foreground">Total Items:</dt>
            <dd class="text-sm">{{ flowConfig.items.length }} (Flat structure)</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted-foreground">Render Mode:</dt>
            <dd class="text-sm">{{ flowConfig.renderOptions.mode }}</dd>
          </div>
        </dl>
      </div>

      <!-- Card: Render Options -->
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Render Options</h2>
        <ul class="space-y-1 text-sm">
          <li v-for="(value, key) in flowConfig.renderOptions" :key="key">
            <span class="text-muted-foreground">{{ key }}:</span>
            <span class="ml-2 font-mono">{{ JSON.stringify(value) }}</span>
          </li>
        </ul>
      </div>

      <!-- Card: Sidebar Options -->
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Sidebar Options</h2>
        <ul class="space-y-1 text-sm">
          <li v-for="(value, key) in flowConfig.sidebarOptions" :key="key">
            <span class="text-muted-foreground">{{ key }}:</span>
            <span class="ml-2 font-mono">{{ JSON.stringify(value) }}</span>
          </li>
        </ul>
      </div>

      <!-- Card: Metadata -->
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Metadata</h2>
        <pre class="text-xs overflow-auto">{{
          JSON.stringify(flowConfig.metadata, null, 2)
        }}</pre>
      </div>
    </div>

    <!-- FlowItems List -->
    <div class="mt-8 border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">FlowItems (Sequential)</h2>
      <div class="space-y-4">
        <div
          v-for="(item, index) in flowConfig.items"
          :key="item.identity.id"
          class="border-l-4 border-green-500 pl-4 py-2"
        >
          <div class="font-semibold">{{ index + 1 }}. {{ item.identity.label }}</div>
          <div class="text-sm text-muted-foreground">
            ID:
            <span class="font-mono">{{ item.identity.id }}</span>
          </div>
          <div class="text-sm text-muted-foreground">
            Type:
            <span class="font-mono">{{ item.identity.type }}</span>
          </div>
          <div class="text-sm text-muted-foreground">
            Level: {{ item.hierarchy.level }} | Order: {{ item.hierarchy.order }}
          </div>
          <div class="text-sm text-muted-foreground">
            Route:
            <span class="font-mono">{{ item.navigation.route }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Dump -->
    <div class="mt-8 border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Full FlowConfig (JSON)</h2>
      <pre class="text-xs overflow-auto max-h-96 bg-gray-100 dark:bg-gray-800 p-4 rounded">{{
        JSON.stringify(flowConfig, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { sucursalesFlowConfig } from "@/modules/sucursales/flow-configs";

  const flowConfig = sucursalesFlowConfig;

  definePageMeta({
    title: "Test: Sucursales Flow",
    description: "Testing page for Sucursales FlowConfig",
  });
</script>
