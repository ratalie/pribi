<script setup lang="ts">
  import AportantesSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportantesSection.vue";
  import { useAportantesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage";

  /**
   * VISTA: Aportantes para Aporte Dinerario
   *
   * Muestra tabla de accionistas existentes + permite agregar nuevos aportantes.
   * - EXISTENTES: Solo se seleccionan con checkbox
   * - NUEVOS: Se pueden editar/eliminar
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo inicialización si es necesaria
  useAportantesPage();
</script>

<template>
  <div class="space-y-6 p-6">
    <AportantesSection />
  </div>
</template>
