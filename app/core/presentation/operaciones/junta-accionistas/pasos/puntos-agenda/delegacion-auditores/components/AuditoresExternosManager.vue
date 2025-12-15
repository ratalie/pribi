<template>
  <div class="flex flex-col gap-10">
    <ResponsableDesignacionSection />
    <AuditorExternoSection v-if="store.responsableDesignacion === 'JUNTA_DE_ACCIONISTAS'" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { useAuditoresExternosController } from "../composables/useAuditoresExternosController";
  import { useAuditoresExternosStore } from "../stores/useAuditoresExternosStore";
  import AuditorExternoSection from "./organisms/AuditorExternoSection.vue";
  import ResponsableDesignacionSection from "./organisms/ResponsableDesignacionSection.vue";

  const store = useAuditoresExternosStore();
  const { cargarDatos } = useAuditoresExternosController();

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos();
  });
</script>
