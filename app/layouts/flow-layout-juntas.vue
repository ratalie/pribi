<script setup lang="ts">
  /**
   * FlowLayoutJuntas - Layout para el flujo de Juntas de Accionistas
   *
   * Este layout será usado cuando las páginas de juntas definan:
   * definePageMeta({
   *   layout: "registros",
   *   flowLayoutJuntas: true,
   * });
   *
   * Por ahora es una estructura básica. Cuando crees el SidebarJuntas,
   * lo integrarás aquí.
   */

  // TODO: Cuando crees SidebarJuntas, importarlo aquí
  // import SidebarJuntas from "~/components/sidebar-juntas/SidebarJuntas.vue";
</script>

<template>
  <div class="flow-layout-juntas flex h-full">
    <!-- Sidebar de Juntas (por implementar) -->
    <!-- 
    <SidebarJuntas />
    -->

    <!-- Contenido principal -->
    <main class="flex-1 overflow-y-auto bg-white">
      <slot />
    </main>
  </div>
</template>

<style scoped>
  .flow-layout-juntas {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background);
  }
</style>
