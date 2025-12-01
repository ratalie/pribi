<template>
  <SlotWrapper>
    <TitleH2
      title="Ruta 2: Segunda Página"
      subtitle="Segunda página de prueba para demostrar navegación por rutas."
    />

    <div class="flex flex-col gap-8">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p class="text-sm text-blue-800 font-semibold mb-2">✅ Navegación exitosa</p>
        <p class="text-sm text-blue-700">
          Has navegado a la segunda página de prueba. Esta es otra ruta diferente.
        </p>
        <p class="text-sm text-blue-600 mt-2">
          Observa en el sidebar derecho que "Ruta 2: Segunda Página" está activa (marcada en morado).
        </p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Contenido de la Página 2</h3>
        <p class="text-sm text-gray-600">
          Esta página demuestra cómo funciona la navegación por rutas. Cada sub-sección del sidebar
          puede llevar a una página diferente con su propio contenido.
        </p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Ruta 2
 * 
 * Segunda página de prueba para demostrar navegación por rutas.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/test-rutas/ruta-2
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

