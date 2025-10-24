// app/utils/inputs/validation-rules.ts
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "@/constants/inputs/validation-patterns";
import type {
  BaseTextInputProps,
  TextInputValidation,
} from "@/types/inputs/text";
import type {
  BaseDateInputProps,
  DateInputValidation,
} from "@/types/inputs/date";

export function validateTextInput(
  value: string,
  props: BaseTextInputProps
): TextInputValidation {
  console.log("🔍 validateTextInput - Input:", { value, props });

  let sanitizedValue = value;

  // 1. Sanitización básica
  if (props.autoTrim) {
    sanitizedValue = sanitizedValue.trim();
    console.log("🔍 Después de autoTrim:", sanitizedValue);
  }

  // 2. Filtrado específico por tipo de validación (usando patrones)
  if (props.validationType) {
    const pattern = getPatternForType(props.validationType);
    if (pattern) {
      // Extraer caracteres válidos del patrón
      sanitizedValue = filterByPattern(sanitizedValue, pattern);
      console.log("🔍 Después de filtrado por patrón:", sanitizedValue);
    }
  }

  // 3. Capitalización automática
  if (props.autoCapitalize) {
    sanitizedValue = capitalizeText(sanitizedValue);
    console.log("🔍 Después de autoCapitalize:", sanitizedValue);
  }

  // 4. Uppercase automática
  if (props.autoUpperCase) {
    sanitizedValue = upperCaseText(sanitizedValue);
    console.log("🔍 Después de autoUpperCase:", sanitizedValue);
  }

  // 4. Validaciones
  const errors: string[] = [];

  // Validación de requerido
  if (props.required && !sanitizedValue) {
    errors.push(VALIDATION_MESSAGES.OBLIGATORIO);
  }

  // Validación de longitud mínima
  if (
    sanitizedValue &&
    props.minLength &&
    sanitizedValue.length < props.minLength
  ) {
    errors.push(VALIDATION_MESSAGES.CORTO_DE_CARACTERES);
  }

  // Validación de longitud máxima
  if (
    sanitizedValue &&
    props.maxLength &&
    sanitizedValue.length > props.maxLength
  ) {
    errors.push(VALIDATION_MESSAGES.LARGO_DE_CARACTERES);
  }

  // Validación de patrón
  if (sanitizedValue && props.validationType) {
    const pattern = getPatternForType(props.validationType);
    if (pattern && !pattern.test(sanitizedValue)) {
      errors.push(VALIDATION_MESSAGES.NOMBRE_INVALIDO);
    }
  }

  // Validación de patrón personalizado
  if (sanitizedValue && props.pattern && !props.pattern.test(sanitizedValue)) {
    errors.push(VALIDATION_MESSAGES.VALOR_INVALIDO);
  }

  const result = {
    isValid: errors.length === 0,
    errorMessage: errors[0], // Solo el primer error
    sanitizedValue,
  };

  console.log("🔍 validateTextInput - Resultado final:", result);
  return result;
}

function getPatternForType(type: string): RegExp | null {
  switch (type) {
    case "nombre":
      return VALIDATION_PATTERNS.NOMBRE;
    case "nombre_completo":
      return VALIDATION_PATTERNS.NOMBRE_COMPLETO;
    case "apellido_paterno":
      return VALIDATION_PATTERNS.APELLIDO_PATERNO;
    case "apellido_materno":
      return VALIDATION_PATTERNS.APELLIDO_MATERNO;
    case "dni":
      return VALIDATION_PATTERNS.DNI;
    case "ruc":
      return VALIDATION_PATTERNS.RUC;
    case "tipo_documento_juridico":
      return VALIDATION_PATTERNS.NOMBRE;
    case "tipo_documento_natural":
      return VALIDATION_PATTERNS.NOMBRE;
    case "tipo_documento_extranjero":
      return VALIDATION_PATTERNS.NOMBRE;
    case "pasaporte":
      return VALIDATION_PATTERNS.PASAPORTE;
    case "carnet_extranjeria":
      return VALIDATION_PATTERNS.CARNET_EXTRANJERIA;
    default:
      return null;
  }
}

