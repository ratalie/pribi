<script setup lang="ts">
  import { Menu } from "lucide-vue-next";
  import ProboSidebar from "~/components/ProboSidebar.vue";
  import Button from "~/components/ui/button/Button.vue";

  const route = useRoute();
  const isFlowLayout = computed(() => route.meta.flowLayout === true);

  // Cargar estado desde localStorage
  const loadSidebarState = (): boolean => {
    if (import.meta.client) {
      const saved = localStorage.getItem('probo-sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  };

  const isCollapsed = ref(loadSidebarState());

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
    // Guardar en localStorage
    if (import.meta.client) {
      localStorage.setItem('probo-sidebar-collapsed', String(isCollapsed.value));
    }
  };
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Sidebar - Siempre visible, se colapsa pero no se oculta -->
    <ProboSidebar
      class="transition-all duration-300 ease-in-out"
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content -->
    <div 
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'ml-[100px]' : 'ml-[280px]'"
    >
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <NuxtLayout v-if="isFlowLayout" name="flow-layout">
          <slot />
        </NuxtLayout>
        <slot v-else />
      </main>
    </div>
  </div>
</template>
