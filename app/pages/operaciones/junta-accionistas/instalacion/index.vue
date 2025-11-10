<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Realiza la convocatoria, registra la asistencia y conforma la mesa directiva."
    />

    <div class="flex flex-col gap-10">
      <ConvocatoriaRealizadaSection />
      <AsistenciaRepresentacionSection />
      <MesaDirectivaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import ConvocatoriaRealizadaSection from "~/components/juntas/instalacion/ConvocatoriaRealizadaSection.vue";
import AsistenciaRepresentacionSection from "~/components/juntas/instalacion/AsistenciaRepresentacionSection.vue";
import MesaDirectivaSection from "~/components/juntas/instalacion/MesaDirectivaSection.vue";

// Página: Instalación de la Junta
// Nivel: 0 (Principal)
// RightSidebar: Anclas a las secciones internas
// Ruta: /operaciones/junta-accionistas/instalacion

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
