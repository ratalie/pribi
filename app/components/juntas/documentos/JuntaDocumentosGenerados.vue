<template>
  <div class="space-y-6 p-6">
    <!-- Header de Éxito -->
    <HeaderExito
      :total-documentos="totalDocumentos"
      :puntos-aprobados="puntosAprobados"
    />

    <!-- Botón Descarga Global -->
    <div
      class="bg-white border rounded-xl p-6"
      style="border-color: var(--border-default); border-radius: var(--radius-medium)"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            style="background-color: var(--primary-100)"
          >
            <Icon name="lucide:package" class="w-6 h-6" style="color: var(--primary-800)" />
          </div>
          <div>
            <h3
              class="text-base mb-1"
              style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 600"
            >
              Descargar Todos los Documentos
            </h3>
            <p
              class="text-sm"
              style="color: var(--text-muted); font-family: var(--font-secondary)"
            >
              {{ totalDocumentos }} archivos en formato ZIP
            </p>
          </div>
        </div>
        <button
          @click="handleDownloadAll"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
          style="background-color: var(--primary-800)"
          :disabled="isGenerating"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          <span v-if="!isGenerating">Descargar Todo (ZIP)</span>
          <span v-else>Generando...</span>
        </button>
      </div>
    </div>

    <!-- Categorías de Documentos -->
    <div v-if="documentosPorCategoria && Object.keys(documentosPorCategoria).length > 0">
      <CategoriaDocumentos
        v-for="(documentos, categoria) in documentosPorCategoria"
        :key="categoria"
        :titulo="categoria"
        :documentos="documentos"
        @descargar="handleDownloadIndividual"
        @preview="handlePreview"
      />
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoadingData || isGenerating" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
        <p class="text-sm text-muted">
          <span v-if="isLoadingData">Cargando datos de la junta...</span>
          <span v-else-if="isGenerating">Generando documentos...</span>
        </p>
      </div>
    </div>

    <!-- Info Banner -->
    <div
      class="bg-blue-50 border border-blue-200 rounded-xl p-6"
      style="border-radius: var(--radius-medium)"
    >
      <div class="flex items-start gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"
        >
          <Icon name="lucide:file-text" class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4
            class="text-base mb-2"
            style="color: #1E40AF; font-family: var(--font-primary); font-weight: 600"
          >
            📌 Información Importante
          </h4>
          <ul
            class="text-sm space-y-2 leading-relaxed"
            style="color: #1E3A8A; font-family: var(--font-secondary)"
          >
            <li>✓ Todos los documentos han sido generados automáticamente</li>
            <li>✓ Los documentos están listos para descarga</li>
            <li>✓ Puedes descargar documentos individualmente o todos juntos en formato ZIP</li>
            <li>✓ Recomendamos revisar cada documento antes de su uso oficial</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Checkbox Repositorio (deshabilitado por ahora) -->
    <div
      class="bg-white border rounded-xl p-6"
      style="border-color: var(--border-default); border-radius: var(--radius-medium)"
    >
      <div class="flex items-start gap-3">
        <input
          type="checkbox"
          id="sendToRepo"
          disabled
          class="mt-1 w-4 h-4 rounded"
          style="accent-color: var(--primary-800)"
        />
        <label
          for="sendToRepo"
          class="text-sm cursor-not-allowed"
          style="color: var(--text-secondary); font-family: var(--font-secondary)"
        >
          <span style="font-weight: 600">
            Enviar automáticamente al Repositorio Documental
          </span>
          <br />
          <span style="color: var(--text-muted)">
            (Funcionalidad disponible próximamente)
          </span>
        </label>
      </div>
    </div>

    <!-- Modal de Preview -->
    <DocumentoPreviewModal
      :is-open="previewModalOpen"
      :documento="documentoPreview"
      @close="handleClosePreview"
      @download="handleDownloadIndividual"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import HeaderExito from "./HeaderExito.vue";
import CategoriaDocumentos from "./CategoriaDocumentos.vue";
import DocumentoPreviewModal from "./DocumentoPreviewModal.vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { useDownloadData } from "~/composables/useDownloadData";
import { useDocumentosGeneradosStore } from "~/core/presentation/juntas/documentos/stores/documentos-generados.store";

const {
  downloadData,
  razonSocial,
  ruc,
  isLoading: isLoadingData,
  hasError: hasErrorData,
} = useDownloadData();

const documentosStore = useDocumentosGeneradosStore();

const documentos = computed(() => documentosStore.documentos);
const isGenerating = computed(() => documentosStore.status === "generating");
const documentosPorCategoria = computed(() => documentosStore.documentosPorCategoria);
const totalDocumentos = computed(() => documentosStore.totalDocumentos);

// Estado del modal de preview
const previewModalOpen = ref(false);
const documentoPreview = ref<Documento | null>(null);

const puntosAprobados = computed(() => {
  // Contar puntos de agenda activos
  if (!downloadData.value) return 0;
  const items = downloadData.value.agendaItems;
  let count = 0;
  if (items.aumentoCapital.aportesDinerarios) count++;
  if (items.aumentoCapital.capitalizacionDeCreditos) count++;
  if (items.nombramiento.nombramientoGerenteGeneral) count++;
  if (items.nombramiento.nombramientoDirectores) count++;
  // ... agregar más puntos
  return count;
});

// Generar documentos cuando haya datos
watch(
  [downloadData, razonSocial, ruc],
  async ([data, razon, rucValue]) => {
    if (data && razon && rucValue && !documentosStore.hasDocumentos && !isGenerating.value) {
      console.log("🔄 [JuntaDocumentosGenerados] Generando documentos...", {
        hasData: !!data,
        razonSocial: razon,
        ruc: rucValue,
      });
      await documentosStore.generarDocumentos(data, razon, rucValue);
      console.log("✅ [JuntaDocumentosGenerados] Documentos generados:", documentos.value.length);
    }
  },
  { immediate: true }
);

const handleDownloadAll = async () => {
  if (documentos.value.length === 0) {
    console.warn("No hay documentos para descargar");
    return;
  }

  // TODO: Generar ZIP y descargar
  console.log("Descargar ZIP con", documentos.value.length, "documentos");
};

const handleDownloadIndividual = async (documento: Documento) => {
  const url = URL.createObjectURL(documento.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = documento.nombre;
  a.click();
  URL.revokeObjectURL(url);
};

const handlePreview = (documento: Documento) => {
  console.log("🎯 [JuntaDocumentosGenerados] handlePreview llamado");
  console.log("📄 [JuntaDocumentosGenerados] Documento recibido:", {
    id: documento.id,
    nombre: documento.nombre,
    categoria: documento.categoria,
    blobSize: documento.blob?.size || 0,
    blobType: documento.blob?.type || "N/A",
  });
  console.log("🔧 [JuntaDocumentosGenerados] Configurando estado del modal...");
  documentoPreview.value = documento;
  previewModalOpen.value = true;
  console.log("✅ [JuntaDocumentosGenerados] Modal configurado:", {
    previewModalOpen: previewModalOpen.value,
    hasDocumentoPreview: !!documentoPreview.value,
  });
};

const handleClosePreview = () => {
  previewModalOpen.value = false;
  // Limpiar después de que el modal se cierre (para animación)
  setTimeout(() => {
    documentoPreview.value = null;
  }, 300);
};
</script>

