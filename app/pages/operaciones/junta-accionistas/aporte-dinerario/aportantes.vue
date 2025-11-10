<template>
  <SlotWrapper>
    <TitleH2
      title="Aportantes"
      subtitle="Selecciona los aportantes que participarán en la junta de accionistas."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  // Página: Aportantes (Sub-paso de Aporte Dinerario)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: aporte-dinerario/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/aporte-dinerario/aportantes
  // Enum: JuntaRoutes.APORTE_DINERARIO_APORTANTES

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
