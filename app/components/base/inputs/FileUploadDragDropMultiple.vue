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

  // Obtener icono según tipo de archivo (iconos grises simples)
  const getFileIcon = (file: File): string => {
    const type = file.type;
    const name = file.name.toLowerCase();

    // PDF
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      return "heroicons:document-text";
    }

    // Word
    if (
      type === "application/msword" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "heroicons:document-text";
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
        'relative h-48 border-2 border-dashed rounded-lg transition-all',
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
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(file, index) in files"
            :key="`${file.name}-${index}`"
            class="relative aspect-square border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow group"
          >
            <!-- Botón eliminar (tres puntos) -->
            <button
              type="button"
              class="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
              @click="removeFile(index)"
            >
              <Icon icon="heroicons:ellipsis-vertical" class="h-4 w-4 text-gray-600" />
            </button>

            <!-- Contenido del card -->
            <div class="flex flex-col items-center gap-1.5 text-center pt-1">
              <!-- Nombre del archivo (arriba) -->
              <p class="text-[11px] font-medium text-gray-800 line-clamp-1 w-full px-1">
                {{ file.name }}
              </p>

              <!-- Icono del tipo de archivo (centro - gris simple) -->
              <Icon :icon="getFileIcon(file)" class="h-14 w-14 text-gray-400 my-1" />

              <!-- Tamaño del archivo (abajo) -->
              <p class="text-[10px] text-gray-500 font-medium">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>

          <!-- Card "Agregar más archivos" -->
          <div
            v-if="canAddMore"
            class="aspect-square rounded-lg p-3 transition-all cursor-pointer bg-transparent hover:bg-primary-100 flex flex-col items-center justify-center gap-3"
            @click="openFilePicker()"
          >
            <!-- Círculo blanco con plus -->
            <div class="bg-white rounded-full p-2.5 shadow-sm">
              <Icon icon="heroicons:plus" class="h-5 w-5 text-primary-600" />
            </div>
            <p class="text-[11px] font-medium text-gray-600 text-center">
              Agregar más archivos
            </p>
          </div>
        </div>
      </div>

      <!-- Footer solo con "Eliminar todos" -->
      <div class="flex justify-end items-center pt-4 mt-2">
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
