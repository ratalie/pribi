/**
 * Composable para manejar la lógica de confirmación de eliminación
 * @param onConfirm Función async que se ejecuta cuando el usuario confirma
 * @param options Opciones de configuración del modal
 * @returns Objeto con el estado y métodos para controlar el modal
 */
export const useConfirmDelete = (
  onConfirm: () => Promise<void>,
  options?: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }
) => {
  const isOpen = ref(false);
  const isLoading = ref(false);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    if (!isLoading.value) {
      isOpen.value = false;
    }
  };

  const handleConfirm = async () => {
    isLoading.value = true;
    try {
      await onConfirm();
      // Solo cierra si la operación es exitosa
      isOpen.value = false;
    } catch (error) {
      console.error("Error al confirmar eliminación:", error);
      // El modal permanece abierto para que el usuario pueda reintentar
      // En el futuro se puede agregar un toast aquí
    } finally {
      isLoading.value = false;
    }
  };

  const handleCancel = () => {
    if (!isLoading.value) {
      close();
    }
  };

  return {
    isOpen,
    isLoading,
    open,
    close,
    handleConfirm,
    handleCancel,
    title: options?.title,
    message: options?.message,
    confirmLabel: options?.confirmLabel,
    cancelLabel: options?.cancelLabel,
  };
};

