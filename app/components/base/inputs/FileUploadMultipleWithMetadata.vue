<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import { computed, ref } from "vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { useFileUploadMultiple } from "~/composables/useFileUploadMultiple";
  import { UploadFileUseCase } from "~/core/shared/infrastructure/file-storage/application/use-cases/upload-file.use-case";
  import { AwsFileStorageRepository } from "~/core/shared/infrastructure/file-storage/infrastructure/repositories/aws-file-storage.repository";
  import { formatFileSize } from "~/utils/fileHelpers";

  interface FileMetadataResponseDTO {
    fileId: string;
    mimeType: string;
    originalName: string;
    size: number;
  }

  interface Props {
    filesMetadata?: FileMetadataResponseDTO[];
    societyId: string;
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
    isLoading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    filesMetadata: () => [],
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
    isLoading: false,
  });

  const emit = defineEmits<{
    "file-uploaded": [metadata: FileMetadataResponseDTO];
    "file-removed": [fileId: string];
  }>();

  // Instancia del servicio de upload
  const fileStorageRepository = new AwsFileStorageRepository();
  const uploadFileUseCase = new UploadFileUseCase(fileStorageRepository);

  // Archivos temporales mientras se suben
  const uploadingFiles = ref<Map<File, boolean>>(new Map());

  // Usar composable para drag & drop
  const {
    fileInput,
    isDragging,
    errorMessage,
    files,
    hasFiles: hasFilesFromComposable,
    handleDrop,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    removeFile: removeFileFromComposable,
  } = useFileUploadMultiple({
    acceptedTypes: props.acceptedTypes,
    maxSizeMB: props.maxSizeMB,
    maxFiles: props.maxFiles,
    acceptExtensions: props.acceptExtensions,
    onFilesChange: async (newFiles) => {
      // Subir cada archivo nuevo
      for (const file of newFiles) {
        // Verificar si ya está en proceso de subida
        if (uploadingFiles.value.has(file)) continue;

        uploadingFiles.value.set(file, true);

        try {
          const uploadResponse = await uploadFileUseCase.execute(props.societyId, file);

          if (!uploadResponse.data) {
            throw new Error("No se recibió data en la respuesta del upload");
          }

          // Mapear UploadFileDataDTO a FileMetadataResponseDTO
          const metadata: FileMetadataResponseDTO = {
            fileId: uploadResponse.data.fileId,
            mimeType: uploadResponse.data.mimeType,
            originalName: uploadResponse.data.originalName,
            size: uploadResponse.data.size,
          };

          // Emitir evento con la metadata
          emit("file-uploaded", metadata);

          // Eliminar el archivo del array temporal
          const fileIndex = files.value.findIndex((f) => f === file);
          if (fileIndex !== -1) {
            removeFileFromComposable(fileIndex);
          }
        } catch (error) {
          console.error("[FileUploadMultipleWithMetadata] Error al subir archivo:", error);
          // Eliminar archivo en caso de error
          const fileIndex = files.value.findIndex((f) => f === file);
          if (fileIndex !== -1) {
            removeFileFromComposable(fileIndex);
          }
        } finally {
          uploadingFiles.value.delete(file);
        }
      }
    },
  });

  // Verificar si hay archivos (metadata o files subiendo)
  const hasFiles = computed(() => {
    return (
      (props.filesMetadata && props.filesMetadata.length > 0) || hasFilesFromComposable.value
    );
  });

  // Verificar si se puede agregar más archivos
  const canAddMore = computed(() => {
    const totalFiles = (props.filesMetadata?.length || 0) + files.value.length;
    return totalFiles < props.maxFiles;
  });

  // Obtener icono según tipo de archivo
  const getFileIcon = (metadata: FileMetadataResponseDTO): string => {
    const name = metadata.originalName.toLowerCase();
    const mimeType = metadata.mimeType.toLowerCase();

    // PDF
    if (mimeType === "application/pdf" || name.endsWith(".pdf")) {
      return "pdf-Icon";
    }

    // Word
    if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "word-Icon";
    }

    // Excel
    if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    ) {
      return "heroicons:table-cells";
    }

    // Default
    return "heroicons:document";
  };

  // Obtener icono para archivo temporal
  const getFileIconFromFile = (file: File): string => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type === "application/pdf" || name.endsWith(".pdf")) {
      return "pdf-Icon";
    }

    if (
      type === "application/msword" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "word-Icon";
    }

    if (
      type === "application/vnd.ms-excel" ||
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    ) {
      return "heroicons:table-cells";
    }

    return "heroicons:document";
  };

  // Verificar si un archivo está subiendo
  const isFileUploading = (file: File): boolean => {
    return uploadingFiles.value.get(file) ?? false;
  };

  // Manejar eliminación de archivo
  const handleRemoveFile = (metadata: FileMetadataResponseDTO) => {
    emit("file-removed", metadata.fileId);
  };

  // Manejar eliminación de archivo temporal
  const handleRemoveUploadingFile = (index: number) => {
    const file = files.value[index];
    if (file) {
      uploadingFiles.value.delete(file);
    }
    removeFileFromComposable(index);
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

    <!-- Estado: Con archivos -->
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
          <!-- Archivos guardados (metadata) -->
          <div
            v-for="metadata in filesMetadata"
            :key="metadata.fileId"
            class="relative border border-gray-200 rounded-lg p-1.5 bg-white hover:shadow-md transition-shadow group"
            style="height: 110px; width: 114px"
          >
            <!-- Botón eliminar -->
            <button
              type="button"
              class="absolute top-1 right-1 p-1 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors z-10"
              @click="handleRemoveFile(metadata)"
            >
              <Icon icon="heroicons:trash" class="h-4 w-4 text-gray-600" />
            </button>

            <!-- Contenido del card -->
            <div class="flex flex-col items-center gap-[2px] text-center pt-0.5">
              <!-- Nombre del archivo -->
              <div class="w-full flex justify-start pr-6">
                <p
                  class="text-[11px] font-medium text-gray-800 line-clamp-1 w-full text-left px-0.5"
                >
                  {{ metadata.originalName }}
                </p>
              </div>

              <!-- Icono del tipo de archivo -->
              <div class="h-14 w-14 my-0.5 flex items-center justify-center">
                <img
                  v-if="
                    getFileIcon(metadata) === 'pdf-Icon' ||
                    getFileIcon(metadata) === 'word-Icon'
                  "
                  :src="`/_nuxt/assets/icons/${getFileIcon(metadata)}.svg`"
                  :alt="getFileIcon(metadata)"
                  class="h-10 w-7"
                />
                <Icon v-else :icon="getFileIcon(metadata)" class="h-12 w-12 text-gray-400" />
              </div>

              <!-- Tamaño del archivo -->
              <p class="text-[10px] text-gray-500 font-medium">
                {{ formatFileSize(metadata.size) }}
              </p>
            </div>
          </div>

          <!-- Archivos temporales (subiendo) -->
          <div
            v-for="(file, index) in files"
            :key="`uploading-${index}`"
            class="relative border border-gray-200 rounded-lg p-1.5 bg-white hover:shadow-md transition-shadow group"
            style="height: 110px; width: 114px"
          >
            <!-- Botón eliminar -->
            <button
              type="button"
              class="absolute top-1 right-1 p-1 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors z-10"
              @click="handleRemoveUploadingFile(index)"
            >
              <Icon icon="heroicons:trash" class="h-4 w-4 text-gray-600" />
            </button>

            <!-- Contenido del card -->
            <div class="flex flex-col items-center gap-[2px] text-center pt-0.5">
              <!-- Nombre del archivo -->
              <div class="w-full flex justify-start pr-6">
                <p
                  class="text-[11px] font-medium text-gray-800 line-clamp-1 w-full text-left px-0.5"
                >
                  {{ file.name }}
                </p>
              </div>

              <!-- Icono del tipo de archivo (con loading) -->
              <div class="h-14 w-14 my-0.5 flex items-center justify-center">
                <Icon
                  v-if="isFileUploading(file)"
                  icon="eos-icons:loading"
                  class="h-12 w-12 text-primary-600"
                />
                <template v-else>
                  <img
                    v-if="
                      getFileIconFromFile(file) === 'pdf-Icon' ||
                      getFileIconFromFile(file) === 'word-Icon'
                    "
                    :src="`/_nuxt/assets/icons/${getFileIconFromFile(file)}.svg`"
                    :alt="getFileIconFromFile(file)"
                    class="h-10 w-7"
                  />
                  <Icon
                    v-else
                    :icon="getFileIconFromFile(file)"
                    class="h-12 w-12 text-gray-400"
                  />
                </template>
              </div>

              <!-- Tamaño del archivo -->
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
      <div
        v-if="filesMetadata && filesMetadata.length > 0"
        class="flex justify-end items-center mt-1"
      >
        <button
          type="button"
          class="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5"
          @click="filesMetadata.forEach((m) => emit('file-removed', m.fileId))"
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
