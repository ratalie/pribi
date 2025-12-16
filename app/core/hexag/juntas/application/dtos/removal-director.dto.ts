/**
 * DTOs para Remoción de Directores
 * Basado en: docs/backend/REMOCION-DIRECTORES-COMPLETO.md
 */

/**
 * DTO para crear/actualizar candidato a remoción (PUT Request)
 * ✅ PUT hace TODO: crear, actualizar, desmarcar
 */
export interface CreateRemovalDirectorDTO {
  /** UUID del director existente a remover */
  directorId: string;

  /** Estado del candidato - PUT hace todo automáticamente */
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR";
}

/**
 * DTO para actualizar estado de candidato (PUT Request)
 */
export interface UpdateRemovalDirectorDTO {
  /** UUID del director a actualizar */
  directorId: string;

  /** Estado del candidato después de votación */
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

/**
 * DTO de respuesta al obtener directores para remoción (GET Response)
 * ✅ Estructura basada en la documentación del backend
 *
 * Nota: El `id` en la respuesta es el `directorId` que se usa en POST/PUT
 */
export interface RemovalDirectorResponseDTO {
  /** UUID del director (este es el directorId que se usa en POST/PUT) */
  id: string;

  /** Datos de la persona */
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  };

  /** Rol del director */
  rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO";

  /** ID del director que reemplaza (si aplica) */
  reemplazaId?: string | null;

  /** Indica si es candidato */
  isCandidate: boolean;

  /** Acciones del flujo */
  flowActions: Array<{
    id?: string;
    candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED";
    actionSetId?: string;
  }>;

  /** Estado del candidato (puede venir directamente o en flowActions) */
  candidateStatus?: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;

  /** ID de la acción del flujo */
  flowActionId?: string | null;
}

/**
 * Response wrapper del backend
 */
export interface RemovalDirectorListResponse {
  success: boolean;
  message: string;
  code: number;
  data: RemovalDirectorResponseDTO[];
}

/**
 * Response wrapper para crear/actualizar
 */
export interface RemovalDirectorActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}
