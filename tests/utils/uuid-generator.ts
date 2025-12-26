/**
 * Utilidades para generar UUIDs
 * 
 * Centraliza la lógica de generación de UUIDs para evitar duplicación
 */

/**
 * Genera un UUID v4
 * 
 * Si está disponible, usa crypto.randomUUID() (más seguro)
 * Si no, genera un UUID pseudo-aleatorio
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  
  // Fallback: generar UUID pseudo-aleatorio
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Asegura que un valor sea un UUID válido
 * 
 * Si el valor es válido, lo retorna
 * Si no, genera uno nuevo
 */
export function ensureUUID(value?: string | null): string {
  return value && value.length > 0 ? value : generateUUID();
}

