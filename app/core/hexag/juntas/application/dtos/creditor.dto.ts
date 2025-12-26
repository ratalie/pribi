/**
 * DTOs para Acreedores (Creditors)
 * Basado en: docs/backend/REGISTER-ASSEMBLY-CAPITALIZACION-CREDITOS-COMPLETO-FRONTEND.md
 *
 * ⚠️ NOTA: Los endpoints están en v1 (usan números como IDs)
 * En el futuro se migrarán a v2 (usarán UUIDs)
 */

/**
 * DTO de respuesta al obtener acreedores (GET Response)
 */
export interface CreditorResponseDTO {
  id: string; // Número en v1, UUID en v2 futuro
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: {
    id: string;
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

/**
 * DTO para crear acreedor (POST Request)
 */
export interface CreateCreditorDTO {
  contributorType: "ACCIONISTA" | "NUEVO_ACCIONISTA";
  isContributor: boolean;
  isPresent?: boolean;
  contributor: {
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

/**
 * DTO para actualizar acreedor (PUT Request)
 */
export interface UpdateCreditorDTO {
  id: string;
  isContributor?: boolean;
  isPresent?: boolean;
}

/**
 * Response wrapper del backend para listar acreedores
 */
export interface CreditorListResponse {
  success: boolean;
  message: string;
  code: number;
  data: CreditorResponseDTO[];
}

/**
 * Response wrapper para crear acreedor
 */
export interface CreditorCreateResponse {
  success: boolean;
  message: string;
  code: number;
  data: CreditorResponseDTO;
}

/**
 * Response wrapper para actualizar/eliminar acreedor
 */
export interface CreditorActionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: any;
}




