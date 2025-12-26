<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import AportesSection from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/components/organisms/AportesSection.vue";
  import { useAportesPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage";

  /**
   * Página: Aportes (Sub-sección de Aporte Dinerario)
   *
   * Muestra tabla de aportantes que son contribuyentes (isContributor: true)
   * y permite agregar/editar/eliminar aportes para cada uno.
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo inicialización si es necesaria
  useAportesPage();
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes"
      subtitle="Registra los aportes dinerarios realizados por los aportantes."
    />
    <AportesSection />
  </SlotWrapper>
</template>
