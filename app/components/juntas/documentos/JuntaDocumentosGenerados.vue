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
      />
    </div>

    <!-- Loading State -->
    <div v-else-if="isGenerating" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
        <p class="text-sm text-muted">Generando documentos...</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderExito from "./HeaderExito.vue";
import CategoriaDocumentos from "./CategoriaDocumentos.vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { DocumentoCategorizerService } from "~/core/hexag/documentos/domain/services/documento-categorizer.service";
// TODO: Importar use case cuando esté listo
// import { generateAllDocumentosUseCase } from "~/core/hexag/documentos/application/use-cases/generate-all-documentos.use-case";

const route = useRoute();
const societyId = computed(() => Number(route.params.societyId));
const flowId = computed(() => Number(route.params.flowId));

const documentos = ref<Documento[]>([]);
const isGenerating = ref(false);

const documentosPorCategoria = computed(() => {
  if (documentos.value.length === 0) return {};
  return DocumentoCategorizerService.agruparPorCategoria(documentos.value);
});

const totalDocumentos = computed(() => documentos.value.length);

const puntosAprobados = computed(() => {
  // TODO: Obtener de store o API
  return 0;
});

const handleDownloadAll = async () => {
  if (documentos.value.length === 0) {
    // TODO: Generar documentos si no existen
    await generarDocumentos();
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

const generarDocumentos = async () => {
  isGenerating.value = true;
  try {
    // TODO: Llamar a generateAllDocumentosUseCase
    // documentos.value = await generateAllDocumentosUseCase.execute({
    //   societyId: societyId.value,
    //   flowId: flowId.value,
    // });
    
    // Por ahora, mock data
    documentos.value = [];
  } catch (error) {
    console.error("Error generando documentos:", error);
  } finally {
    isGenerating.value = false;
  }
};

onMounted(() => {
  // Generar documentos al montar
  generarDocumentos();
});
</script>

