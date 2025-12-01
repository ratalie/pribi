<template>
  <SlotWrapper>
    <TitleH2
      title="Ruta 1: Primera Página"
      subtitle="Primera página de prueba para demostrar navegación por rutas."
    />

    <div class="flex flex-col gap-8">
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <p class="text-sm text-green-800 font-semibold mb-2">✅ Navegación exitosa</p>
        <p class="text-sm text-green-700">
          Has navegado a la primera página de prueba. Esta es una ruta completamente diferente.
        </p>
        <p class="text-sm text-green-600 mt-2">
          Observa en el sidebar derecho que "Ruta 1: Primera Página" está activa (marcada en morado).
        </p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Contenido de la Página 1</h3>
        <p class="text-sm text-gray-600">
          Esta página demuestra cómo funciona la navegación por rutas. Cuando haces click en una
          sub-sección del sidebar, navegas a una página completamente nueva.
        </p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Ruta 1
 * 
 * Primera página de prueba para demostrar navegación por rutas.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/test-rutas/ruta-1
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>

