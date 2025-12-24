<template>
  <div
    v-if="showThumbnail"
    ref="previewContainer"
    class="relative flex items-center justify-center h-[200px] overflow-hidden rounded-xl border bg-gray-50"
    :style="{ borderColor: 'var(--border-light)' }"
  >
    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center gap-2">
      <Loader2 class="w-6 h-6 animate-spin" :style="{ color: 'var(--primary-600)' }" />
      <span class="text-xs" :style="{ color: 'var(--text-muted)' }">
        {{ isLoadingMessage }}
      </span>
    </div>

    <!-- Thumbnail image -->
    <div
      v-else-if="thumbnail && !hasError"
      class="w-full h-full flex items-center justify-center px-6"
    >
      <img
        :src="thumbnail"
        :alt="`Miniatura de ${fileName}`"
        class="w-full h-full object-cover rounded-lg shadow-sm"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>

    <!-- Error state or no preview -->
    <div v-else class="flex flex-col items-center gap-2 text-center p-4">
      <FileText class="w-8 h-8" :style="{ color: 'var(--text-muted)' }" />
      <span class="text-sm" :style="{ color: 'var(--text-muted)' }">
        {{ hasError ? "Error al cargar vista previa" : "Sin vista previa" }}
      </span>
    </div>

    <!-- Generate thumbnail button for supported files -->
    <button
      v-if="!thumbnail && !isLoading && canGenerateThumbnail && !hasError"
      @click="generateThumbnail"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 z-10 rounded-xl"
    >
      <div class="flex flex-col items-center gap-2">
        <Image class="w-6 h-6" :style="{ color: 'var(--primary-600)' }" />
        <span class="text-sm font-medium" :style="{ color: 'var(--primary-600)' }">
          Generar vista previa
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Loader2, FileText, Image } from "lucide-vue-next";
import { PreviewCacheService } from "~/core/hexag/repositorio/infrastructure/services/preview-cache.service";
import { ThumbnailService, type ThumbnailOptions } from "~/core/hexag/repositorio/infrastructure/services/thumbnail.service";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

interface Props {
  file?: File | Blob | { name: string; type: string; size?: number };
  fileName: string;
  fileId?: string;
  thumbnail?: string;
  options?: ThumbnailOptions;
  showThumbnail?: boolean;
  nodeCode?: string; // UUID del nodo para usar cache del servidor
  versionCode?: string; // UUID de la versión del documento (para descargar archivo)
  mimeType?: string; // MIME type del archivo
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    width: 200,
    height: 280,
    quality: 0.8,
  }),
  showThumbnail: true,
});

const emit = defineEmits<{
  (e: "thumbnail-generated", thumbnail: string): void;
  (e: "thumbnail-error", error: Error): void;
}>();

const isLoading = ref(false);
const isLoadingMessage = ref("Cargando vista previa...");
const hasError = ref(false);
const localThumbnail = ref<string | null>(props.thumbnail || null);
const previewContainer = ref<HTMLElement | null>(null);
const repository = new RepositorioDocumentosHttpRepository();

const thumbnail = computed(() => localThumbnail.value || props.thumbnail);

const canGenerateThumbnail = computed(() => {
  const fileType = props.mimeType || 
    (props.file && "type" in props.file ? props.file.type : "application/octet-stream");
  const fileName = props.fileName;

  // PDFs
  if (fileType === "application/pdf") return true;

  // Imágenes
  if (fileType.startsWith("image/")) return true;

  // Archivos de Office
  const officeExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  if (officeExtensions.includes(extension)) return true;

  // MIME types de Office
  const officeMimeTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  return officeMimeTypes.some((mime) => fileType.includes(mime));
});

/**
 * Verifica si existe preview en el servidor y lo carga
 */
