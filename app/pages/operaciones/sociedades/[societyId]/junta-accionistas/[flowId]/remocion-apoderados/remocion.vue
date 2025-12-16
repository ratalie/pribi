<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import SeleccionApoderadosSection from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/components/organisms/SeleccionApoderadosSection.vue";
  import { useRemocionApoderadosPage } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const { apoderados, updateCheckedItems, guardarSeleccion } = useRemocionApoderadosPage();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await guardarSeleccion();
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Apoderados"
      subtitle="Identifica a los apoderados cuya remoción será evaluada."
    />
    <SeleccionApoderadosSection
      :apoderados="apoderados"
      @update:checked-items="updateCheckedItems"
    />
  </SlotWrapper>
</template>
