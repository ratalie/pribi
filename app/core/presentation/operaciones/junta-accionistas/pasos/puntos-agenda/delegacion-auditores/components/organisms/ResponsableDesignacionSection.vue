<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 text-gray-800 font-primary">Responsables de la designación</p>
    <div class="flex gap-8">
      <ResponsableCard
        v-for="responsable in responsables"
        :key="responsable.id"
        :value="responsable.value"
        :title="responsable.title"
        :selected="store.responsableDesignacion === responsable.value"
        @select="handleSelectResponsable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuditoresExternosStore } from "../../stores/useAuditoresExternosStore";
  import ResponsableCard from "../molecules/ResponsableCard.vue";

  const store = useAuditoresExternosStore();

  const responsables = [
    {
      id: "junta",
      value: "JUNTA_DE_ACCIONISTAS" as const,
      title: "Junta de accionistas",
    },
    {
      id: "directorio",
      value: "DIRECTORIO" as const,
      title: "Directorio",
    },
  ];

  /**
   * Manejar selección de responsable
   */
  function handleSelectResponsable(value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO") {
    store.responsableDesignacion = value;

    // Si cambia a DIRECTORIO, limpiar nombre del auditor
    if (value === "DIRECTORIO") {
      store.nombreCompletoAuditor = "";
    }
  }
</script>


