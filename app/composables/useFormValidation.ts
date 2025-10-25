// app/composables/useFormValidation.ts
import type { TextInputValidation } from "@/types/inputs/text";
import type { SelectValidation } from "@/types/inputs/select";
import type { DateInputValidation } from "@/types/inputs/date";

export function useFormValidation() {
  // Estado global de validación del formulario
  const validationMessage = ref("");
  const isValid = ref(false);
  const fieldValidations = ref<Record<string, boolean>>({});

  // Función auxiliar para actualizar el estado de validación
  const updateValidationState = (
    isValidField: boolean,
    errorMessage?: string,
    fieldName?: string
  ) => {
    if (fieldName) {
      fieldValidations.value[fieldName] = isValidField;
    }

    if (!isValidField) {
      validationMessage.value = errorMessage || "";
      isValid.value = false;
    } else {
      // Solo limpiar el mensaje si todos los campos son válidos
      const allFieldsValid = Object.values(fieldValidations.value).every(
        (valid) => valid
      );
      if (allFieldsValid) {
        validationMessage.value = "";
        isValid.value = true;
      }
    }
  };

  // Handlers centralizados para cada tipo de input
  const handleTextValidation = (
    validation: TextInputValidation,
    fieldName?: string
  ) => {
    console.log("Validación de texto:", validation);
    updateValidationState(
      validation.isValid,
      validation.errorMessage,
      fieldName
    );
  };

  const handleSelectValidation = (
    validation: SelectValidation,
    fieldName?: string
  ) => {
    console.log("Validación de select:", validation);
    updateValidationState(
      validation.isValid,
      validation.errorMessage,
      fieldName
    );
  };

  const handleDateValidation = (
    validation: DateInputValidation,
    fieldName?: string
  ) => {
    console.log("Validación de fecha:", validation);
    updateValidationState(
      validation.isValid,
      validation.errorMessage,
      fieldName
    );
  };

  // Función para limpiar todas las validaciones
  const clearValidations = () => {
    validationMessage.value = "";
    isValid.value = false;
    fieldValidations.value = {};
  };

  // Función para validar todo el formulario
  const validateForm = () => {
    const allFieldsValid = Object.values(fieldValidations.value).every(
      (valid) => valid
    );
    isValid.value = allFieldsValid;
    return allFieldsValid;
  };

  return {
    // Estado
    validationMessage: readonly(validationMessage),
    isValid: readonly(isValid),
    fieldValidations: readonly(fieldValidations),

    // Handlers
    handleTextValidation,
    handleSelectValidation,
    handleDateValidation,

    // Utilidades
    clearValidations,
    validateForm,
  };
}
