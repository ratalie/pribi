<script setup lang="ts">
  import ProboSidebar from "~/components/ProboSidebar.vue";

  const route = useRoute();
  const isFlowLayout = computed(() => route.meta.flowLayout === true);

  // Estado del sidebar con persistencia en localStorage
  const SIDEBAR_STORAGE_KEY = "probo-sidebar-collapsed";

  // Inicializar desde localStorage
  const getInitialCollapsedState = (): boolean => {
    if (import.meta.client) {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored === "true";
    }
    return false;
  };

  const isCollapsed = ref(getInitialCollapsedState());

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
    // Guardar en localStorage
    if (import.meta.client) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed.value));
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
    <div class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
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
