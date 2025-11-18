<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la votación del acuerdo de aumento de capital vía aporte dinerario."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  // Página: Votación - Aporte Dinerario (Sub-paso final)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: aporte-dinerario/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/aporte-dinerario/votacion
  // Enum: JuntaRoutes.APORTE_DINERARIO_VOTACION

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
