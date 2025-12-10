<template>
  <div class="min-h-full bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style="border-color: var(--primary-700)"
        ></div>
        <p class="text-sm" style="color: var(--text-muted); font-family: var(--font-secondary)">
          Cargando datos de la junta...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex justify-center items-center py-12">
      <div class="text-center">
        <p class="mb-2" style="color: #DC2626; font-family: var(--font-primary); font-weight: 600">
          Error al cargar datos
        </p>
        <p class="text-sm mb-4" style="color: var(--text-muted); font-family: var(--font-secondary)">
          {{ errorMessage }}
        </p>
        <button
          @click="reload"
          class="px-4 py-2 rounded-lg text-white transition-colors"
          style="background-color: var(--primary-800); font-family: var(--font-secondary)"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="downloadData" class="max-w-[1600px] mx-auto px-8 py-10">
      <JuntaDocumentosGenerados />
    </div>

    <!-- Debug: Mostrar datos en consola -->
    <div v-if="downloadData" class="hidden">
      <!-- Los datos se muestran en consola, no en UI -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from "vue";
  import JuntaDocumentosGenerados from "~/components/juntas/documentos/JuntaDocumentosGenerados.vue";
  import { useDownloadData } from "~/composables/useDownloadData";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  /**
   * Página: Documentos Generados
   *
   * Paso 6 del flujo de Juntas de Accionistas.
   * Permite visualizar y descargar los documentos finales generados.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Cargar datos de descarga (GET automático al montar)
  const { downloadData, isLoading, hasError, errorMessage, reload } = useDownloadData();

  // Debug: Mostrar datos en consola cuando se carguen
  watch(
    downloadData,
    (data) => {
      if (data) {
        console.log("📥 [Descargar] Datos completos cargados:", data);
        console.log("📋 [Descargar] Puntos de agenda:", data.agendaItems);
        console.log("📄 [Descargar] Detalles de junta:", data.meetingDetails);
        console.log("👥 [Descargar] Asistencia:", data.attendance.length, "accionistas");
        console.log("💰 [Descargar] Aporte dinerario:", data.agendaItemsData?.aporteDinerario);
      }
    },
    { immediate: true }
  );

  // Configurar el botón "Siguiente" (en este caso sería "Finalizar")
  useJuntasFlowNext(async () => {
    // TODO: Agregar lógica de finalización del flujo
    // Por ahora, solo permite navegar (aunque este es el último paso)
  });
</script>
