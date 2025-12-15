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
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useAuditoresExternosController } from "~/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/composables/useAuditoresExternosController";
  import AuditoresExternosManager from "~/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/components/AuditoresExternosManager.vue";

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

  const { guardarDatos } = useAuditoresExternosController();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    try {
      await guardarDatos();
      // Si se guarda exitosamente, permite navegar al siguiente paso
    } catch (error: any) {
      console.error("[AuditoresExternos] Error al guardar:", error);
      throw error; // Esto previene la navegación si hay error
    }
  });
</script>
