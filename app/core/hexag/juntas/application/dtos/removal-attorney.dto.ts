/**
 * DTOs para Remoción de Apoderados
 * Basado en: docs/issues/remociones/REGISTER-ASSEMBLY-REMOCION-COMPLETO-FRONTEND.md
 */

/**
 * DTO para crear candidato a remoción (POST Request)
 */
export interface CreateRemovalAttorneyDTO {
  /** UUID del apoderado existente a remover */
  attorneyId: string;

  /** Estado del candidato */
  candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

/**
 * DTO para actualizar estado de candidato (PUT Request)
 */
export interface UpdateRemovalAttorneyDTO {
  /** UUID del apoderado a actualizar */
  attorneyId: string;

  /** Estado del candidato después de votación */
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

/**
 * DTO de respuesta al obtener apoderados para remoción (GET Response)
 */
export interface RemovalAttorneyResponseDTO {
  /** UUID del registro de remoción */
  id: string;

  /** UUID del apoderado */
  attorneyId: string;

  /** Datos de la persona */
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    razonSocial?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  };

  /** Clase de apoderado */
  claseApoderado: {
    id: string;
    nombre: string;
  };

  /** Acciones del flujo */
  attorneyFlowActions: Array<{
    id: string;
    candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED";
    actionSetId: string;
  }>;
}

/**
 * Response wrapper del backend
 */
export interface RemovalAttorneyListResponse {
  success: boolean;
  message: string;
  code: number;
  data: RemovalAttorneyResponseDTO[];
}

/**
 * Response wrapper para crear/actualizar
 */
export interface RemovalAttorneyActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}
