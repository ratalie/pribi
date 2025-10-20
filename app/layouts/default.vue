<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Sidebar -->
    <ProboSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-12">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProboSidebar from "~/components/ProboSidebar.vue";

// El tema se maneja completamente en useTheme.ts
// No duplicamos lógica aquí para evitar conflictos
</script>