const loadPreviewFromServer = async () => {
  if (!props.nodeCode) return;

  try {
    isLoading.value = true;
    isLoadingMessage.value = "Verificando vista previa...";
    hasError.value = false;

    // Verificar si existe preview
    const exists = await PreviewCacheService.hasPreview(props.nodeCode);

    if (exists) {
      isLoadingMessage.value = "Descargando vista previa...";
      // Descargar preview
      const previewDataUrl = await PreviewCacheService.downloadPreview(props.nodeCode);

      if (previewDataUrl) {
        localThumbnail.value = previewDataUrl;
        console.log("🟢 [FileThumbnail] Preview cargado desde servidor");
      } else {
        console.warn("⚠️ [FileThumbnail] Preview existe pero no se pudo descargar");
      }
    } else {
      console.log("🔵 [FileThumbnail] No existe preview en servidor");
    }
  } catch (error) {
    console.error("🔴 [FileThumbnail] Error al cargar preview desde servidor:", error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

/**
 * Genera un thumbnail y lo sube al servidor
 */
const generateThumbnail = async () => {
  if (!canGenerateThumbnail.value || isLoading.value) return;

  try {
    isLoading.value = true;
    isLoadingMessage.value = "Generando vista previa...";
    hasError.value = false;

    let fileToProcess: File | Blob;

    // Si tenemos versionCode, descargar el archivo desde el servidor
    if (props.versionCode) {
      try {
        isLoadingMessage.value = "Descargando archivo...";
        const fileBlob = await repository.descargarVersion(props.versionCode);
        const mimeType = props.mimeType || "application/octet-stream";
        fileToProcess = new File([fileBlob], props.fileName, { type: mimeType });
      } catch (downloadError: any) {
        console.error("🔴 [FileThumbnail] Error al descargar archivo:", downloadError);
        hasError.value = true;
        emit("thumbnail-error", downloadError as Error);
        return;
      }
    } else if (props.file instanceof File || props.file instanceof Blob) {
      // Es un archivo local
      fileToProcess = props.file;
    } else {
      // No podemos generar thumbnail sin el archivo
      console.warn("⚠️ [FileThumbnail] No se puede generar thumbnail sin archivo");
      hasError.value = true;
      return;
    }

    isLoadingMessage.value = "Procesando imagen...";

    // Generar thumbnail
    let generatedThumbnail: string | null = null;

    // Si tenemos nodeCode, usar el método con cache (genera y sube automáticamente)
    if (props.nodeCode) {
      generatedThumbnail = await ThumbnailService.generateThumbnailWithCache(
        fileToProcess,
        props.nodeCode,
        props.options
      );
    } else {
      // Generar sin cache
      generatedThumbnail = await ThumbnailService.generateThumbnail(
        fileToProcess,
        props.options
      );
    }

    if (generatedThumbnail) {
      localThumbnail.value = generatedThumbnail;
      emit("thumbnail-generated", generatedThumbnail);
      console.log("🟢 [FileThumbnail] Thumbnail generado exitosamente");
    } else {
      hasError.value = true;
      console.warn("⚠️ [FileThumbnail] No se pudo generar thumbnail");
    }
  } catch (error: any) {
    console.error("🔴 [FileThumbnail] Error generando thumbnail:", error);
    hasError.value = true;
    emit("thumbnail-error", error as Error);
  } finally {
    isLoading.value = false;
  }
};

const handleImageError = () => {
  hasError.value = true;
  localThumbnail.value = null;
};

const handleImageLoad = () => {
  hasError.value = false;
};

// Cargar preview desde servidor al montar si tenemos nodeCode
onMounted(() => {
  if (props.showThumbnail && props.nodeCode && !thumbnail.value && !isLoading.value) {
    // Usar Intersection Observer para lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading.value && !thumbnail.value) {
            loadPreviewFromServer();
            observer.disconnect(); // Solo cargar una vez
          }
        });
      },
      {
        rootMargin: "50px", // Cargar cuando esté a 50px de ser visible
        threshold: 0.1,
      }
    );

    // Observar el elemento del thumbnail
    if (previewContainer.value) {
      observer.observe(previewContainer.value);
    }

    // Cleanup al desmontar
    onUnmounted(() => {
      observer.disconnect();
    });
  }
});

// Recargar preview si cambia nodeCode
watch(
  () => props.nodeCode,
  (newNodeCode) => {
    if (newNodeCode && props.showThumbnail && !thumbnail.value) {
      loadPreviewFromServer();
    }
  }
);
</script>


