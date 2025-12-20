<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import CapitalizacionesSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/components/organisms/CapitalizacionesSection.vue";
  import { useCapitalizacionesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/capitalizacion-creditos/composables/useCapitalizacionesPage";

  /**
   * Página: Capitalizaciones (Sub-sección de Capitalización de Créditos)
   *
   * Muestra tabla de acreedores que son contribuyentes (isContributor: true para CREDIT)
   * y permite agregar/editar/eliminar capitalizaciones para cada uno.
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo inicialización si es necesaria
  useCapitalizacionesPage();
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Capitalizaciones"
      subtitle="Registra las capitalizaciones de créditos realizadas por los acreedores."
    />
    <CapitalizacionesSection />
  </SlotWrapper>
</template>
