// app/types/inputs/date.d.ts

export interface BaseDateInputProps {
  // Props básicas
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  // Props de validación
  validationType?: string;
  minDate?: string; // Fecha mínima en formato ISO (YYYY-MM-DD)
  maxDate?: string; // Fecha máxima en formato ISO (YYYY-MM-DD)

  // Props de formato
  dateFormat?: string; // Formato de visualización (ej: "dd/MM/yyyy", "MM/dd/yyyy")

  // Callbacks
  onBlur?: (value: string) => void;
  onFocus?: () => void;
  onChange?: (value: string) => void;
}

export interface DateInputValidation {
  isValid: boolean;
  errorMessage: string;
  sanitizedValue: string; // Fecha en formato ISO
  formattedValue: string; // Fecha formateada para mostrar
}

export interface DateInputOption {
  id: string;
  value: string;
  label: string;
}
