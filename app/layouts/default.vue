<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Toggle Button - Solo visible cuando está colapsado -->
    <Button
      v-if="isCollapsed"
      class="fixed top-2 left-2 z-40 w-10 h-10 border border-sidebar-border shadow-lg bg-primary-800 hover:bg-primary-600 transition-colors p-0"
      size="sm"
      @click="toggleSidebar"
    >
      <Menu class="w-4 h-4 text-white" />
    </Button>
    <!-- Sidebar -->
    <ProboSidebar
      v-if="!isCollapsed"
      class="transition-all duration-300 ease-in-out"
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
    />

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
  import { Menu } from "lucide-vue-next";
  import ProboSidebar from "~/components/ProboSidebar.vue";
  import Button from "~/components/ui/button/Button.vue";

  const isCollapsed = ref(false);

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>
