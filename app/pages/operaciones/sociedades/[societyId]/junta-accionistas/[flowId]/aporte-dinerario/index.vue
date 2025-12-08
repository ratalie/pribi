<template>
  <div class="flex flex-col gap-6">
    <!-- Título -->
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-semibold font-primary text-gray-900">Aporte Dinerario</h2>
      <p class="text-base font-secondary text-gray-600">
        Este módulo concentra todo el proceso para convertir aportes dinerarios en aportes de capital. 
        Revisa esta introducción y luego avanza por cada sección específica mediante el panel derecho.
      </p>
    </div>

    <!-- Contenido introductorio -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold font-primary text-gray-900">
          Proceso de Aporte Dinerario
        </h3>
        <p class="text-sm font-secondary text-gray-700">
          Para completar el proceso de aumento de capital mediante aportes dinerarios, deberás seguir 
          estos pasos en orden:
        </p>
        
        <ol class="list-decimal list-inside space-y-2 text-sm font-secondary text-gray-700">
          <li>
            <strong>Aportantes:</strong> Selecciona los accionistas o nuevos aportantes que realizarán 
            los aportes dinerarios.
          </li>
          <li>
            <strong>Aportes:</strong> Registra los montos y detalles de cada aporte dinerario realizado 
            por los aportantes seleccionados.
          </li>
          <li>
            <strong>Votación:</strong> Realiza la votación para aprobar los aportes dinerarios propuestos, 
            ya sea por unanimidad o por mayoría.
          </li>
          <li>
            <strong>Resumen:</strong> Revisa el resumen completo del acuerdo de aporte dinerario antes 
            de finalizar.
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  /**
   * Página: Aporte Dinerario (Introducción)
   *
   * Sub-step del Paso 4 (Puntos de Acuerdo).
   * Este sub-step tiene secciones que se muestran en el sidebar derecho.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // Esta es solo una página de introducción, no requiere guardado
    // El botón "Siguiente" navegará automáticamente a la siguiente sección
  });
</script>