function capitalizeText(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function upperCaseText(text: string): string {
  return text.toUpperCase();
}

function filterByPattern(value: string, pattern: RegExp): string {
  // Extraer la parte de caracteres válidos del patrón
  const patternString = pattern.toString();

  // Si el patrón es /^[0-9]{11}$/, extraer [0-9]
  if (patternString.includes("[0-9]")) {
    return value.replace(/[^0-9]/g, "");
  }

  // Si el patrón es /^[A-Z0-9]+$/, extraer [A-Z0-9]
  if (patternString.includes("[A-Z0-9]")) {
    return value.replace(/[^A-Z0-9]/g, "");
  }

  // Si el patrón contiene letras y acentos, extraer esos caracteres
  if (patternString.includes("[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ")) {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]/g, "");
  }

  // Por defecto, no filtrar
  return value;
}

// 👇 Funciones de validación para fechas
export function validateDateInput(
  value: string,
  props: BaseDateInputProps
): DateInputValidation {
  console.log("🔍 validateDateInput - Input:", { value, props });

  let sanitizedValue = value;
  let formattedValue = value;

  // 1. Sanitización básica - remover espacios
  sanitizedValue = sanitizedValue.trim();

  // 2. Validar formato de fecha ISO si hay valor
  if (sanitizedValue && !isValidISODate(sanitizedValue)) {
    // Si no es ISO válido, intentar convertir desde otros formatos
    const convertedDate = convertToISODate(sanitizedValue);
    if (convertedDate) {
      sanitizedValue = convertedDate;
    }
  }

  // 3. Formatear para mostrar
  if (sanitizedValue) {
    formattedValue = formatDateForDisplay(sanitizedValue, props.dateFormat);
  }

  // 4. Validaciones
  const errors: string[] = [];

  // Validación de requerido
  if (props.required && !sanitizedValue) {
    errors.push(VALIDATION_MESSAGES.OBLIGATORIO);
  }

  // Validación de fecha válida
  if (sanitizedValue && !isValidISODate(sanitizedValue)) {
    errors.push("Fecha inválida");
  }

  // Validación de fecha mínima
  if (sanitizedValue && props.minDate) {
    if (sanitizedValue < props.minDate) {
      errors.push(
        `La fecha debe ser posterior a ${formatDateForDisplay(
          props.minDate,
          props.dateFormat
        )}`
      );
    }
  }

  // Validación de fecha máxima
  if (sanitizedValue && props.maxDate) {
    if (sanitizedValue > props.maxDate) {
      errors.push(
        `La fecha debe ser anterior a ${formatDateForDisplay(
          props.maxDate,
          props.dateFormat
        )}`
      );
    }
  }

  const result = {
    isValid: errors.length === 0,
    errorMessage: errors[0] || "",
    sanitizedValue,
    formattedValue,
  };

  console.log("🔍 validateDateInput - Resultado final:", result);
  return result;
}

function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    !!dateString.match(/^\d{4}-\d{2}-\d{2}$/)
  );
}

function convertToISODate(dateString: string): string | null {
  // Intentar convertir desde formato DD/MM/YYYY
  const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy && ddmmyyyy[1] && ddmmyyyy[2] && ddmmyyyy[3]) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Intentar convertir desde formato MM/DD/YYYY
  const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyy && mmddyyyy[1] && mmddyyyy[2] && mmddyyyy[3]) {
    const [, month, day, year] = mmddyyyy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
}

function formatDateForDisplay(isoDate: string, format?: string): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "dd/MM/yyyy":
      return `${day}/${month}/${year}`;
    case "MM/dd/yyyy":
      return `${month}/${day}/${year}`;
    case "yyyy-MM-dd":
      return isoDate;
    default:
      return `${day}/${month}/${year}`; // Formato por defecto
  }
}
