import { computed, ref } from "vue";

export interface UseFileUploadMultipleOptions {
  acceptedTypes?: string[];
  maxSizeMB?: number;
  maxFiles?: number;
  acceptExtensions?: string;
  onFilesChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export function useFileUploadMultiple(options: UseFileUploadMultipleOptions = {}) {
  const {
    acceptedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxSizeMB = 10,
    maxFiles = 10,
    acceptExtensions = ".pdf,.doc,.docx,.xls,.xlsx",
    onFilesChange,
    onError,
  } = options;

  // Estado
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const errorMessage = ref("");
  const files = ref<File[]>([]);

  // Validar archivo
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validar tipo MIME
    if (!acceptedTypes.includes(file.type)) {
      const error = `Formato no permitido. Solo se aceptan: ${acceptExtensions}`;
      return { valid: false, error };
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const error = `El archivo es muy grande. Máximo ${maxSizeMB}MB`;
      return { valid: false, error };
    }

    // Validar cantidad máxima
    if (files.value.length >= maxFiles) {
      const error = `Máximo ${maxFiles} archivos permitidos`;
      return { valid: false, error };
    }

    return { valid: true };
  };

  // Agregar archivo
  const addFile = (file: File) => {
    const validation = validateFile(file);

    if (validation.valid) {
      files.value.push(file);
      errorMessage.value = "";
      onFilesChange?.(files.value);
    } else {
      errorMessage.value = validation.error || "Error al validar archivo";
      onError?.(errorMessage.value);
    }
  };

  // Manejar drop
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    // Agregar cada archivo
    Array.from(droppedFiles).forEach((file) => {
      addFile(file);
    });
  };

  // Manejar selección de archivo desde input
  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFiles = target.files;

    if (!selectedFiles || selectedFiles.length === 0) return;

    // Agregar cada archivo
    Array.from(selectedFiles).forEach((file) => {
      addFile(file);
    });

    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  // Abrir selector de archivos
  const openFilePicker = () => {
    fileInput.value?.click();
  };

  // Eliminar un archivo específico
  const removeFile = (index: number) => {
    files.value.splice(index, 1);
    errorMessage.value = "";
    onFilesChange?.(files.value);
  };

  // Limpiar todos los archivos
  const clearAll = () => {
    files.value = [];
    errorMessage.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    onFilesChange?.([]);
  };

  // Handlers de drag
  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  // Computed
  const hasFiles = computed(() => files.value.length > 0);
  const hasError = computed(() => errorMessage.value !== "");
  const canAddMore = computed(() => files.value.length < maxFiles);

  return {
    // Estado
    fileInput,
    isDragging,
    errorMessage,
    files,

    // Computed
    hasFiles,
    hasError,
    canAddMore,

    // Métodos
    handleDrop,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    removeFile,
    clearAll,
    addFile,
    validateFile,
  };
}
