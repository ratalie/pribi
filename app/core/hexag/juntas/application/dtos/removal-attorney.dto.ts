/**
 * DTOs para Remoción de Apoderados
 * Basado en: docs/issues/remociones/REGISTER-ASSEMBLY-REMOCION-COMPLETO-FRONTEND.md
 */

/**
 * DTO para crear/actualizar candidato a remoción (PUT Request)
 * ✅ PUT hace TODO: crear, actualizar, desmarcar
 */
export interface CreateRemovalAttorneyDTO {
  /** UUID del apoderado existente a remover */
  attorneyId: string;

  /** Estado del candidato - PUT hace todo automáticamente */
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR";
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
 * ✅ Estructura real del backend
 */
export interface RemovalAttorneyResponseDTO {
  /** UUID del registro de remoción */
  id: string;

  /** UUID de la clase de apoderado */
  attorneyClassId: string;

  /** Datos de la persona */
  person: {
    id: string;
    type: "NATURAL" | "JURIDIC";
    natural: {
      firstName: string;
      lastNamePaternal: string;
      lastNameMaternal: string | null;
      typeDocument: string;
      documentNumber: string;
      issuingCountry: string | null;
      maritalStatus: string | null;
      maritalRegime: string | null;
      documentNumberConyuge: string | null;
      firstNameConyuge: string | null;
      lastNamePaternalConyuge: string | null;
      lastNameMaternalConyuge: string | null;
    } | null;
    juridic: {
      businessName: string;
      typeDocument: string;
      documentNumber: string;
      issuingCountry: string | null;
    } | null;
  };

  /** Acciones del flujo */
  attorneyFlowActions: Array<{
    id: string;
    candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED";
    actionSetId: string;
  }>;

  /** Indica si es candidato */
  isCandidate: boolean;

  /** Estado del candidato */
  candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;

  /** ID de la acción del flujo */
  flowActionId: string | null;
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
