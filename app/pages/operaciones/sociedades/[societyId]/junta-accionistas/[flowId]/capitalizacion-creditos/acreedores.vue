<script setup lang="ts">
  import AcreedoresSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/components/organisms/AcreedoresSection.vue";
  import { useAcreedoresPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useAcreedoresPage";

  /**
   * VISTA: Acreedores para Capitalización de Créditos
   *
   * Muestra tabla de accionistas existentes + permite agregar nuevos acreedores.
   * - EXISTENTES: Solo se seleccionan con checkbox
   * - NUEVOS: Se pueden editar/eliminar
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo inicialización si es necesaria
  useAcreedoresPage();
</script>

<template>
  <div class="space-y-6 p-6">
    <AcreedoresSection />
  </div>
</template>
