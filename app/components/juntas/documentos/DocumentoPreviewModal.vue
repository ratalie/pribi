<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="close"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ documento?.nombre || "Previsualización" }}</h2>
          <p class="text-sm text-gray-500 mt-1">Vista previa del documento</p>
        </div>
        <button
          @click="close"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <Icon name="lucide:x" class="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center p-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p class="text-sm text-gray-600">Cargando previsualización...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="flex-1 flex items-center justify-center p-12">
        <div class="text-center">
          <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="font-semibold text-red-600 mb-2">Error al cargar previsualización</p>
          <p class="text-sm text-gray-600">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Preview Content -->
      <div
        v-else
        ref="previewContainer"
        class="flex-1 overflow-auto p-6 bg-gray-50 preview-container"
      ></div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
        <button
          @click="close"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="handleDownload"
          class="px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors flex items-center gap-2"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          Descargar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { DocxPreviewProcessor } from "~/core/hexag/documentos/infrastructure/processors/docx-preview-processor";

interface Props {
  isOpen: boolean;
  documento: Documento | null;
}

interface Emits {
  (e: "close"): void;
  (e: "download", documento: Documento): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const previewContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref<string | null>(null);

const close = () => {
  emit("close");
};

const handleDownload = () => {
  if (props.documento) {
    emit("download", props.documento);
  }
};

// Renderizar preview cuando se abre el modal y hay documento
watch(
  [() => props.isOpen, () => props.documento],
  async ([isOpen, documento]) => {
    console.log("👀 [DocumentoPreviewModal] Watch ejecutado", {
      isOpen,
      hasDocumento: !!documento,
      documentoNombre: documento?.nombre,
      hasContainer: !!previewContainer.value,
    });

    if (isOpen && documento) {
      // Esperar a que el DOM se actualice para que el contenedor esté disponible
      await nextTick();
      
      // Esperar un poco más para asegurar que el modal esté completamente renderizado
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!previewContainer.value) {
        console.error("❌ [DocumentoPreviewModal] El contenedor aún no está disponible después de nextTick");
        hasError.value = true;
        errorMessage.value = "El contenedor de preview no está disponible";
        return;
      }

      isLoading.value = true;
      hasError.value = false;
      errorMessage.value = null;

      console.log("🔍 [DocumentoPreviewModal] Iniciando preview...", {
        isOpen,
        hasDocumento: !!documento,
        documentoNombre: documento.nombre,
        blobSize: documento.blob.size,
        blobType: documento.blob.type,
        hasContainer: !!previewContainer.value,
        containerTag: previewContainer.value.tagName,
      });

      try {
        // Verificar que el blob sea válido
        if (!documento.blob || documento.blob.size === 0) {
          throw new Error("El documento no tiene contenido (blob vacío)");
        }

        console.log("📄 [DocumentoPreviewModal] Renderizando documento...");
        console.log("📋 [DocumentoPreviewModal] Estado ANTES del renderizado:", {
          containerExists: !!previewContainer.value,
          containerInnerHTML: previewContainer.value?.innerHTML || "N/A",
          containerChildren: previewContainer.value?.children.length || 0,
        });
        
        // Guardar referencia al contenedor antes de renderizar
        const container = previewContainer.value;
        if (!container) {
          throw new Error("El contenedor de preview no está disponible");
        }

        // Renderizar el documento
        await DocxPreviewProcessor.render(documento.blob, container);
        
        // Esperar un tick para que Vue actualice el DOM
        await nextTick();
        
        // Usar la referencia guardada (container) en lugar del ref reactivo
        // porque Vue puede haber re-renderizado y el ref puede haberse perdido temporalmente
        const renderedContainer = previewContainer.value || container;
        
        // Logs detallados DESPUÉS del renderizado
        console.log("✅ [DocumentoPreviewModal] Preview renderizado exitosamente");
        console.log("📋 [DocumentoPreviewModal] Estado DESPUÉS del renderizado:", {
          usandoRefOriginal: !!previewContainer.value,
          usandoContainerGuardado: !previewContainer.value && !!container,
          containerInnerHTML: renderedContainer.innerHTML.substring(0, 500),
          containerInnerHTMLLength: renderedContainer.innerHTML.length,
          containerChildren: renderedContainer.children.length,
          containerTextContent: renderedContainer.textContent?.substring(0, 300) || "N/A",
          containerTextContentLength: renderedContainer.textContent?.length || 0,
          containerVisible: renderedContainer.offsetWidth > 0 && renderedContainer.offsetHeight > 0,
          containerStyles: {
            display: window.getComputedStyle(renderedContainer).display,
            visibility: window.getComputedStyle(renderedContainer).visibility,
            opacity: window.getComputedStyle(renderedContainer).opacity,
            width: renderedContainer.offsetWidth,
            height: renderedContainer.offsetHeight,
          },
        });
        
        // Verificar que se haya renderizado algo
        if (renderedContainer.innerHTML.trim() === "") {
          console.error("❌ [DocumentoPreviewModal] ERROR: El contenedor está vacío después de renderizar");
          console.error("❌ [DocumentoPreviewModal] innerHTML completo:", renderedContainer.innerHTML);
          console.error("❌ [DocumentoPreviewModal] textContent completo:", renderedContainer.textContent);
          hasError.value = true;
          errorMessage.value = "El documento se procesó pero no se pudo mostrar el contenido";
        } else {
          console.log("✅ [DocumentoPreviewModal] Contenido detectado en el contenedor");
          console.log("📊 [DocumentoPreviewModal] Resumen del contenido renderizado:", {
            tieneHTML: renderedContainer.innerHTML.length > 0,
            tieneTexto: (renderedContainer.textContent || "").length > 0,
            numeroElementos: renderedContainer.children.length,
            primerElemento: renderedContainer.firstElementChild?.tagName || "N/A",
          });
          
          // Verificar que el contenido sea visible
          const hasVisibleContent = renderedContainer.children.length > 0 && 
                                   (renderedContainer.textContent || "").trim().length > 0;
          
          if (!hasVisibleContent) {
            console.warn("⚠️ [DocumentoPreviewModal] El contenido está renderizado pero puede no ser visible");
            console.warn("⚠️ [DocumentoPreviewModal] Verifica los estilos CSS del contenedor");
          }
        }
      } catch (error: any) {
        console.error("❌ [DocumentoPreviewModal] Error al renderizar preview:", error);
        console.error("❌ [DocumentoPreviewModal] Stack:", error.stack);
        hasError.value = true;
        errorMessage.value = error.message || "Error desconocido al previsualizar el documento";
      } finally {
        isLoading.value = false;
      }
    } else if (!isOpen && previewContainer.value) {
      // Limpiar cuando se cierra
      previewContainer.value.innerHTML = "";
    }
  },
  { immediate: true }
);

