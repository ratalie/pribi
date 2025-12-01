<script setup lang="ts">
  import FlowLayoutJuntasContentWrapper from "~/components/flow-layout-juntas/FlowLayoutJuntasContentWrapper.vue";
  import FlowLayoutJuntasFooterWrapper from "~/components/flow-layout-juntas/FlowLayoutJuntasFooterWrapper.vue";
  import FlowLayoutJuntasHeader from "~/components/flow-layout-juntas/FlowLayoutJuntasHeader.vue";
  import FlowLayoutJuntasSidebar from "~/components/flow-layout-juntas/FlowLayoutJuntasSidebar.vue";

  /**
   * FlowLayoutJuntas - Layout para el flujo de Juntas de Accionistas
   *
   * Este layout será usado cuando las páginas de juntas definan:
   * definePageMeta({
   *   layout: "registros",
   *   flowLayoutJuntas: true,
   * });
   *
   * Estructura:
   * - Header: Breadcrumbs y botones de acción
   * - Sidebar Izquierdo: Pasos principales y sub-steps colapsables
   * - Contenido: Área principal con slot
   * - Sidebar Derecho: Secciones dentro de un sub-step (condicional)
   * - Footer: Botón "Siguiente"
   *
   * Todos los componentes son auto-gestionados (no reciben props):
   * - Cada componente importa internamente los composables que necesita
   * - El layout solo orquesta la estructura visual
   */
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Izquierdo (inicia desde arriba, no limitado por header) -->
    <!-- Este componente gestiona internamente todos sus datos y handlers -->
    <FlowLayoutJuntasSidebar />

    <!-- Contenido Principal -->
    <div class="flex flex-col min-h-0 flex-1 overflow-hidden">
      <!-- Header -->
      <!-- Este componente gestiona internamente todos sus datos y handlers -->
      <FlowLayoutJuntasHeader />

      <!-- Área de Contenido + Sidebar Derecho -->
      <!-- Este componente gestiona internamente todos sus datos y handlers -->
      <FlowLayoutJuntasContentWrapper>
        <slot />
      </FlowLayoutJuntasContentWrapper>

      <!-- Footer -->
      <!-- Este componente gestiona internamente todos sus datos y handlers -->
      <FlowLayoutJuntasFooterWrapper />
    </div>
  </div>
</template>

<style scoped>
  .flow-layout-juntas {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background, #f9fafb);
  }
</style>
