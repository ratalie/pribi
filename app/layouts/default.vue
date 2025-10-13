<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar -->
    <ProboSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProboSidebar from "~/components/ProboSidebar.vue";
import { useTheme } from "~/composables/useTheme";

// Initialize theme on app mount
onMounted(() => {
  // This ensures theme is applied immediately
  const { effectiveTheme } = useTheme();
  watch(
    effectiveTheme,
    (theme) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    },
    { immediate: true }
  );
});
</script>
