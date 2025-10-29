/**
 * Formatea el tamaño de un archivo en bytes a una unidad legible
 * @param bytes - Tamaño del archivo en bytes
 * @returns String formateado (ej: "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Tipos MIME comunes para validación de archivos
 */
export const FILE_MIME_TYPES = {
  // Documentos
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Imágenes
  JPEG: "image/jpeg",
  PNG: "image/png",
  GIF: "image/gif",
  WEBP: "image/webp",

  // Texto
  TXT: "text/plain",
  CSV: "text/csv",
} as const;

/**
 * Extensiones de archivo predefinidas
 */
export const FILE_EXTENSIONS = {
  DOCUMENTS: ".pdf,.doc,.docx",
  SPREADSHEETS: ".xls,.xlsx",
  IMAGES: ".jpg,.jpeg,.png,.gif,.webp",
  ALL_OFFICE: ".pdf,.doc,.docx,.xls,.xlsx",
} as const;

/**
 * Obtiene la extensión de un archivo
 * @param filename - Nombre del archivo
 * @returns Extensión del archivo (ej: "pdf")
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Verifica si un archivo tiene una extensión válida
 * @param filename - Nombre del archivo
 * @param validExtensions - String de extensiones válidas (ej: ".pdf,.doc")
 * @returns true si es válida
 */
export function hasValidExtension(filename: string, validExtensions: string): boolean {
  const ext = getFileExtension(filename);
  const validExts = validExtensions.replace(/\./g, "").toLowerCase().split(",");
  return validExts.includes(ext);
}
