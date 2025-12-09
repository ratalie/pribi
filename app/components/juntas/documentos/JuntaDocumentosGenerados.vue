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
        :is-documento-selected="isDocumentoSelected"
        @descargar="handleDownloadIndividual"
        @toggle-selection="handleToggleSelection"
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

    <!-- Sección Repositorio -->
    <div
      class="bg-white border rounded-xl p-6"
      style="border-color: var(--border-default); border-radius: var(--radius-medium)"
    >
      <div class="space-y-4">
        <!-- Título -->
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            style="background-color: var(--primary-100)"
          >
            <Icon name="lucide:folder-up" class="w-6 h-6" style="color: var(--primary-800)" />
          </div>
          <div>
            <h3
              class="text-base mb-1"
              style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 600"
            >
              Enviar al Repositorio Documental
            </h3>
            <p
              class="text-sm"
              style="color: var(--text-muted); font-family: var(--font-secondary)"
            >
              Guarda los documentos generados en el repositorio de la sociedad
            </p>
          </div>
        </div>

        <!-- Checkbox y Botón -->
        <div class="flex items-center justify-between gap-4">
          <!-- Checkbox -->
          <div class="flex items-start gap-3 flex-1">
            <input
              v-model="enviarAlRepositorio"
              type="checkbox"
              id="sendToRepo"
              :disabled="isUploading || documentos.length === 0"
              class="mt-1 w-4 h-4 rounded"
              style="accent-color: var(--primary-800)"
            />
            <label
              for="sendToRepo"
              class="text-sm"
              :class="{ 'cursor-not-allowed opacity-50': isUploading || documentos.length === 0 }"
              style="font-family: var(--font-secondary)"
            >
              <span style="font-weight: 600">
                Enviar automáticamente al Repositorio Documental
              </span>
              <br />
              <span v-if="isUploading" style="color: var(--primary-600)">
                Enviando documentos...
              </span>
              <span v-else-if="errorMessage" style="color: var(--error-600)">
                {{ errorMessage }}
              </span>
              <span v-else-if="documentos.length === 0" style="color: var(--text-muted)">
                Genera documentos primero
              </span>
              <span v-else style="color: var(--text-muted)">
                Los documentos se enviarán automáticamente al repositorio
              </span>
            </label>
          </div>

          <!-- Botón Enviar Manual -->
          <button
            @click="handleEnviarManual"
            :disabled="isUploading || documentosSeleccionados.length === 0"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: var(--primary-800)"
          >
            <Icon
              v-if="!isUploading"
              name="lucide:upload"
              class="w-4 h-4"
            />
            <Icon
              v-else
              name="lucide:loader-2"
              class="w-4 h-4 animate-spin"
            />
            <span v-if="!isUploading">
              Enviar al Repositorio
              <span v-if="documentosSeleccionados.length > 0">
                ({{ documentosSeleccionados.length }} {{ documentosSeleccionados.length === 1 ? 'archivo' : 'archivos' }})
              </span>
            </span>
            <span v-else>Enviando...</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import HeaderExito from "./HeaderExito.vue";
import CategoriaDocumentos from "./CategoriaDocumentos.vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { useDownloadData } from "~/composables/useDownloadData";
import { useDocumentosGeneradosStore } from "~/core/presentation/juntas/documentos/stores/documentos-generados.store";
import { useEnviarDocumentosRepositorio } from "~/composables/useEnviarDocumentosRepositorio";

const {
  downloadData,
  razonSocial,
  ruc,
  isLoading: isLoadingData,
  hasError: hasErrorData,
} = useDownloadData();

const documentosStore = useDocumentosGeneradosStore();
const { enviarDocumentos, isUploading, errorMessage } = useEnviarDocumentosRepositorio();

const documentos = computed(() => documentosStore.documentos);
const isGenerating = computed(() => documentosStore.status === "generating");
const documentosPorCategoria = computed(() => documentosStore.documentosPorCategoria);
const totalDocumentos = computed(() => documentosStore.totalDocumentos);

// Estado del checkbox de repositorio (automático)
const enviarAlRepositorio = ref(false);

// Estado de selección de documentos individuales
const documentosSeleccionados = ref<Set<string>>(new Set());

// Documentos seleccionados como array
const documentosSeleccionadosArray = computed(() => {
  return documentos.value.filter((doc) => documentosSeleccionados.value.has(doc.id));
});

// Verificar si un documento está seleccionado
const isDocumentoSelected = (documentoId: string): boolean => {
  return documentosSeleccionados.value.has(documentoId);
};

// Toggle selección de documento
const handleToggleSelection = (documentoId: string) => {
  if (documentosSeleccionados.value.has(documentoId)) {
    documentosSeleccionados.value.delete(documentoId);
  } else {
    documentosSeleccionados.value.add(documentoId);
  }
  console.log("📋 [JuntaDocumentosGenerados] Documentos seleccionados:", documentosSeleccionados.value.size);
};

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

// Watch para enviar automáticamente cuando checkbox esté marcado
watch(
  [() => documentos.value.length, () => enviarAlRepositorio.value],
  async ([docCount, shouldSend]) => {
    if (docCount > 0 && shouldSend && !isUploading.value) {
      try {
        await enviarDocumentos();
      } catch (error) {
        console.error("Error en envío automático:", error);
      }
    }
  }
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

// Enviar manualmente al repositorio (solo documentos seleccionados)
const handleEnviarManual = async () => {
  if (documentosSeleccionadosArray.value.length === 0) {
    console.warn("No hay documentos seleccionados para enviar");
    return;
  }

  try {
    console.log("📤 [JuntaDocumentosGenerados] Enviando documentos seleccionados:", documentosSeleccionadosArray.value.length);
    
    // Enviar solo los documentos seleccionados
    await enviarDocumentos(documentosSeleccionadosArray.value);
    
    // Limpiar selección después de envío exitoso
    documentosSeleccionados.value.clear();
    console.log("✅ [JuntaDocumentosGenerados] Documentos enviados, selección limpiada");
    
    // Desmarcar checkbox después de envío manual exitoso
    enviarAlRepositorio.value = false;
  } catch (error) {
    console.error("Error en envío manual:", error);
  }
};
</script>

