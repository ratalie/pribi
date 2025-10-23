// app/types/inputs/text.d.ts
export interface BaseTextInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  pattern?: RegExp;
  validationType?:     
  | "nombre"
  | "nombre_completo"
  | "email"
  | "apellido_paterno"
  | "apellido_materno"
  | "dni"
  | "ruc"
  | "tipo_documento_juridico"
  | "tipo_documento_natural"
  | "tipo_documento_extranjero"
  | "pasaporte"
  | "carnet_extranjeria";
  autoCapitalize?: boolean;
  autoUpperCase?: boolean; 
  autoTrim?: boolean;
  onInput?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: () => void;
}

export interface TextInputValidation {
  isValid: boolean;
  errorMessage?: string;
  sanitizedValue: string;
}

export type TextInputEvent = 'input' | 'blur' | 'focus' | 'change';