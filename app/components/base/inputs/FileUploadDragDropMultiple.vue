<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { useFileUploadMultiple } from "~/composables/useFileUploadMultiple";
  import { formatFileSize } from "~/utils/fileHelpers";

  interface Props {
    modelValue?: File[];
    title?: string;
    subtitle?: string;
    acceptedTypes?: string[];
    acceptExtensions?: string;
    clickMessage?: string;
    dragMessage?: string;
    maxSizeMB?: number;
    maxFiles?: number;
    formatDescription?: string;
    customIcon?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    title: undefined,
    subtitle: undefined,
    acceptedTypes: () => [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    acceptExtensions: ".pdf,.doc,.docx,.xls,.xlsx",
    clickMessage: "Haz clic para cargar",
    dragMessage: "o arrastra y suelta",
    maxSizeMB: 10,
    maxFiles: 10,
    formatDescription: undefined,
    customIcon: "heroicons:arrow-up-tray",
  });

  const emit = defineEmits<{
    "update:modelValue": [files: File[]];
  }>();

  // Usar composable
  const {
    fileInput,
    isDragging,
    errorMessage,
    files,
    hasFiles,
    canAddMore,
    handleDrop,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    removeFile,
    clearAll,
  } = useFileUploadMultiple({
    acceptedTypes: props.acceptedTypes,
    maxSizeMB: props.maxSizeMB,
    maxFiles: props.maxFiles,
    acceptExtensions: props.acceptExtensions,
    onFilesChange: (newFiles) => emit("update:modelValue", newFiles),
  });

  // Sincronizar files internos con v-model
  watch(
    () => props.modelValue,
    (newFiles) => {
      if (newFiles && newFiles.length > 0) {
        files.value = [...newFiles];
      }
    },
    { immediate: true }
  );

  // Obtener icono según tipo de archivo (iconos SVG personalizados)
  const getFileIcon = (file: File): string => {
    const type = file.type;
    const name = file.name.toLowerCase();

    // PDF
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      return "pdf-Icon";
    }

    // Word
    if (
      type === "application/msword" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "word-Icon";
    }

    // Excel
    if (
      type === "application/vnd.ms-excel" ||
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    ) {
      return "heroicons:table-cells";
    }

    // Default
    return "heroicons:document";
  };
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Título opcional -->
    <CardTitle v-if="title" :title="title" :body="subtitle" />

    <!-- Estado: Sin archivos o zona de drop inicial -->
    <div
      v-if="!hasFiles"
      :class="[
        'relative h-38 border-2 border-dashed rounded-lg transition-all',
        'flex items-center justify-center cursor-pointer',
        isDragging
          ? 'border-primary-600 bg-primary-50'
          : 'border-primary-200 bg-primary-50 hover:border-primary-400 hover:bg-primary-100',
        errorMessage ? 'border-red-500 bg-red-50' : '',
      ]"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="openFilePicker()"
    >
      <div class="text-center">
        <div class="flex flex-col items-center gap-4">
          <!-- Icono -->
          <div class="bg-white rounded-full p-3 shadow-sm">
            <Icon :icon="customIcon" class="h-6 w-6 text-primary-700" />
          </div>

          <!-- Texto -->
          <div>
            <p class="text-sm">
              <span class="font-semibold text-primary-700">{{ clickMessage }}</span>
              <span class="text-gray-600 ml-1">{{ dragMessage }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{
                formatDescription ||
                `${acceptExtensions.replace(/\./g, "").toUpperCase()} (max ${maxSizeMB}MB)`
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado: Con archivos - Mantener fondo lila -->
    <div
      v-else
      :class="[
        'relative border-2 border-dashed rounded-lg transition-all py-8 px-6',
        isDragging ? 'border-primary-600 bg-primary-100' : 'border-primary-200 bg-primary-50',
      ]"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Grid de archivos centrado -->
      <div class="flex justify-center">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="(file, index) in files"
            :key="`${file.name}-${index}`"
            class="relative border border-gray-200 rounded-lg p-1.5 bg-white hover:shadow-md transition-shadow group"
            style="height: 110px; width: 114px"
          >
            <!-- Botón eliminar (tachito) -->
            <button
              type="button"
              class="absolute top-1 right-1 p-1 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors z-10"
              @click="removeFile(index)"
            >
              <Icon icon="heroicons:trash" class="h-4 w-4 text-gray-600" />
            </button>

            <!-- Contenido del card -->
            <div class="flex flex-col items-center gap-[2px] text-center pt-0.5">
              <!-- Nombre del archivo (arriba) -->
              <div class="w-full flex justify-start pr-6">
                <p
                  class="text-[11px] font-medium text-gray-800 line-clamp-1 w-full text-left px-0.5"
                >
                  {{ file.name }}
                </p>
              </div>

              <!-- Icono del tipo de archivo (centro - gris simple) -->
              <div class="h-14 w-14 my-0.5 flex items-center justify-center">
                <img
                  v-if="getFileIcon(file) === 'pdf-Icon' || getFileIcon(file) === 'word-Icon'"
                  :src="`/_nuxt/assets/icons/${getFileIcon(file)}.svg`"
                  :alt="getFileIcon(file)"
                  class="h-10 w-7"
                />
                <Icon v-else :icon="getFileIcon(file)" class="h-12 w-12 text-gray-400" />
              </div>

              <!-- Tamaño del archivo (abajo) -->
              <p class="text-[10px] text-gray-500 font-medium">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>

          <!-- Card "Agregar más archivos" -->
          <div
            v-if="canAddMore"
            class="rounded-lg p-1.5 transition-all cursor-pointer bg-transparent hover:bg-primary-100 flex flex-col items-center justify-center gap-0.5"
            style="height: 110px; width: 114px"
            @click="openFilePicker()"
          >
            <!-- Círculo blanco con plus -->
            <div class="bg-white rounded-full p-1 shadow-sm">
              <Icon icon="heroicons:plus" class="h-4 w-4 text-primary-600" />
            </div>
            <p class="text-[11px] font-medium text-gray-600 text-center">
              Agregar más archivos
            </p>
          </div>
        </div>
      </div>

      <!-- Footer solo con "Eliminar todos" -->
      <div class="flex justify-end items-center mt-1">
        <button
          type="button"
          class="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5"
          @click="clearAll"
        >
          <Icon icon="heroicons:trash" class="h-4 w-4" />
          Eliminar todos
        </button>
      </div>
    </div>

    <!-- Mensaje de error -->
    <p v-if="errorMessage" class="text-sm text-red-600 flex items-center gap-2">
      <Icon icon="heroicons:exclamation-circle" class="h-4 w-4" />
      {{ errorMessage }}
    </p>

    <!-- Input file oculto (con multiple) -->
    <input
      ref="fileInput"
      type="file"
      multiple
      :accept="acceptExtensions"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>
