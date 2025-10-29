import { computed, ref } from "vue";

export interface UseFileUploadOptions {
  acceptedTypes?: string[];
  maxSizeMB?: number;
  acceptExtensions?: string;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    acceptedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxSizeMB = 10,
    acceptExtensions = ".pdf,.doc,.docx,.xls,.xlsx",
    onFileSelect,
    onFileRemove,
    onError,
  } = options;

  // Estado (solo UI, no el archivo)
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const errorMessage = ref("");

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

    return { valid: true };
  };

  // Manejar drop
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    const droppedFile = event.dataTransfer?.files[0];
    if (!droppedFile) return;

    const validation = validateFile(droppedFile);

    if (validation.valid) {
      errorMessage.value = "";
      onFileSelect?.(droppedFile);
    } else {
      errorMessage.value = validation.error || "Error al validar archivo";
      onError?.(errorMessage.value);
    }
  };

  // Manejar selección de archivo desde input
  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const validation = validateFile(file);

    if (validation.valid) {
      errorMessage.value = "";
      onFileSelect?.(file);
    } else {
      errorMessage.value = validation.error || "Error al validar archivo";
      onError?.(errorMessage.value);

      // Limpiar input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  };

  // Abrir selector de archivos
  const openFilePicker = () => {
    fileInput.value?.click();
  };

  // Eliminar archivo
  const removeFile = () => {
    errorMessage.value = "";

    if (fileInput.value) {
      fileInput.value.value = "";
    }

    onFileRemove?.();
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
  const hasError = computed(() => errorMessage.value !== "");

  return {
    // Estado
    fileInput,
    isDragging,
    errorMessage,

    // Computed
    hasError,

    // Métodos
    handleDrop,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    removeFile,
    validateFile,
  };
}
