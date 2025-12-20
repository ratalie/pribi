/**
 * DTOs para Configuración de Directorio en Juntas
 * Basado en: docs/backend/directores-generales/guia nueva directores directorio.md
 *
 * ⚠️ IMPORTANTE: Todos los campos son opcionales. Solo se envían los campos que se necesiten:
 * - Para `nombramiento-directores`: `cantidadDirectores`, `configurarDirectorio` (opcional)
 * - Para `nombramiento-directorio`: `cantidadDirectores`, `periodo`, `inicioMandato`, `finMandato`, `configurarDirectorio` (opcional)
 *
 * ⚠️ NOTA: `configurarDirectorio` es un campo del endpoint `/directorio`, NO de agenda items.
 * Si `configurarDirectorio: true` → Se crea automáticamente `voteDirectoryConfigurationId` (VoteSession)
 * Si `configurarDirectorio: false` → Se elimina `voteDirectoryConfigurationId`
 */

/**
 * DTO para actualizar configuración de directorio (PUT Request)
 * ⚠️ Todos los campos son opcionales - Solo se envían los campos que se necesiten actualizar
 */
export interface UpdateDirectoryConfigurationDTO {
  /** Cantidad fija de directores (si `conteoPersonalizado` es false) */
  cantidadDirectores?: number;

  /** Si usar rango de directores */
  conteoPersonalizado?: boolean;

  /** Mínimo de directores (si `conteoPersonalizado` es true) */
  minimoDirectores?: number | null;

  /** Máximo de directores (si `conteoPersonalizado` es true) */
  maximoDirectores?: number | null;

  /** Período del directorio: "ONE_YEAR", "TWO_YEARS", "TRIENAL", etc. */
  periodo?: string;

  /** Fecha de inicio (formato: "YYYY-MM-DD") */
  inicioMandato?: string;

  /** Fecha de fin (formato: "YYYY-MM-DD") */
  finMandato?: string;

  /** Quórum mínimo para sesiones */
  quorumMinimo?: number;

  /** Mayoría requerida para decisiones */
  mayoria?: number;

  /** Si el presidente es designado */
  presidenteDesignado?: boolean;

  /** Si hay secretario asignado */
  secretarioAsignado?: boolean;

  /** Si se permite reelección */
  reeleccionPermitida?: boolean;

  /** Si el presidente preside sesiones */
  presidentePreside?: boolean;

  /** Si el presidente desempata votaciones */
  presidenteDesempata?: boolean;

  /** ID del director presidente (UUID) */
  presidenteId?: string | null;

  /** Activar/desactivar votación de configuración (true/false) */
  configurarDirectorio?: boolean;
}

/**
 * DTO de respuesta al obtener configuración de directorio (GET Response)
 */
export interface DirectoryConfigurationResponseDTO {
  id: string;
  cantidadDirectores: number;
  conteoPersonalizado: boolean;
  minimoDirectores: number | null;
  maximoDirectores: number | null;
  inicioMandato: string | null;
  finMandato: string | null;
  quorumMinimo: number;
  mayoria: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  reeleccionPermitida: boolean;
  presidentePreside: boolean;
  presidenteDesempata: boolean;
  periodo: string | null;
  presidenteId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response wrapper del backend para GET
 */
export interface DirectoryConfigurationGetResponse {
  success: boolean;
  message: string;
  code: number;
  data: DirectoryConfigurationResponseDTO;
}

/**
 * Response wrapper para PUT (actualizar)
 */
export interface DirectoryConfigurationUpdateResponse {
  success: boolean;
  message: string;
  code: number;
}

