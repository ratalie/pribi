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

      <!-- PDF Viewer -->
      <div v-else-if="isPdf" class="w-full min-h-full overflow-auto" ref="pdfViewer"></div>

      <!-- Office Viewer -->
      <div
        v-else-if="isOffice"
        class="w-full min-h-full overflow-auto"
        ref="officeViewer"
      ></div>

      <!-- Excel Viewer -->
      <div v-else-if="isExcel" class="w-full min-h-full overflow-auto" ref="excelViewer"></div>

      <!-- PowerPoint Viewer -->
      <div v-else-if="isPptx" class="w-full min-h-full overflow-auto" ref="pptxViewer"></div>

      <!-- Unsupported Files -->
      <div
        v-else-if="isUnsupported"
        class="w-full h-full flex items-center justify-center p-8 bg-gray-50"
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
              <strong>Extensión:</strong> .{{ fileName.split(".").pop()?.toUpperCase() || "N/A" }}
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

  // Detectar si es un archivo no soportado
  const isUnsupported = computed(() => {
    // Si está cargando, no mostrar como no soportado todavía
    if (props.isLoading) {
      return false;
    }
    
    // Si es un tipo soportado, no es no soportado
    if (props.isPdf || props.isOffice || props.isExcel || props.isPptx) {
      return false;
    }
    
    // Si hay un error real (no de archivo no soportado), mostrar error
    if (props.error && !props.error.includes("no soportado")) {
      return false; // Mostrar el error en lugar del mensaje de no soportado
    }
    
    // Si no es ninguno de los tipos soportados y no hay error real, es no soportado
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

  // Exponer referencias para el componente padre
  defineExpose({
    previewContainer,
    pdfViewer,
    officeViewer,
    excelViewer,
    pptxViewer,
  });

  // Emitir evento cuando se monte el componente
  onMounted(async () => {
    // Esperar a que el DOM se renderice completamente
    await nextTick();

    // Emitir referencia del contenedor de preview (donde está el scroll)
    emit("previewContainerMounted", previewContainer.value || null);

    // Emitir referencia del PDF viewer
    emit("mounted", pdfViewer.value || null);

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
      if (newIsPdf) {
        await nextTick();
        emit("mounted", pdfViewer.value || null);
      }
    }
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
        await nextTick();
        if (excelViewer.value) {
          emit("excelMounted", excelViewer.value);
        }
      }
    }
  );

  // Emitir evento cuando cambie el tipo de archivo a PowerPoint
  watch(
    () => props.isPptx,
    async (newIsPptx) => {
      if (newIsPptx) {
        await nextTick();
        if (pptxViewer.value) {
          emit("pptxMounted", pptxViewer.value);
        }
      }
    }
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

