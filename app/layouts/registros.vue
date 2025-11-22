<script setup lang="ts">
  import { Menu } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useRoute } from "vue-router";
  import ProboSidebar from "~/components/ProboSidebar.vue";
  import Button from "~/components/ui/button/Button.vue";

  const route = useRoute();
  const isFlowLayout = computed(() => route.meta.flowLayout === true);
  const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);

  const isCollapsed = ref(false);

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>

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
      <main class="flex-1 overflow-y-auto">
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
</style>
