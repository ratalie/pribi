<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import SeleccionDirectoresTitularesSection from "~/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresTitularesSection.vue";
  import SeleccionDirectoresSuplentesSection from "~/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresSuplentesSection.vue";
  import { useRemocionDirectoresPage } from "~/core/presentation/juntas/puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const {
    directores,
    directoresTitulares,
    directoresSuplentesAlternos,
    updateCheckedItemsTitulares,
    updateCheckedItemsSuplentes,
    guardarSeleccion,
  } = useRemocionDirectoresPage();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await guardarSeleccion();
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Directores"
      subtitle="Identifica a los directores cuya remoción será evaluada."
    />

    <div class="flex flex-col gap-10">
      <!-- Sección 1: Directores Titulares -->
      <SeleccionDirectoresTitularesSection
        :directores="directores"
        @update:checked-items="updateCheckedItemsTitulares"
      />

      <!-- Sección 2: Directores Suplentes y Alternos -->
      <SeleccionDirectoresSuplentesSection
        :directores="directores"
        @update:checked-items="updateCheckedItemsSuplentes"
      />
    </div>
  </SlotWrapper>
</template>
