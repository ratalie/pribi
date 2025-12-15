<template>
  <SlotWrapper>
    <TitleH2
      title="Designación de auditores externo"
      subtitle="Decida si la sociedad contará con auditores externos y cómo se designarán."
      title-color="text-primary-800"
    />

    <AuditoresExternosManager />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import AuditoresExternosManager from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/components/AuditoresExternosManager.vue";
  import { useAuditoresExternosPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/composables/useAuditoresExternosPage";

  /**
   * Página: Designación de Auditores Externos
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-auditores/nombramiento
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Solo una línea: orquesta TODO
  useAuditoresExternosPage();
</script>
