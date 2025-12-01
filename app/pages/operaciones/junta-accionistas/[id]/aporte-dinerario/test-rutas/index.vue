<template>
  <SlotWrapper>
    <TitleH2
      title="Test por Rutas"
      subtitle="Página principal de prueba para demostrar funcionalidad de hijos con rutas (navegación a nuevas páginas)."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Esta es la página principal del "Test por Rutas". Las sub-secciones en el sidebar derecho
        navegan a páginas diferentes (rutas nuevas).
      </p>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p class="text-sm text-blue-800 font-semibold mb-2">📌 Instrucciones:</p>
        <ul class="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Haz click en "Test por Rutas" en el sidebar derecho para expandirlo</li>
          <li>Verás 3 sub-secciones: Ruta 1, Ruta 2, Ruta 3</li>
          <li>Haz click en cualquiera de ellas y navegarás a una página diferente</li>
          <li>Observa cómo la URL cambia completamente (ej: /test-rutas/ruta-1)</li>
        </ul>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-4">
        <div
          v-for="ruta in rutas"
          :key="ruta.id"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
          @click="navigateToRuta(ruta.id)"
        >
          <h3 class="font-semibold text-gray-900 mb-2">{{ ruta.title }}</h3>
          <p class="text-sm text-gray-600">{{ ruta.description }}</p>
          <p class="text-xs text-gray-500 mt-2">Ruta: {{ ruta.route }}</p>
        </div>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useRouter } from "vue-router";

/**
 * Página: Test por Rutas (Principal)
 * 
 * Página de prueba temporal para demostrar la funcionalidad de hijos con rutas.
 * Las sub-secciones en el sidebar navegan a páginas diferentes.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/test-rutas
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

const router = useRouter();
const route = useRoute();

const rutas = [
  {
    id: "ruta-1",
    title: "Ruta 1: Primera Página",
    description: "Navega a la primera página de prueba",
    route: "/aporte-dinerario/test-rutas/ruta-1",
  },
  {
    id: "ruta-2",
    title: "Ruta 2: Segunda Página",
    description: "Navega a la segunda página de prueba",
    route: "/aporte-dinerario/test-rutas/ruta-2",
  },
  {
    id: "ruta-3",
    title: "Ruta 3: Tercera Página",
    description: "Navega a la tercera página de prueba",
    route: "/aporte-dinerario/test-rutas/ruta-3",
  },
];

const navigateToRuta = (rutaId: string) => {
  const ruta = rutas.find((r) => r.id === rutaId);
  if (ruta) {
    const juntaId = route.params.id;
    const fullPath = juntaId
      ? `/operaciones/junta-accionistas/${juntaId}${ruta.route}`
      : `/operaciones/junta-accionistas${ruta.route}`;
    router.push(fullPath);
  }
};

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>

