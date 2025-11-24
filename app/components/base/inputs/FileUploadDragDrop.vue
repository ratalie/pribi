<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { useFileUpload } from "~/composables/useFileUpload";
  import { useFileUploadStyles } from "~/composables/useFileUploadStyles";
  import { formatFileSize } from "~/utils/fileHelpers";

  interface FileMetadata {
    id: string;
    nombre: string;
    size: number;
  }

  interface Props {
    modelValue?: File | null;
    isLoading?: boolean;
    fileMetadata?: FileMetadata | null; // Metadata del archivo desde el backend
    title?: string;
    subtitle?: string;
    acceptedTypes?: string[];
    acceptExtensions?: string;
    clickMessage?: string;
    dragMessage?: string;
    maxSizeMB?: number;
    formatDescription?: string;

    // Personalización visual
    variant?: "default" | "compact" | "inline" | "custom";
    customHeight?: string; // Ej: "30px", "80px"
    customWidth?: string; // Ej: "200px", "100%"
    customBgColor?: string; // Ej: "#ffffff", "var(--color-gray-50)"
    customBorderColor?: string; // Ej: "#e5e7eb"
    customIconBg?: string; // Ej: "bg-gray-100"
    customIcon?: string; // Ej: "heroicons:document-arrow-up"
    iconSize?: string; // Ej: "h-4 w-4", "h-8 w-8"
    borderRadius?: "none" | "sm" | "md" | "lg" | "full";
    hideTitle?: boolean;
    hideDescription?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    fileMetadata: null,
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
    formatDescription: undefined,
    variant: "default",
    customHeight: undefined,
    customWidth: undefined,
    customBgColor: undefined,
    customBorderColor: undefined,
    customIconBg: undefined,
    customIcon: "heroicons:arrow-up-tray",
    iconSize: undefined,
    borderRadius: "lg",
    hideTitle: false,
    hideDescription: false,
  });

  const emit = defineEmits<{
    "update:modelValue": [file: File | null];
  }>();

  // Usar composable
  const {
    fileInput,
    isDragging,
    errorMessage,
    handleDrop,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    removeFile: removeFileInternal,
  } = useFileUpload({
    acceptedTypes: props.acceptedTypes,
    maxSizeMB: props.maxSizeMB,
    acceptExtensions: props.acceptExtensions,
    onFileSelect: (file) => emit("update:modelValue", file),
    onFileRemove: () => emit("update:modelValue", null),
  });

  // El archivo viene directamente del v-model
  const file = computed(() => props.modelValue);
  const fileMetadata = computed(() => props.fileMetadata);

  // Prioridad absoluta a metadata: si existe metadata, siempre la usamos
  // El file solo se usa si NO hay metadata (estado transitorio mientras se sube)
  const hasFile = computed(() => !!fileMetadata.value || !!file.value);
  const hasError = computed(() => !!errorMessage.value);

  // Nombre del archivo: SIEMPRE prioridad a metadata
  const fileName = computed(() => {
    if (fileMetadata.value?.nombre) {
      return fileMetadata.value.nombre;
    }
    if (file.value?.name) {
      return file.value.name;
    }
    return "";
  });

  // Mostrar tamaño solo si NO hay metadata (file local temporal)
  const showFileSize = computed(() => {
    return !fileMetadata.value && !!file.value;
  });

  // Abrir URL del archivo en nueva pestaña
  const openFileUrl = () => {
    if (fileMetadata.value?.id) {
      window.open(fileMetadata.value.id, "_blank");
    }
  };

  // Usar composable de estilos
  const {
    containerClasses,
    containerStyles,
    iconContainerClasses,
    iconSizeClass,
    layoutClass,
    textSizeClass,
  } = useFileUploadStyles(
    {
      variant: props.variant,
      customHeight: props.customHeight,
      customWidth: props.customWidth,
      customBgColor: props.customBgColor,
      customBorderColor: props.customBorderColor,
      customIconBg: props.customIconBg,
      iconSize: props.iconSize,
      borderRadius: props.borderRadius,
    },
    isDragging,
    hasFile,
    hasError
  );

  // Wrapper para removeFile que también actualiza el v-model
  const removeFile = () => {
    removeFileInternal();
  };
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Título opcional -->
    <CardTitle v-if="title" :title="title" :body="subtitle" />

    <!-- Zona de drag & drop -->
    <div
      :class="containerClasses"
      :style="containerStyles"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="!hasFile ? openFilePicker() : undefined"
    >
      <!-- Sin archivo ni metadata -->
      <div v-if="!hasFile" class="text-center">
        <div class="flex items-center" :class="layoutClass">
          <!-- Icono -->
          <div :class="iconContainerClasses">
            <Icon :icon="customIcon" :class="iconSizeClass" class="text-primary-700" />
          </div>

          <!-- Texto -->
          <div :class="variant === 'inline' ? 'text-left' : ''">
            <p :class="textSizeClass">
              <span class="text-primary-800 font-light">{{ clickMessage }}</span>
              <span v-if="!hideTitle" class="text-neutral-white-40 font-light ml-1">
                {{ dragMessage }}
              </span>
            </p>
            <p v-if="!hideDescription" class="text-xs text-gray-500 mt-1">
              {{
                formatDescription ||
                `${acceptExtensions.replace(/\./g, "").toUpperCase()} (max ${maxSizeMB}MB)`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Con archivo -->
      <div
        v-else
        class="flex items-center gap-3 px-6 py-4 relative"
        :class="variant === 'inline' ? 'py-2' : 'flex-col py-8'"
      >
        <!-- Icono de documento -->
        <Icon
          :icon="isLoading ? 'eos-icons:loading' : 'heroicons:document-text'"
          :class="variant === 'inline' ? 'h-6 w-6' : 'h-12 w-12'"
          class="text-primary-700"
        />

        <!-- Nombre y tamaño -->
        <div
          v-if="!isLoading"
          :class="variant === 'inline' ? 'text-left flex-1' : 'text-center'"
        >
          <p
            class="font-semibold text-gray-800"
            :class="variant === 'inline' ? 'text-xs' : 'text-sm'"
          >
            {{ fileName }}
          </p>
          <!-- Mostrar tamaño solo si NO hay metadata (file local temporal) -->
          <p
            v-if="!hideDescription && showFileSize && file"
            class="text-xs text-gray-500 mt-1"
          >
            {{ formatFileSize(file.size) }}
          </p>
        </div>

        <!-- Botones de acción -->
        <div
          class="flex items-center gap-2"
          :class="variant === 'inline' ? '' : 'absolute top-3 right-3'"
        >
          <!-- Botón ver archivo : false para que no se muestre-->
          <button
            v-if="false"
            type="button"
            :class="[
              'p-2 rounded-md bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors group',
            ]"
            @click.stop="openFileUrl"
            :title="'Ver archivo'"
          >
            <Icon
              icon="heroicons:eye"
              :class="variant === 'inline' ? 'h-4 w-4' : 'h-5 w-5'"
              class="text-gray-600 group-hover:text-blue-600 transition-colors"
            />
          </button>

          <!-- Botón eliminar -->
          <button
            type="button"
            :class="[
              'p-2 rounded-md bg-white border border-gray-300 hover:bg-red-50 hover:border-red-500 transition-colors group',
            ]"
            @click.stop="removeFile"
            :title="'Eliminar archivo'"
          >
            <Icon
              icon="heroicons:trash"
              :class="variant === 'inline' ? 'h-4 w-4' : 'h-5 w-5'"
              class="text-gray-600 group-hover:text-red-600 transition-colors"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <p v-if="errorMessage" class="text-sm text-red-600 flex items-center gap-2">
      <Icon icon="heroicons:exclamation-circle" class="h-4 w-4" />
      {{ errorMessage }}
    </p>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      :accept="acceptExtensions"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>
