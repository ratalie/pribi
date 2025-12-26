<template>
  <SlotWrapper>
    <TitleH2
      title="Detalle de Aplicación"
      subtitle="Define la asignación de utilidades o el tratamiento de pérdidas."
    />
    <AplicacionResultadosManager />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import AplicacionResultadosManager from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/components/AplicacionResultadosManager.vue";
  import { useAplicacionResultadosPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/composables/useAplicacionResultadosPage";

  /**
   * Página: Aplicación de Resultados
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   * Esta página contiene 4 sub-secciones que son anclas dentro de la misma página.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados/aplicacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo una línea: orquesta TODO
  useAplicacionResultadosPage();
</script>
