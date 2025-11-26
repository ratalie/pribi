<template>
  <SlotWrapper>
    <TitleH2
      title="Detalles de la Junta"
      subtitle="Configura los datos esenciales de la junta antes de iniciar el flujo."
    />

    <div class="flex flex-col gap-10">
      <TipoJuntaSection />
      <ModalidadJuntaSection />
      <ConvocatoriaJuntaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import TipoJuntaSection from "~/components/juntas/detalles/TipoJuntaSection.vue";
import ModalidadJuntaSection from "~/components/juntas/detalles/ModalidadJuntaSection.vue";
import ConvocatoriaJuntaSection from "~/components/juntas/detalles/ConvocatoriaJuntaSection.vue";

// Página: Detalles de la Junta
// Nivel: 0 (Principal)
// RightSidebar: Anclas a las secciones internas
// Ruta: /operaciones/junta-accionistas/detalles

definePageMeta({
  layout: "default",
});
</script>
