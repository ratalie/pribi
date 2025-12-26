import type { RemovalAttorneyResponseDTO } from "../../application/dtos/removal-attorney.dto";

/**
 * Mapper: RemovalAttorney
 *
 * Convierte entre la respuesta del backend (formato inglés/anidado) y el DTO esperado
 */
export class RemovalAttorneyMapper {
  /**
   * Convertir respuesta del backend a DTO
   *
   * Backend devuelve:
   * {
   *   id: string,
   *   attorneyClassId: string,
   *   person: { id, type, natural: { firstName, lastNamePaternal, ... } },
   *   isCandidate: boolean,
   *   attorneyFlowActions: Array<{ id, candidateStatus, actionSetId }>,
   *   candidateStatus: string | null,
   *   flowActionId: string | null,
   *   // ✅ Campos nuevos
   *   isRemovalCandidate: boolean,
   *   isRemoved: boolean,
   *   removalStatus: string | null
   * }
   *
   * DTO espera:
   * {
   *   id: string,
   *   attorneyClassId: string,
   *   person: { ... },
   *   attorneyFlowActions: Array<{ ... }>,
   *   isCandidate: boolean,
   *   candidateStatus: string | null,
   *   flowActionId: string | null,
   *   // ✅ Campos nuevos
   *   isRemovalCandidate?: boolean,
   *   isRemoved?: boolean,
   *   removalStatus?: string | null
   * }
   */
  static fromBackendResponse(backendData: any): RemovalAttorneyResponseDTO {
    const attorneyFlowActions = backendData.attorneyFlowActions || [];
    const firstFlowAction = attorneyFlowActions.length > 0 ? attorneyFlowActions[0] : null;
    const candidateStatus =
      backendData.candidateStatus ||
      firstFlowAction?.candidateStatus ||
      (backendData.isCandidate ? "CANDIDATE" : null);

    // ✅ Versión simplificada: Solo mapear los 3 campos necesarios del backend
    // El backend devuelve: isCandidate, candidateStatus, flowActionId
    return {
      id: backendData.id || "",
      attorneyClassId: backendData.attorneyClassId || "",
      person: backendData.person || {
        id: "",
        type: "NATURAL" as const,
        natural: null,
        juridic: null,
      },
      attorneyFlowActions: attorneyFlowActions.map((action: any) => ({
        id: action.id || "",
        candidateStatus: action.candidateStatus || "CANDIDATE",
        actionSetId: action.actionSetId || "",
      })),
      // ✅ Solo 3 campos necesarios según documentación simplificada
      isCandidate: backendData.isCandidate || false,
      candidateStatus: candidateStatus || null,
      flowActionId: firstFlowAction?.id || null,
      // ✅ Campos nuevos (opcionales, no se usan pero se mantienen para compatibilidad)
      isRemovalCandidate: undefined,
      isRemoved: undefined,
      removalStatus: undefined,
    };
  }

  /**
   * Convertir array de respuestas del backend a array de DTOs
   */
  static fromBackendResponseArray(backendDataArray: any[]): RemovalAttorneyResponseDTO[] {
    return backendDataArray.map((item) => this.fromBackendResponse(item));
  }
}

