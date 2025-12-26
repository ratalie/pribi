<template>
  <div
    v-if="showThumbnail"
    ref="previewContainer"
    class="relative flex items-center justify-center h-[200px] overflow-hidden rounded-xl border bg-gray-50"
    :style="{ borderColor: 'var(--border-light)' }"
    style="transform: none; will-change: auto;"
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
        class="w-full h-full object-contain rounded-lg shadow-sm"
        style="max-width: 100%; max-height: 100%; object-fit: contain;"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>

    <!-- Card genérico para archivos no soportados (sin request al backend) -->
    <div
      v-else-if="isUnsupportedFile"
      class="flex flex-col items-center justify-center gap-3 text-center p-4 w-full h-full"
    >
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
        :style="{ backgroundColor: getFileColor(fileName) + '20' }"
      >
        <Icon
          :icon="getFileIcon(fileName)"
          width="32"
          height="32"
          :style="{ color: getFileColor(fileName) }"
        />
      </div>
      <div class="text-xs font-medium" :style="{ color: getFileColor(fileName) }">
        {{ getFileExtension(fileName).toUpperCase() }}
      </div>
    </div>

    <!-- Error state or no preview (solo para archivos que SÍ soportan preview pero falló) -->
    <div v-else class="flex flex-col items-center gap-2 text-center p-4">
      <FileText class="w-8 h-8" :style="{ color: 'var(--text-muted)' }" />
      <span class="text-sm" :style="{ color: 'var(--text-muted)' }">
        {{ hasError ? "Error al cargar vista previa" : "Sin vista previa" }}
      </span>
    </div>

    <!-- NO mostrar botón - la generación es automática -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
  import { Loader2, FileText } from "lucide-vue-next";
  import { Icon } from "@iconify/vue";
  import { PreviewCacheService } from "~/core/hexag/repositorio/infrastructure/services/preview-cache.service";
  import {
    ThumbnailService,
    type ThumbnailOptions,
  } from "~/core/hexag/repositorio/infrastructure/services/thumbnail.service";
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

  /**
   * Detecta si un archivo definitivamente NO soporta preview
   * Estos archivos NO deben hacer requests al backend
   */
  const isUnsupportedFile = computed(() => {
    const fileType =
      props.mimeType ||
      (props.file && "type" in props.file ? props.file.type : "application/octet-stream");
    const fileName = props.fileName.toLowerCase();
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    // Extensiones que definitivamente NO soportan preview
    const unsupportedExtensions = [
      "txt",
      "yml",
      "yaml",
      "json",
      "xml",
      "csv",
      "zip",
      "rar",
      "7z",
      "tar",
      "gz",
      "bz2",
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "scss",
      "sass",
      "less",
      "md",
      "sh",
      "bat",
      "ps1",
      "sh",
      "bash",
      "zsh",
      "fish",
      "log",
      "env",
      "gitignore",
      "dockerfile",
      "makefile",
      "ini",
      "conf",
      "config",
      "lock",
      "package",
      "yarn",
      "pnpm",
    ];

    // MIME types que definitivamente NO soportan preview
    const unsupportedMimeTypes = [
      "text/",
      "application/json",
      "application/xml",
      "application/zip",
      "application/x-tar",
      "application/x-gzip",
      "application/x-bzip2",
      "application/x-7z-compressed",
      "application/x-rar-compressed",
      "application/javascript",
      "application/typescript",
      "application/x-sh",
      "application/x-shellscript",
    ];

    // Si la extensión está en la lista de no soportados
    if (unsupportedExtensions.includes(extension)) {
      return true;
    }

    // Si el MIME type está en la lista de no soportados
    if (unsupportedMimeTypes.some((mime) => fileType.includes(mime))) {
      return true;
    }

    return false;
  });

  const canGenerateThumbnail = computed(() => {
    // Si es un archivo no soportado, no puede generar thumbnail
    if (isUnsupportedFile.value) return false;

    const fileType =
      props.mimeType ||
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
   * Si no existe, genera automáticamente (igual que V2.5)
   * 
   * IMPORTANTE: NO hace requests al backend para archivos no soportados
   */
  const loadPreviewFromServer = async () => {
    console.log("🔵 [FileThumbnail] loadPreviewFromServer iniciado:", {
      nodeCode: props.nodeCode,
      versionCode: props.versionCode,
      canGenerate: canGenerateThumbnail.value,
      isUnsupported: isUnsupportedFile.value,
      fileName: props.fileName,
    });

    // ✅ NUEVO: Si el archivo no soporta preview, NO hacer request al backend
    if (isUnsupportedFile.value) {
      console.log("🟡 [FileThumbnail] Archivo no soportado, mostrando card genérico sin request al backend");
      hasError.value = false; // No es un error, es un archivo no soportado
      isLoading.value = false;
      return; // Salir sin hacer requests
    }

    if (!props.nodeCode) {
      console.log("🔵 [FileThumbnail] No hay nodeCode, intentando generar sin cache");
      // Si no hay nodeCode, intentar generar sin cache
      if (canGenerateThumbnail.value && props.versionCode) {
        await generateThumbnail(false); // No estamos en proceso de carga, verificar isLoading
      }
      return;
    }

    try {
      isLoading.value = true;
      isLoadingMessage.value = "Verificando vista previa...";
      hasError.value = false;

      console.log(
        "🔵 [FileThumbnail] Verificando si existe preview en servidor para nodeCode:",
        props.nodeCode
      );

      // Verificar si existe preview
      const exists = await PreviewCacheService.hasPreview(props.nodeCode);

      console.log("🔵 [FileThumbnail] Resultado de verificación:", {
        exists,
        nodeCode: props.nodeCode,
      });

      if (exists) {
        isLoadingMessage.value = "Descargando vista previa...";
        console.log("🟢 [FileThumbnail] Preview existe, descargando...");
        // Descargar preview
        const previewDataUrl = await PreviewCacheService.downloadPreview(props.nodeCode);

        if (previewDataUrl) {
          localThumbnail.value = previewDataUrl;
          console.log("🟢 [FileThumbnail] Preview cargado desde servidor exitosamente");
          return; // ✅ Preview cargado exitosamente
        } else {
          console.warn("⚠️ [FileThumbnail] Preview existe pero no se pudo descargar");
        }
      } else {
        console.log(
          "🔵 [FileThumbnail] No existe preview en servidor, generando automáticamente...",
          {
            canGenerate: canGenerateThumbnail.value,
            hasVersionCode: !!props.versionCode,
          }
        );
      }

      // ❌ NUEVO (igual que V2.5): Si no existe, generar automáticamente
      if (canGenerateThumbnail.value && props.versionCode) {
        isLoadingMessage.value = "Generando vista previa...";
        console.log("🟡 [FileThumbnail] Iniciando generación automática de preview...");
        // Pasar skipLoadingCheck=true porque ya estamos en proceso de carga
        await generateThumbnail(true); // Generar y subir automáticamente
      } else {
        if (!canGenerateThumbnail.value) {
          console.warn(
            "⚠️ [FileThumbnail] No se puede generar preview - archivo no soportado"
          );
        }
        if (!props.versionCode) {
          console.warn("⚠️ [FileThumbnail] No se puede generar preview sin versionCode");
        }
        hasError.value = true;
      }
    } catch (error) {
      console.error("🔴 [FileThumbnail] Error al cargar preview desde servidor:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        nodeCode: props.nodeCode,
        versionCode: props.versionCode,
      });

      // Si falla la carga, intentar generar como fallback
      if (canGenerateThumbnail.value && props.versionCode) {
        console.log("🟡 [FileThumbnail] Intentando generar preview como fallback...");
        try {
          // Pasar skipLoadingCheck=true porque ya estamos en proceso de carga
          await generateThumbnail(true);
        } catch (genError) {
          console.error("🔴 [FileThumbnail] Error al generar preview:", {
            error: genError,
            message: genError instanceof Error ? genError.message : String(genError),
            stack: genError instanceof Error ? genError.stack : undefined,
          });
          hasError.value = true;
        }
      } else {
        hasError.value = true;
      }
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Genera un thumbnail y lo sube al servidor
   * @param skipLoadingCheck Si es true, no verifica isLoading (útil cuando ya estamos en proceso de carga)
   */
  const generateThumbnail = async (skipLoadingCheck = false) => {
    if (!canGenerateThumbnail.value) return;
    // Solo verificar isLoading si no estamos en proceso de carga desde loadPreviewFromServer
    if (!skipLoadingCheck && isLoading.value) return;

    try {
      // Solo establecer isLoading si no está ya en true (cuando se llama desde loadPreviewFromServer)
      const wasAlreadyLoading = isLoading.value;
      if (!wasAlreadyLoading) {
        isLoading.value = true;
      }
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
      // Solo resetear isLoading si lo establecimos nosotros (no si ya estaba en true desde loadPreviewFromServer)
      // Si skipLoadingCheck es true, significa que loadPreviewFromServer maneja el estado de isLoading
      if (!skipLoadingCheck) {
        isLoading.value = false;
      }
    }
  };

  const handleImageError = () => {
    hasError.value = true;
    localThumbnail.value = null;
  };

  const handleImageLoad = () => {
    hasError.value = false;
  };

  /**
   * Obtener icono según extensión del archivo (para archivos no soportados)
   */
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const iconMap: Record<string, string> = {
      txt: "heroicons:document-text",
      yml: "vscode-icons:file-type-yaml",
      yaml: "vscode-icons:file-type-yaml",
      json: "vscode-icons:file-type-json",
      xml: "vscode-icons:file-type-xml",
      csv: "vscode-icons:file-type-csv",
      zip: "heroicons:archive-box",
      rar: "heroicons:archive-box",
      "7z": "heroicons:archive-box",
      tar: "heroicons:archive-box",
      gz: "heroicons:archive-box",
      js: "vscode-icons:file-type-js",
      ts: "vscode-icons:file-type-typescript",
      html: "vscode-icons:file-type-html",
      css: "vscode-icons:file-type-css",
      md: "vscode-icons:file-type-markdown",
      sh: "vscode-icons:file-type-shell",
      bat: "vscode-icons:file-type-bat",
      ps1: "vscode-icons:file-type-powershell",
    };
    return iconMap[extension] || "heroicons:document";
  };

  /**
   * Obtener color según extensión del archivo (para archivos no soportados)
   */
  const getFileColor = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const colorMap: Record<string, string> = {
      txt: "#6B7280",
      yml: "#F59E0B",
      yaml: "#F59E0B",
      json: "#10B981",
      xml: "#3B82F6",
      csv: "#8B5CF6",
      zip: "#EF4444",
      js: "#FCD34D",
      ts: "#3B82F6",
      html: "#F97316",
      css: "#3B82F6",
      md: "#6B7280",
    };
    return colorMap[extension] || "#6B7280";
  };

  /**
   * Obtener extensión del archivo
   */
  const getFileExtension = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "file";
  };

  // Variable para almacenar el observer y poder limpiarlo
  let observerInstance: IntersectionObserver | null = null;

  // Cargar preview desde servidor al montar si tenemos nodeCode
  onMounted(() => {
    if (!props.showThumbnail || !props.nodeCode) {
      return;
    }

    // ✅ NUEVO: Si el archivo no soporta preview, NO intentar cargar nada
    if (isUnsupportedFile.value) {
      console.log("🟡 [FileThumbnail] Archivo no soportado, no se intentará cargar preview");
      return;
    }

    // Si ya hay thumbnail, no hacer nada
    if (thumbnail.value) {
      return;
    }

    // Usar nextTick para asegurar que el DOM esté listo
    nextTick(() => {
      if (!previewContainer.value) {
        // Si el contenedor no está disponible, intentar cargar directamente
        // Esto puede pasar si el componente se renderiza fuera del viewport
        if (props.nodeCode && props.versionCode) {
          loadPreviewFromServer();
        }
        return;
      }

      // Usar Intersection Observer para lazy loading
      observerInstance = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLoading.value && !thumbnail.value) {
              loadPreviewFromServer();
              if (observerInstance) {
                observerInstance.disconnect(); // Solo cargar una vez
                observerInstance = null;
              }
            }
          });
        },
        {
          rootMargin: "100px", // Cargar cuando esté a 100px de ser visible (más agresivo)
          threshold: 0.01, // Cualquier parte visible
        }
      );

      // Observar el elemento del thumbnail
      observerInstance.observe(previewContainer.value);

      // Fallback: Si después de 500ms el observer no se activó y no hay thumbnail,
      // cargar directamente (por si el elemento ya está visible)
      setTimeout(() => {
        if (!thumbnail.value && !isLoading.value && previewContainer.value) {
          const rect = previewContainer.value.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
          if (isVisible) {
            loadPreviewFromServer();
            if (observerInstance) {
              observerInstance.disconnect();
              observerInstance = null;
            }
          }
        }
      }, 500);
    });
  });

  // Cleanup al desmontar (fuera de nextTick para evitar warnings)
  onUnmounted(() => {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  });

  // Recargar preview si cambia nodeCode
  watch(
    () => props.nodeCode,
    (newNodeCode) => {
      // ✅ NUEVO: No recargar si el archivo no soporta preview
      if (newNodeCode && props.showThumbnail && !thumbnail.value && !isUnsupportedFile.value) {
        loadPreviewFromServer();
      }
    }
  );
</script>
