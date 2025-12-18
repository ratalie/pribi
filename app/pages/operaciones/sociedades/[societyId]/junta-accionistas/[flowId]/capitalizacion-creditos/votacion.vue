<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra el resultado de la votación para la capitalización de créditos."
    />
    <div class="flex flex-col gap-10">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <p class="text-gray-600">Cargando datos de votación...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Contenido de votación -->
      <div v-else-if="sesionVotacion" class="space-y-6">
        <!-- Pregunta de votación -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Pregunta de Votación</h3>
          <p class="text-gray-700">{{ preguntaVotacion }}</p>
        </div>

        <!-- Información de la sesión -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            <strong>Modo:</strong> {{ sesionVotacion.modo }} | <strong>Items:</strong>
            {{ sesionVotacion.items?.length || 0 }}
          </p>
        </div>

        <!-- Placeholder para componente de votación -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p class="text-blue-800">
            Componente de votación se integrará aquí (similar a MetodoVotacio de aporte dinerario)
          </p>
        </div>
      </div>

      <!-- Sin sesión de votación -->
      <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p class="text-gray-600">No hay sesión de votación disponible.</p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useVotacionCapitalizacionController } from "~/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/votacion/composables/useVotacionCapitalizacionController";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const { isLoading, error, sesionVotacion, preguntaVotacion } =
    useVotacionCapitalizacionController();
</script>
