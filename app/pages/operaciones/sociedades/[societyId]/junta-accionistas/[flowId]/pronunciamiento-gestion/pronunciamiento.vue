<template>
  <SlotWrapper>
    <TitleH2
      title="Carga de resultados y gestión social"
      subtitle="Sube la Memoria y los documentos que respaldan los resultados."
      title-color="text-primary-800"
    />
    <CargaResultadosGestionManager />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import CargaResultadosGestionManager from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/pronunciamiento-gestion/components/CargaResultadosGestionManager.vue";
  import { usePronunciamientoPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/pronunciamiento-gestion/composables/usePronunciamientoPage";

  /**
   * Página: Pronunciamiento de Gestión Social
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   *
   * Ruta: /operaciones/junta-accionistas/[id]/pronunciamiento-gestion/pronunciamiento
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo una línea: orquesta TODO
  usePronunciamientoPage();
</script>
