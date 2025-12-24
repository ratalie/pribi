<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";
  import ProboSidebar from "~/components/ProboSidebar.vue";

  const route = useRoute();
  const isFlowLayout = computed(() => route.meta.flowLayout === true);
  const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);

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
    <div
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out bg-gray-50"
    >
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto scrollbar-overlay bg-gray-50 w-full">
        <!-- Layout para registros (sociedades) -->
        <NuxtLayout v-if="isFlowLayout" name="flow-layout">
          <slot />
        </NuxtLayout>

        <!-- Layout para juntas -->
        <NuxtLayout v-else-if="isFlowLayoutJuntas" name="flow-layout-juntas">
          <slot />
        </NuxtLayout>

        <!-- Sin layout anidado -->
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<style scoped>
  .registros-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background);
  }

  .main-container {
    display: flex;
    flex: 1;
    min-width: 0; /* Permite que el contenido se contraiga */
  }

  .content-area {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #ffffff;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .main-container {
      flex-direction: column;
    }
  }

  /* Scrollbar overlay - transparente, no ocupa espacio, z-index alto */
  .scrollbar-overlay {
    /* Firefox - scrollbar overlay transparente */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    /* Asegurar que el contenido llegue hasta el final - sin padding/margin */
    padding-right: 0 !important;
    margin-right: 0 !important;
    width: 100%;
    box-sizing: border-box;
    /* Asegurar que el contenido llegue hasta el final de la ventana */
    min-height: 100%;
  }

  .scrollbar-overlay:hover {
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
  }

  /* Webkit - scrollbar overlay transparente con z-index alto */
  .scrollbar-overlay::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: transparent !important;
    /* Overlay - no ocupa espacio */
    -webkit-appearance: none;
    appearance: none;
  }

  .scrollbar-overlay::-webkit-scrollbar-track {
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    /* Overlay - no ocupa espacio */
    -webkit-appearance: none;
    appearance: none;
  }

  .scrollbar-overlay::-webkit-scrollbar-thumb {
    background-color: transparent !important;
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: background-color 0.2s ease;
    /* Overlay - no ocupa espacio */
    -webkit-appearance: none;
    appearance: none;
  }

  .scrollbar-overlay:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15) !important;
  }

  .scrollbar-overlay:hover::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Asegurar que el contenido ocupe todo el ancho disponible */
  .scrollbar-overlay > * {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
</style>
