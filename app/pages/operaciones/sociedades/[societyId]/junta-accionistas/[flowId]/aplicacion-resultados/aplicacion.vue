<template>
  <SlotWrapper>
    <TitleH2
      title="Detalle de Aplicación"
      subtitle="Define la asignación de utilidades o el tratamiento de pérdidas."
    />
    <AplicacionResultadosManager />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useAplicacionResultadosController } from "~/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/composables/useAplicacionResultadosController";
  import AplicacionResultadosManager from "~/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/components/AplicacionResultadosManager.vue";

  /**
   * Página: Aplicación de Resultados
   * 
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   * Esta página contiene 4 sub-secciones que son anclas dentro de la misma página.
   * 
   * Ruta: /operaciones/junta-accionistas/[id]/aplicacion-resultados/aplicacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const { guardarDatos } = useAplicacionResultadosController();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    try {
      await guardarDatos();
      // Si se guarda exitosamente, permite navegar al siguiente paso
    } catch (error: any) {
      console.error("[AplicacionResultados] Error al guardar:", error);
      throw error; // Esto previene la navegación si hay error
    }
  });
</script>
