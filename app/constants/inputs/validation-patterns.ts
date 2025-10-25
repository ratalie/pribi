// app/constants/inputs/validation-patterns.ts
export const VALIDATION_PATTERNS = {
  // Nombres
  NOMBRE: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/,
  NOMBRE_COMPLETO: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/,
  
  // Apellidos
 APELLIDO_PATERNO: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/,  // Solo letras, sin espacios
 APELLIDO_MATERNO: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/,  // Solo letras, sin espacios
  
  // Documentos de identidad
  RUC: /^[0-9]{11}$/,                    // 11 dígitos exactos
  ID_IMPUESTOS: /^[0-9]+$/,                    // Solo números
  DNI: /^[0-9]{8}$/,                     // 8 dígitos exactos
  PASAPORTE: /^[A-Z0-9]+$/,               // Solo mayúsculas y números
  CARNET_EXTRANJERIA: /^[0-9]+$/,                // Solo números
} as const;

export const VALIDATION_MESSAGES = {
  NOMBRE_INVALIDO: 'Solo se permiten letras, espacios y acentos',
  NUMERO_ID_INVALIDO: 'Solo se permiten números',
  PASAPORTE_INVALIDO: 'Solo se permiten letras mayúsculas y números',
  RUC_LARGO: 'Ingrese un RUC válido de 11 dígitos.',
  DNI_LARGO: 'Ingrese un DNI válido de 8 dígitos.',
  CORTO_DE_CARACTERES: 'Muy corto',
  LARGO_DE_CARACTERES: 'Muy largo',
  OBLIGATORIO: 'Este campo es obligatorio',
  VALOR_INVALIDO: 'El valor ingresado no es válido',
} as const;