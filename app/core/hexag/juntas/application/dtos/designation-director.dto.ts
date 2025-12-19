/**
 * DTOs para Designación de Directores (Nombramiento)
 * Basado en: docs/backend/directorio y directores/ESTRUCTURA-COMPLETA-NOMBRAMIENTO-DIRECTORES.md
 */

// Reutilizar DTOs de personas de designation-attorney
import type { PersonJuridicDTO, PersonNaturalDTO } from "./designation-attorney.dto";

/**
 * DTO para crear nuevo director (POST Request)
 * Crea nuevo director y DirectorFlowAction con candidateStatus: CANDIDATO o DESIGNADO_DIRECTAMENTE
 */
export interface CreateDesignationDirectorDTO {
  director: {
    /** UUID generado por frontend (nuevo director) o directorId existente (director del snapshot) */
    id?: string;

    /** Datos de la persona (Natural o Jurídica) - null si director existe */
    person: PersonNaturalDTO | PersonJuridicDTO | null;

    /** Rol del director */
    directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";

    /** ID del director TITULAR al que reemplaza (solo para ALTERNO) */
    replacesId?: string | null;
  };

  /** Estado del candidato */
  candidateStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE";
}

/**
 * DTO para actualizar estado de director (PUT Request)
 */
export interface UpdateDesignationDirectorDTO {
  /** ID del DirectorFlowAction (no el directorId) */
  directorId: string;

  /** Nuevo estado del candidato */
  candidatoEstado: "ELEGIDO" | "NO_ELEGIDO";
}

/**
 * DTO de respuesta al obtener directores para designación (GET Response)
 */
export interface DesignationDirectorResponseDTO {
  /** ID del DirectorFlowAction (registro de designación) */
  id: string;

  /** ID del DirectorV2 (director en el registro) */
  directorId: string;

  /** Datos de la persona */
  person: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };

  /** Rol del director */
  directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO";

  /** Si es candidato */
  isCandidate: boolean;

  /** Si es candidato a designación */
  isDesignationCandidate: boolean;

  /** Si está designado */
  isDesignated: boolean;

  /** Estado de designación */
  designationStatus: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE" | "ELEGIDO" | "NO_ELEGIDO" | null;

  /** ID del director TITULAR al que reemplaza (solo para ALTERNO) */
  replacesId: string | null;
}

/**
 * Response wrapper del backend para listar
 */
export interface DesignationDirectorListResponse {
  success: boolean;
  message: string;
  code: number;
  data: DesignationDirectorResponseDTO[];
}

/**
 * Response wrapper para crear/actualizar
 */
export interface DesignationDirectorActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}

