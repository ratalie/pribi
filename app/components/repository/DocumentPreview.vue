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
      <div v-else-if="isExcel" class="w-full h-full overflow-hidden" ref="excelViewer">
        <div class="flex flex-col items-center justify-center h-full p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">📊</div>
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Archivo Excel</h2>
            <p class="text-gray-500 mb-6">{{ fileName }}</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p class="text-blue-800 text-sm">Cargando visor de Excel...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- PowerPoint Viewer -->
      <div v-else-if="isPptx" class="w-full h-full overflow-hidden" ref="pptxViewer">
        <div class="flex flex-col items-center justify-center h-full p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">📊</div>
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Presentación PowerPoint</h2>
            <p class="text-gray-500 mb-6">{{ fileName }}</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p class="text-blue-800 text-sm">
                La visualización completa de PowerPoint requiere una licencia premium.
                <br />
                <a href="#" class="text-blue-600 underline hover:text-blue-800">
                  Contactar para obtener acceso completo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Unsupported Files -->
      <div
        v-else-if="isUnsupported"
        class="w-full h-full flex items-center justify-center p-8"
      >
        <div class="text-center">
          <Icon
            icon="heroicons:document-text"
            width="64"
            height="64"
            class="mx-auto mb-4 text-gray-400"
          />
          <h2 class="text-xl font-bold text-gray-700 mb-2">Tipo de archivo no soportado</h2>
          <p class="text-gray-500 mb-4">{{ fileName }}</p>
          <p class="text-sm text-gray-400">
            Este tipo de archivo no se puede previsualizar. Por favor, descárgalo para verlo.
          </p>
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
    if (
      props.isLoading ||
      props.error ||
      props.isPdf ||
      props.isOffice ||
      props.isExcel ||
      props.isPptx
    ) {
      return false;
    }
    return true;
  });

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

