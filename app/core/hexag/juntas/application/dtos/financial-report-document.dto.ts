/**
 * DTOs para Financial Report Document
 * 
 * Endpoints:
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/financial-report-document
 */

/**
 * DTO para crear un estado financiero (POST)
 */
export interface EstadoFinancieroCreateDTO {
  label: string; // Nombre del estado financiero (ej: "Balance General")
  archivoIds: string[]; // Array de UUIDs de archivos
}

/**
 * DTO para actualizar un estado financiero (PUT)
 */
export interface EstadoFinancieroUpdateDTO {
  id: string; // UUID del estado financiero (requerido en PUT)
  accion: "add" | "update" | "delete"; // Acción a realizar
  label: string; // Nombre del estado financiero (requerido si accion es "add" o "update")
  archivoIds: string[]; // Array de UUIDs de archivos (requerido si accion es "add" o "update")
}

/**
 * DTO para crear/actualizar un estado financiero (compatibilidad)
 * @deprecated Usar EstadoFinancieroCreateDTO o EstadoFinancieroUpdateDTO según corresponda
 */
export interface EstadoFinancieroDTO {
  id?: string; // UUID del estado financiero (opcional en POST, requerido en PUT)
  label: string; // Nombre del estado financiero (ej: "Balance General")
  archivoIds: string[]; // Array de UUIDs de archivos
  accion?: "add" | "update" | "delete"; // Solo para PUT
}

/**
 * DTO Request para crear reporte financiero (POST)
 */
export interface CreateFinancialReportDocumentRequestDTO {
  reporteAnualArchivoIds?: string[]; // Memoria anual (opcional)
  estadosFinancieros: EstadoFinancieroCreateDTO[]; // Estados financieros (sin id ni accion)
}

/**
 * DTO Request para actualizar reporte financiero (PUT)
 */
export interface UpdateFinancialReportDocumentRequestDTO {
  reporteAnualArchivoIds?: string[]; // Actualizar memoria anual (opcional)
  estadosFinancieros: EstadoFinancieroUpdateDTO[]; // Estados financieros con id y accion
}

/**
 * DTO para archivo en respuesta
 */
export interface ArchivoMetadataDTO {
  archivoId: string;
  version: number;
  tipoMime: string;
  tamaño: number;
  nombreOriginal: string;
}

/**
 * DTO Response para obtener reporte financiero
 */
export interface FinancialReportDocumentResponseDTO {
  reporteAnualArchivoIds?: ArchivoMetadataDTO[]; // Memoria anual
  estadosFinancieros: Array<{
    id: string;
    label: string;
    archivoIds: ArchivoMetadataDTO[];
  }>;
}

