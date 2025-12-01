<template>
  <SlotWrapper>
    <TitleH2
      title="Resumen: Aportes Dinerarios"
      subtitle="Revisa el resumen general del proceso de aporte dinerario."
    />

    <ResumenAporteDinerario context="punto-acuerdo" />
  </SlotWrapper>
</template>

<script setup lang="ts">
import ResumenAporteDinerario from "~/components/juntas/ResumenAporteDinerario.vue";

/**
 * Página: Resumen de Aporte Dinerario
 * 
 * Vista específica del resumen dentro del punto de acuerdo "Aporte Dinerario".
 * Usa el componente reutilizable ResumenAporteDinerario con contexto 'punto-acuerdo'.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/resumen
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});
</script>
