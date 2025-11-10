<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes"
      subtitle="Registra los aportes dinerarios realizados por los aportantes."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  // Página: Aportes (Sub-paso de Aporte Dinerario)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: aporte-dinerario/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/aporte-dinerario/aportes
  // Enum: JuntaRoutes.APORTE_DINERARIO_APORTES

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
