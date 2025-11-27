<template>
  <SlotWrapper>
    <TitleH2
      title="Test por Anclas"
      subtitle="Página de prueba para demostrar funcionalidad de hijos con anclas (scroll a elementos en la misma página)."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Esta página demuestra cómo funcionan las anclas. Las sub-secciones en el sidebar derecho
        hacen scroll a las secciones correspondientes en esta misma página.
      </p>

      <!-- Sección 1: Introducción -->
      <section id="ancla-1" class="flex flex-col gap-4 pt-8 scroll-mt-4">
        <TitleH4
          title="Ancla 1: Introducción"
          subtitle="Primera sección de prueba con ancla"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p class="text-sm text-blue-800">
            Esta es la primera sección. Cuando haces click en "Ancla 1: Introducción" en el sidebar
            derecho, la página hace scroll automáticamente a esta sección.
          </p>
          <p class="text-sm text-blue-700 mt-2">
            El ID de esta sección es: <code class="bg-blue-100 px-2 py-1 rounded">ancla-1</code>
          </p>
        </div>
      </section>

      <!-- Sección 2: Desarrollo -->
      <section id="ancla-2" class="flex flex-col gap-4 pt-8 scroll-mt-4">
        <TitleH4
          title="Ancla 2: Desarrollo"
          subtitle="Segunda sección de prueba con ancla"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <p class="text-sm text-green-800">
            Esta es la segunda sección. Cuando haces click en "Ancla 2: Desarrollo" en el sidebar
            derecho, la página hace scroll automáticamente a esta sección.
          </p>
          <p class="text-sm text-green-700 mt-2">
            El ID de esta sección es: <code class="bg-green-100 px-2 py-1 rounded">ancla-2</code>
          </p>
        </div>
      </section>

      <!-- Sección 3: Conclusión -->
      <section id="ancla-3" class="flex flex-col gap-4 pt-8 scroll-mt-4">
        <TitleH4
          title="Ancla 3: Conclusión"
          subtitle="Tercera sección de prueba con ancla"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p class="text-sm text-purple-800">
            Esta es la tercera sección. Cuando haces click en "Ancla 3: Conclusión" en el sidebar
            derecho, la página hace scroll automáticamente a esta sección.
          </p>
          <p class="text-sm text-purple-700 mt-2">
            El ID de esta sección es: <code class="bg-purple-100 px-2 py-1 rounded">ancla-3</code>
          </p>
        </div>
      </section>

      <!-- Instrucciones -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
        <p class="text-sm text-yellow-800 font-semibold mb-2">📌 Instrucciones:</p>
        <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>Haz click en "Test por Anclas" en el sidebar derecho para expandirlo</li>
          <li>Verás 3 sub-secciones: Ancla 1, Ancla 2, Ancla 3</li>
          <li>Haz click en cualquiera de ellas y la página hará scroll a la sección correspondiente</li>
          <li>Observa cómo el hash en la URL cambia (ej: #ancla-1)</li>
        </ul>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
import Titles from "~/types/enums/Titles.enum";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";

/**
 * Página: Test por Anclas
 * 
 * Página de prueba temporal para demostrar la funcionalidad de hijos con anclas.
 * Las sub-secciones en el sidebar hacen scroll a elementos en esta misma página.
 * 
 * Ruta: /operaciones/junta-accionistas/[id]/aporte-dinerario/test-anclas
 */

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

const route = useRoute();

// Función para hacer scroll a un elemento por su ID
const scrollToAnchor = (anchorId: string) => {
  nextTick(() => {
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        console.log("🔵 [test-anclas] Haciendo scroll a:", anchorId);
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn("🔵 [test-anclas] No se encontró elemento con ID:", anchorId);
      }
    }, 300); // Delay para asegurar que el DOM esté listo
  });
};

// Hacer scroll al elemento cuando la página se carga con un hash
onMounted(() => {
  const hash = route.hash?.replace("#", "");
  if (hash) {
    console.log("🔵 [test-anclas] onMounted con hash:", hash);
    scrollToAnchor(hash);
  }
});

// Watch el hash para hacer scroll cuando cambia (navegación desde otra página)
watch(
  () => route.hash,
  (newHash) => {
    if (newHash) {
      const anchorId = newHash.replace("#", "");
      console.log("🔵 [test-anclas] Hash cambiado a:", anchorId);
      scrollToAnchor(anchorId);
    }
  },
  { immediate: true }
);

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  // TODO: Agregar validación y guardado de datos
  // Por ahora, solo permite navegar al siguiente paso
});
</script>

<style scoped>
/* scroll-mt-4 para compensar el header fijo si existe */
</style>

