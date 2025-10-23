// app/types/inputs/select.d.ts

// 👇 Opción individual del select
export interface SelectOption {
  id: number;
  label: string;
  name: string;
  value: number;
  acronimo: string;
}

// 👇 Props base para componentes de select
export interface BaseSelectProps {
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options?: SelectOption[];
  label?: string;
  labelId?: string;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  showValidation?: boolean;
  customClasses?: string;
  onInput?: (value: string | number) => void;
  onBlur?: (value: string | number) => void;
  onFocus?: () => void;
}

// 👇 Validación para select
export interface SelectValidation {
  isValid: boolean;
  errorMessage?: string;
  selectedValue: string | number;
}

// 👇 Eventos del select
export type SelectEvent = "input" | "blur" | "focus" | "change";
