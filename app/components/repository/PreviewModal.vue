<script setup lang="ts">
import { X, Loader2 } from "lucide-vue-next";
import { usePrevisualizarDocumento } from "~/core/presentation/repositorio/composables/usePrevisualizarDocumento";

interface Document {
  name: string;
  type: string;
  owner: string;
  dateModified: Date;
  size?: number;
  versionCode?: string;
  mimeType?: string;
}

interface Props {
  isOpen: boolean;
  document: Document | null;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const { previsualizar } = usePrevisualizarDocumento();

const previewContent = ref<{
  type: "image" | "html" | "canvas";
  content: string | HTMLCanvasElement;
} | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const previewContainer = ref<HTMLElement | null>(null);
const canvasContainer = ref<HTMLElement | null>(null);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Cargar preview cuando se abre el modal
watch(
  () => [props.isOpen, props.document?.versionCode],
  async ([isOpen, versionCode]) => {
    console.log("🟡 [PreviewModal] ========================================");
    console.log("🟡 [PreviewModal] WATCH TRIGGERED");
    console.log("🟡 [PreviewModal] ========================================");
    console.log("🟡 [PreviewModal] isOpen:", isOpen);
    console.log("🟡 [PreviewModal] versionCode:", versionCode);
    console.log("🟡 [PreviewModal] document:", props.document);
    console.log("🟡 [PreviewModal] mimeType:", props.document?.mimeType);
    
    if (isOpen && versionCode && props.document?.mimeType) {
      console.log("🟢 [PreviewModal] Iniciando carga de preview...");
      isLoading.value = true;
      error.value = null;
      previewContent.value = null;

      // Limpiar canvas anterior
      if (canvasContainer.value) {
        const existingCanvas = canvasContainer.value.querySelector("canvas");
        if (existingCanvas) {
          existingCanvas.remove();
        }
      }

      try {
        console.log("🟢 [PreviewModal] Llamando a previsualizar...");
        const preview = await previsualizar(versionCode, props.document.mimeType);
        console.log("🟢 [PreviewModal] Preview obtenido:", {
          type: preview.type,
          hasContent: Boolean(preview.content),
        });
        
        previewContent.value = preview;

        // Si es canvas, agregarlo al contenedor
        if (preview.type === "canvas" && canvasContainer.value) {
          console.log("🟢 [PreviewModal] Agregando canvas al contenedor...");
          canvasContainer.value.appendChild(preview.content as HTMLCanvasElement);
        }
        
        console.log("🟢 [PreviewModal] Preview cargado correctamente");
      } catch (err: any) {
        error.value = err.message || "Error al cargar la vista previa";
        console.error("❌ [PreviewModal] Error al previsualizar:", err);
        console.error("❌ [PreviewModal] Error stack:", err.stack);
      } finally {
        isLoading.value = false;
      }
    } else {
      console.warn("⚠️ [PreviewModal] Condiciones no cumplidas:", {
        isOpen,
        hasVersionCode: Boolean(versionCode),
        hasMimeType: Boolean(props.document?.mimeType),
      });
    }
  },
  { immediate: true }
);

// Limpiar preview al cerrar
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      previewContent.value = null;
      error.value = null;
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="emits('close')"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emits('close')"
        />

        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10"
          :style="{
            fontFamily: 'var(--font-secondary)',
          }"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex-1 min-w-0">
              <h3
                class="text-xl truncate"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                {{ document?.name || "Vista Previa" }}
              </h3>
              <p
                class="text-sm mt-1"
                :style="{ color: 'var(--text-muted)' }"
              >
                {{ document?.type }}
              </p>
            </div>
            <button
              class="ml-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="emits('close')"
            >
              <X
                class="w-5 h-5"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </div>

          <!-- Preview Content -->
          <div class="flex-1 overflow-auto p-6">
            <div
              ref="previewContainer"
              class="w-full min-h-[500px] bg-gray-50 rounded-lg flex items-center justify-center border-2"
              :class="{
                'border-dashed': isLoading || error || !previewContent,
                'border-solid': previewContent && !isLoading && !error,
              }"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <!-- Loading -->
              <div v-if="isLoading" class="text-center">
                <Loader2 class="w-8 h-8 animate-spin mx-auto mb-4" :style="{ color: 'var(--primary-600)' }" />
                <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                  Cargando vista previa...
                </p>
              </div>

              <!-- Error -->
              <div v-else-if="error" class="text-center">
                <p class="text-lg mb-2" :style="{ color: 'var(--text-danger)' }">
                  Error al cargar vista previa
                </p>
                <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                  {{ error }}
                </p>
              </div>

              <!-- Preview Content -->
              <div v-else-if="previewContent" class="w-full h-full overflow-auto">
                <!-- Image Preview -->
                <img
                  v-if="previewContent.type === 'image'"
                  :src="previewContent.content as string"
                  :alt="document?.name"
                  class="max-w-full h-auto mx-auto"
                />

                <!-- HTML Preview -->
                <div
                  v-else-if="previewContent.type === 'html'"
                  class="bg-white p-8 max-w-4xl mx-auto"
                  v-html="previewContent.content as string"
                />

                <!-- Canvas Preview (PDF) -->
                <div
                  v-else-if="previewContent.type === 'canvas'"
                  class="flex justify-center items-center p-4"
                  ref="canvasContainer"
                />
              </div>

              <!-- No Preview Available -->
              <div v-else class="text-center">
                <p class="text-lg mb-2" :style="{ color: 'var(--text-muted)' }">
                  Vista previa no disponible
                </p>
                <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                  El documento se abrirá en una nueva ventana al descargar
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between p-6 border-t"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <div class="flex items-center gap-4 text-sm">
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Propietario
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ document?.owner || "N/A" }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Modificado
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ document ? formatDate(document.dateModified) : "N/A" }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs mb-1"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  Tamaño
                </p>
                <p :style="{ color: 'var(--text-primary)' }">
                  {{ formatSize(document?.size) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

