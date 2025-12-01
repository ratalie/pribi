<template>
  <SlotWrapper>
    <TitleH2
      title="Ruta 3: Tercera Página"
      subtitle="Tercera página de prueba para demostrar navegación por rutas."
    />

    <div class="flex flex-col gap-8">
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <p class="text-sm text-purple-800 font-semibold mb-2">✅ Navegación exitosa</p>
        <p class="text-sm text-purple-700">
          Has navegado a la tercera página de prueba. Esta es otra ruta diferente.
        </p>
        <p class="text-sm text-purple-600 mt-2">
          Observa en el sidebar derecho que "Ruta 3: Tercera Página" está activa (marcada en morado).
        </p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Contenido de la Página 3</h3>
        <p class="text-sm text-gray-600">
          Esta página demuestra cómo funciona la navegación por rutas. Puedes tener múltiples
          sub-secciones, cada una navegando a una página diferente.
        </p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Ruta 3
 * 
 * Tercera página de prueba para demostrar navegación por rutas.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/test-rutas/ruta-3
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

