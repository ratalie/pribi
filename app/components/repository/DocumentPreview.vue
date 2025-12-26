<template>
  <div class="flex-1 overflow-auto bg-layout-gray-750" ref="previewContainer">
    <!-- Document Container -->
    <div
      class="h-full w-full mx-auto"
      :class="[
        { 'flex flex-col items-center justify-center': isLoading || error },
        { 'max-w-6xl rounded-lg shadow-sm my-4': !isPptx },
        { 'max-w-full px-2 h-full': isPptx },
      ]"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
        <Icon
          icon="eos-icons:loading"
          width="48"
          height="48"
          class="animate-spin text-white"
        />
        <p class="text-white mt-4">Cargando documento...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center h-full">
        <Icon
          icon="heroicons:exclamation-triangle"
          width="48"
          height="48"
          class="text-red-500"
        />
        <p class="text-layout-gray-700 mt-4">{{ error }}</p>
      </div>

      <!-- PDF Viewer - Siempre montado para evitar desconexión del DOM -->
      <div
        v-show="isPdf"
        class="w-full min-h-full overflow-auto"
        ref="pdfViewer"
        :style="{ display: isPdf ? '' : 'none' }"
      ></div>

      <!-- Office Viewer -->
      <div
        v-show="isOffice"
        class="w-full min-h-full overflow-auto"
        ref="officeViewer"
        :style="{ display: isOffice ? '' : 'none' }"
      ></div>

      <!-- Excel Viewer -->
      <div
        v-show="isExcel"
        class="w-full min-h-full overflow-auto"
        ref="excelViewer"
        :style="{ display: isExcel ? '' : 'none' }"
      ></div>

      <!-- PowerPoint Viewer -->
      <div
        v-show="isPptx"
        class="w-full min-h-full overflow-auto"
        ref="pptxViewer"
        :style="{ display: isPptx ? '' : 'none' }"
      >
        <!-- Usar v-if con múltiples verificaciones para asegurar que todo esté listo -->
        <VueOfficePptx
          v-if="isPptx && pptxSource && pptxReady && pptxViewer && pptxViewer.isConnected"
          :src="pptxSource"
          style="width: 100%; height: 100%; border: none"
          @rendered="onPptxRendered"
          @error="onPptxError"
        />
        <div
          v-else-if="isPptx && (!pptxSource || !pptxReady) && !error"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center">
            <Icon
              icon="eos-icons:loading"
              width="48"
              height="48"
              class="animate-spin text-white mx-auto mb-4"
            />
            <p class="text-white">Cargando presentación...</p>
          </div>
        </div>
      </div>

      <!-- Unsupported Files -->
      <div
        v-show="isUnsupported"
        class="w-full h-full flex items-center justify-center p-8 bg-gray-50"
        :style="{ display: isUnsupported ? '' : 'none' }"
      >
        <div class="text-center max-w-md">
          <div
            class="mx-auto mb-6 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
            :style="{ backgroundColor: getFileColor(fileName) + '20' }"
          >
            <Icon
              :icon="getFileIcon(fileName)"
              width="48"
              height="48"
              class="mx-auto"
              :style="{ color: getFileColor(fileName) }"
            />
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ fileName }}</h2>
          <p class="text-sm text-gray-500 mb-6">
            Este tipo de archivo no se puede previsualizar en el navegador.
          </p>
          <div class="bg-white rounded-lg border p-4 shadow-sm">
            <p class="text-xs text-gray-600">
              <strong>Extensión:</strong>
              .{{ fileName.split(".").pop()?.toUpperCase() || "N/A" }}
            </p>
            <p class="text-xs text-gray-600 mt-2">
              Por favor, descarga el archivo para verlo con una aplicación compatible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import VueOfficePptx from "@vue-office/pptx";
  import { nextTick, onMounted, onUnmounted, ref, watch, computed } from "vue";

  interface Props {
    isPdf: boolean;
    isOffice: boolean;
    isPptx: boolean;
    isExcel: boolean;
    isLoading: boolean;
    error: string;
    fileName: string;
    fileType?: string;
    fileMimeType?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    fileType: "",
    fileMimeType: "",
  });

  const emit = defineEmits<{
    retry: [];
    mounted: [ref: HTMLElement | null];
    officeMounted: [ref: HTMLElement | null];
    excelMounted: [ref: HTMLElement | null];
    pptxMounted: [ref: HTMLElement | null];
    previewContainerMounted: [ref: HTMLElement | null];
    download: [];
  }>();

  const previewContainer = ref<HTMLElement>();
  const pdfViewer = ref<HTMLElement>();
  const officeViewer = ref<HTMLElement>();
  const excelViewer = ref<HTMLElement>();
  const pptxViewer = ref<HTMLElement>();

  // Variables para PowerPoint
  const pptxSource = ref<string | ArrayBuffer | null>(null);
  const pptxError = ref<string>("");
  const pptxReady = ref(false); // Flag para indicar que el contenedor está listo

  // Detectar si es un archivo no soportado
  const isUnsupported = computed(() => {
    // Si está cargando, no mostrar como no soportado todavía
    if (props.isLoading) {
      return false;
    }

    // Log para debug
    console.log("🔍 [DocumentPreview] isUnsupported evaluado:", {
      isPdf: props.isPdf,
      isOffice: props.isOffice,
      isExcel: props.isExcel,
      isPptx: props.isPptx,
      isLoading: props.isLoading,
      error: props.error,
      fileName: props.fileName,
      fileMimeType: props.fileMimeType,
    });

    // Si es un tipo soportado, no es no soportado
    if (props.isPdf || props.isOffice || props.isExcel || props.isPptx) {
      console.log("✅ [DocumentPreview] Archivo soportado detectado");
      return false;
    }

    // Si hay un error real (no de archivo no soportado), mostrar error
    if (props.error && !props.error.includes("no soportado")) {
      return false; // Mostrar el error en lugar del mensaje de no soportado
    }

    // Si no es ninguno de los tipos soportados y no hay error real, es no soportado
    console.log("❌ [DocumentPreview] Archivo NO soportado");
    return true;
  });

  // Obtener icono según extensión
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

  // Obtener color según extensión
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

  // Funciones para PowerPoint
  async function loadPptx(blob: Blob) {
    console.log("🔄 [DocumentPreview] loadPptx llamado:", {
      blobSize: blob.size,
      blobType: blob.type,
      pptxViewerExists: !!pptxViewer.value,
      pptxViewerIsConnected: pptxViewer.value?.isConnected,
    });

    // Limpiar URL anterior si existe
    if (pptxSource.value && typeof pptxSource.value === "string") {
      URL.revokeObjectURL(pptxSource.value);
    }
    pptxSource.value = null;
    pptxError.value = "";
    pptxReady.value = false; // Resetear flag de ready

    // Esperar múltiples ticks para que Vue termine de actualizar el DOM
    await nextTick();
    await nextTick();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verificar que el contenedor esté conectado y tenga dimensiones antes de crear la URL
    if (!pptxViewer.value || !pptxViewer.value.isConnected) {
      console.warn("⚠️ [DocumentPreview] pptxViewer no está conectado, esperando...");
      // Esperar hasta 2 segundos para que se conecte
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (pptxViewer.value && pptxViewer.value.isConnected) {
          console.log(
            `✅ [DocumentPreview] pptxViewer conectado después de ${i + 1} intentos`
          );
          break;
        }
      }

      if (!pptxViewer.value || !pptxViewer.value.isConnected) {
        console.error("❌ [DocumentPreview] pptxViewer no está conectado después de esperar");
        return;
      }
    }

    // Verificar que el contenedor tenga dimensiones
    if (pptxViewer.value.clientWidth === 0 || pptxViewer.value.clientHeight === 0) {
      console.warn("⚠️ [DocumentPreview] pptxViewer no tiene dimensiones, esperando...");
      // Esperar hasta 1 segundo para que tenga dimensiones
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (
          pptxViewer.value &&
          pptxViewer.value.clientWidth > 0 &&
          pptxViewer.value.clientHeight > 0
        ) {
          console.log(
            `✅ [DocumentPreview] pptxViewer tiene dimensiones después de ${i + 1} intentos`
          );
          break;
        }
      }
    }

    // Crear nueva URL para el blob
    const url = URL.createObjectURL(blob);

    // Esperar múltiples ticks y delays antes de asignar para asegurar que Vue esté completamente listo
    await nextTick();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Asignar la URL
    pptxSource.value = url;

    // Esperar un tick más antes de marcar como ready
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Marcar como ready solo si el contenedor sigue conectado
    if (pptxViewer.value && pptxViewer.value.isConnected) {
      pptxReady.value = true;
      console.log("✅ [DocumentPreview] PPTX URL creada y marcado como ready:", url);
    } else {
      console.error("❌ [DocumentPreview] Contenedor desconectado después de crear URL");
      pptxSource.value = null;
      URL.revokeObjectURL(url);
    }

    // Limpiar URL después de 5 minutos
    setTimeout(() => {
      if (pptxSource.value === url) {
        URL.revokeObjectURL(url);
        pptxSource.value = null;
        pptxReady.value = false;
      }
    }, 300000); // 5 minutos
  }

  function onPptxRendered() {
    console.log("✅ [DocumentPreview] PPTX renderizado exitosamente");
    pptxError.value = "";
    pptxReady.value = true; // Asegurar que está marcado como ready
  }

  function onPptxError(error: any) {
    console.error("❌ [DocumentPreview] Error renderizando PPTX:", error);
    pptxError.value = "Error al renderizar la presentación PowerPoint";
    pptxReady.value = false;
  }

  // Exponer referencias y funciones para el componente padre
  defineExpose({
    previewContainer,
    pdfViewer,
    officeViewer,
    excelViewer,
    pptxViewer,
    loadPptx,
  });

  // Emitir evento cuando se monte el componente
  onMounted(async () => {
    // Esperar a que el DOM se renderice completamente
    await nextTick();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Emitir referencia del contenedor de preview (donde está el scroll)
    emit("previewContainerMounted", previewContainer.value || null);

    // Emitir referencia del PDF viewer (siempre está montado ahora)
    if (pdfViewer.value) {
      // Asegurar que esté visible si es PDF
      if (props.isPdf) {
        pdfViewer.value.style.display = "";
      } else {
        pdfViewer.value.style.display = "none";
      }
      emit("mounted", pdfViewer.value);
    }

    // También emitir la referencia de Office si está disponible
    if (officeViewer.value) {
      emit("officeMounted", officeViewer.value);
    }

    // También emitir la referencia de Excel si está disponible
    if (excelViewer.value) {
      emit("excelMounted", excelViewer.value);
    }

    // También emitir la referencia de PowerPoint si está disponible
    if (pptxViewer.value) {
      emit("pptxMounted", pptxViewer.value);
    }
  });

  // Emitir evento cuando cambie el tipo de archivo
  watch(
    () => props.isPdf,
    async (newIsPdf) => {
      // Esperar múltiples ticks para asegurar que el DOM esté completamente actualizado
      await nextTick();
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (newIsPdf) {
        // Asegurar que el contenedor esté visible y conectado
        if (pdfViewer.value) {
          pdfViewer.value.style.display = "";
          // Verificar que esté conectado antes de emitir
          if (pdfViewer.value.isConnected) {
            emit("mounted", pdfViewer.value);
          } else {
            console.warn(
              "⚠️ [DocumentPreview] pdfViewer no está conectado al DOM, esperando..."
            );
            // Reintentar después de un delay
            setTimeout(() => {
              if (pdfViewer.value && pdfViewer.value.isConnected) {
                emit("mounted", pdfViewer.value);
              }
            }, 200);
          }
        }
      } else {
        // Ocultar el contenedor cuando no es PDF, pero mantenerlo montado
        if (pdfViewer.value) {
          pdfViewer.value.style.display = "none";
        }
      }
    },
    { immediate: true }
  );

  // Emitir evento cuando cambie el estado de carga
  watch(
    () => props.isLoading,
    async (newIsLoading, oldIsLoading) => {
      // Solo emitir cuando pasamos de loading a no loading Y no hay error
      if (oldIsLoading && !newIsLoading && !props.error) {
        await nextTick();
        if (props.isPdf) {
          emit("mounted", pdfViewer.value || null);
        } else if (props.isOffice) {
          emit("officeMounted", officeViewer.value || null);
        } else if (props.isExcel) {
          emit("excelMounted", excelViewer.value || null);
        } else if (props.isPptx) {
          emit("pptxMounted", pptxViewer.value || null);
        }
      }
    }
  );

  // Emitir evento cuando cambie el tipo de archivo a Office
  watch(
    () => props.isOffice,
    async (newIsOffice) => {
      if (newIsOffice) {
        await nextTick();
        if (officeViewer.value) {
          emit("officeMounted", officeViewer.value);
        }
      }
    }
  );

  // Emitir evento cuando cambie el tipo de archivo a Excel
  watch(
    () => props.isExcel,
    async (newIsExcel) => {
      if (newIsExcel) {
        // Esperar múltiples ticks para asegurar que el DOM esté completamente actualizado (similar a PDF)
        await nextTick();
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (excelViewer.value) {
          // Asegurar que el contenedor esté visible y conectado
          excelViewer.value.style.display = "";
          // Verificar que esté conectado antes de emitir
          if (excelViewer.value.isConnected) {
            emit("excelMounted", excelViewer.value);
          } else {
            console.warn(
              "⚠️ [DocumentPreview] excelViewer no está conectado al DOM, esperando..."
            );
            // Reintentar después de un delay
            setTimeout(() => {
              if (excelViewer.value && excelViewer.value.isConnected) {
                emit("excelMounted", excelViewer.value);
              }
            }, 200);
          }
        }
      } else {
        // Ocultar el contenedor cuando no es Excel, pero mantenerlo montado
        if (excelViewer.value) {
          excelViewer.value.style.display = "none";
        }
      }
    },
    { immediate: true }
  );

  // Emitir evento cuando cambie el tipo de archivo a PowerPoint
  watch(
    () => props.isPptx,
    async (newIsPptx) => {
      if (newIsPptx) {
        // Esperar múltiples ticks para asegurar que el DOM esté completamente actualizado (similar a PDF y Excel)
        await nextTick();
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (pptxViewer.value) {
          // Asegurar que el contenedor esté visible y conectado
          pptxViewer.value.style.display = "";
          // Verificar que esté conectado antes de emitir
          if (pptxViewer.value.isConnected) {
            emit("pptxMounted", pptxViewer.value);
          } else {
            console.warn(
              "⚠️ [DocumentPreview] pptxViewer no está conectado al DOM, esperando..."
            );
            // Reintentar después de un delay
            setTimeout(() => {
              if (pptxViewer.value && pptxViewer.value.isConnected) {
                emit("pptxMounted", pptxViewer.value);
              }
            }, 200);
          }
        }
      } else {
        // Ocultar el contenedor cuando no es PPTX, pero mantenerlo montado
        if (pptxViewer.value) {
          pptxViewer.value.style.display = "none";
        }
      }
    },
    { immediate: true }
  );

  // Cleanup al desmontar
  onUnmounted(() => {
    // Cleanup si es necesario
  });
</script>

<style scoped>
  /* Estilos personalizados para el scrollbar */
  .overflow-auto::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .overflow-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-auto::-webkit-scrollbar-thumb {
    background-color: #6b7280; /* gray-500 */
    border-radius: 4px;
  }

  .overflow-auto::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af; /* gray-400 para hover */
  }

  .overflow-auto::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Para Firefox */
  .overflow-auto {
    scrollbar-width: thin;
    scrollbar-color: #6b7280 transparent;
  }
</style>
