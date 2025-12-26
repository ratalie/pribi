/**
 * DTOs para Designación de Apoderados (Nombramiento)
 * Basado en: docs/backend/nombramientos/ANALISIS-NOMBRAMIENTO-GERENTE-APODERADOS.md
 */

/**
 * DTO para crear nuevo apoderado (POST Request)
 * Crea nuevo apoderado y AttorneyFlowAction con candidateStatus: CANDIDATE o DIRECT_APPOINTED
 */
export interface CreateDesignationAttorneyDTO {
  /** UUID de la clase de apoderado (ej: "Gerente General") */
  attorneyClassId: string;

  /** Datos de la persona (Natural o Jurídica) */
  person: PersonNaturalDTO | PersonJuridicDTO;
}

/**
 * DTO para Persona Natural
 * 
 * ⚠️ IMPORTANTE: No incluye campos de cónyuge
 * Los apoderados, gerentes generales y directores NO tienen cónyuge
 */
export interface PersonNaturalDTO {
  /** Tipo de documento (DNI, PASAPORTE, etc.) */
  typeDocument: string;

  /** Número de documento */
  documentNumber: string;

  /** País de emisión (solo para PASAPORTE) */
  issuingCountry?: string | null;

  /** Nombre */
  firstName: string;

  /** Apellido paterno */
  lastNamePaternal: string;

  /** Apellido materno */
  lastNameMaternal?: string | null;
}

/**
 * DTO para Persona Jurídica
 */
export interface PersonJuridicDTO {
  /** Tipo de documento */
  typeDocument: string;

  /** Número de documento (RUC) */
  documentNumber: string;

  /** País de emisión */
  issuingCountry?: string | null;

  /** Razón social */
  businessName: string;

  /** Nombre comercial (opcional) */
  commercialName?: string | null;

  /** Dirección */
  address?: string | null;

  /** Distrito */
  district?: string | null;

  /** Provincia */
  province?: string | null;

  /** Departamento */
  department?: string | null;

  /** País de origen */
  countryOfOrigin?: string | null;

  /** Representante legal (opcional) */
  representative?: PersonNaturalDTO | null;
}

/**
 * DTO para actualizar apoderado designado (PUT Request)
 * 
 * ⚠️ NOTA: Según documentación, el PUT puede actualizar:
 * - Estado del candidato (candidatoEstado)
 * - Datos de la persona (person) - Verificar con backend
 */
export interface UpdateDesignationAttorneyDTO {
  /** UUID del apoderado a actualizar */
  attorneyId: string;

  /** UUID de la clase de apoderado (necesario para el mapper) */
  attorneyClassId?: string;

  /** Estado del candidato */
  candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR";

  /** Datos de la persona (opcional - verificar si el backend lo acepta) */
  person?: PersonNaturalDTO | PersonJuridicDTO;
}

/**
 * DTO de respuesta al obtener apoderados para designación (GET Response)
 * Similar a RemovalAttorneyResponseDTO pero para designación
 */
export interface DesignationAttorneyResponseDTO {
  /** UUID del registro de designación */
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
      // ⚠️ NO incluir campos de cónyuge (maritalStatus, maritalRegime, etc.)
      // Los apoderados, gerentes generales y directores NO tienen cónyuge
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
    candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED";
    actionSetId: string;
  }>;

  /** Indica si es candidato */
  isCandidate: boolean;

  /** Estado del candidato */
  candidateStatus: "CANDIDATE" | "ELECTED" | "NOT_ELECTED" | "DIRECT_APPOINTED" | null;

  /** ID de la acción del flujo */
  flowActionId: string | null;
}

/**
 * Response wrapper del backend para listar
 */
export interface DesignationAttorneyListResponse {
  success: boolean;
  message: string;
  code: number;
  data: DesignationAttorneyResponseDTO[];
}

/**
 * Response wrapper para crear/actualizar
 */
export interface DesignationAttorneyActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}

