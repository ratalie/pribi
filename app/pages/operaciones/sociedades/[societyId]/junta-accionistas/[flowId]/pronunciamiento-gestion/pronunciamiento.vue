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
  import CargaResultadosGestionManager from "~/core/presentation/operaciones/junta-accionistas/pasos/pronunciamiento-gestion/CargaResultadosGestionManager.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