// Limpiar cuando se cierra (ya está manejado en el watch principal)

// Cerrar con ESC
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) {
      close();
    }
  };
  window.addEventListener("keydown", handleEsc);
  onUnmounted(() => {
    window.removeEventListener("keydown", handleEsc);
  });
});
</script>

<style scoped>
/* Asegurar que el contenedor sea visible */
.preview-container {
  min-height: 400px;
  background: #f9fafb;
  overflow: auto;
  position: relative;
}

/* Estilos para docx-preview */
:deep(.docx-preview-wrapper) {
  background: transparent !important;
  padding: 0 !important;
  display: block !important;
  width: 100% !important;
}

:deep(section.docx-preview) {
  background: white !important;
  padding: 2rem !important;
  max-width: 100% !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  margin: 0 auto !important;
  width: 100% !important;
}

:deep(section.docx-preview article) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: #000 !important;
  width: 100% !important;
}

:deep(section.docx-preview article p) {
  color: #000 !important;
  visibility: visible !important;
  opacity: 1 !important;
}

:deep(section.docx-preview article span) {
  color: #000 !important;
  visibility: visible !important;
  opacity: 1 !important;
}

:deep(.docx-preview) {
  background: white;
  padding: 2rem;
  max-width: 100%;
  box-shadow: none !important;
  color: #000 !important;
}

:deep(.docx-preview-container) {
  font-family: "Times New Roman", serif;
}

/* Asegurar que el contenido sea visible */
.preview-container :deep(*) {
  visibility: visible !important;
  opacity: 1 !important;
}

/* Forzar visibilidad del contenido del documento */
.preview-container :deep(section.docx-preview) {
  display: flex !important;
  flex-direction: column !important;
}

.preview-container :deep(section.docx-preview article) {
  display: block !important;
  position: relative !important;
  z-index: 1 !important;
}
</style>

