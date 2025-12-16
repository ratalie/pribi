import type { RemovalDirectorResponseDTO } from "../../application/dtos/removal-director.dto";

/**
 * Mapper: RemovalDirector
 *
 * Convierte entre la respuesta del backend (formato inglés/anidado) y el DTO esperado
 */
export class RemovalDirectorMapper {
  /**
   * Convertir respuesta del backend a DTO
   *
   * Backend devuelve:
   * {
   *   id: string,
   *   person: { id, type, natural: { firstName, lastNamePaternal, ... } },
   *   directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO",
   *   replacesId: string | null,
   *   isCandidate: boolean,
   *   flowActions: Array<{ id?, candidateStatus, actionSetId? }>
   * }
   *
   * DTO espera:
   * {
   *   id: string,
   *   persona: { id, nombre, apellidoPaterno, ... },
   *   rolDirector: "TITULAR" | "SUPLENTE" | "ALTERNO",
   *   reemplazaId: string | null,
   *   isCandidate: boolean,
   *   flowActions: Array<{ id?, candidateStatus, actionSetId? }>,
   *   candidateStatus?: string | null,
   *   flowActionId?: string | null
   * }
   */
  static fromBackendResponse(backendData: any): RemovalDirectorResponseDTO {
    const person = backendData.person || {};
    const natural = person.natural || {};
    const juridic = person.juridic || {};

    // Determinar si es persona natural o jurídica
    const isNatural = person.type === "NATURAL" || !!natural.firstName;

    // Mapear datos de persona
    let persona: RemovalDirectorResponseDTO["persona"];
    if (isNatural) {
      persona = {
        id: person.id || "",
        nombre: natural.firstName || natural.nombre || "",
        apellidoPaterno: natural.lastNamePaternal || natural.apellidoPaterno || "",
        apellidoMaterno: natural.lastNameMaternal || natural.apellidoMaterno || null,
        tipoDocumento: natural.typeDocument || natural.tipoDocumento || "",
        numeroDocumento: natural.documentNumber || natural.numeroDocumento || "",
        paisEmision: natural.issuingCountry || natural.paisEmision || null,
      };
    } else {
      // Persona jurídica
      persona = {
        id: person.id || "",
        nombre: juridic.businessName || juridic.razonSocial || "",
        apellidoPaterno: "",
        apellidoMaterno: null,
        tipoDocumento: juridic.typeDocument || juridic.tipoDocumento || "",
        numeroDocumento: juridic.documentNumber || juridic.numeroDocumento || "",
        paisEmision: juridic.issuingCountry || juridic.paisEmision || null,
      };
    }

    // Obtener candidateStatus desde flowActions o directamente
    const flowActions = backendData.flowActions || [];
    const firstFlowAction = flowActions.length > 0 ? flowActions[0] : null;
    const candidateStatus =
      backendData.candidateStatus ||
      firstFlowAction?.candidateStatus ||
      (backendData.isCandidate ? "CANDIDATE" : null);

    return {
      id: backendData.id || "",
      persona,
      rolDirector: (backendData.directorRole || backendData.rolDirector || "TITULAR") as
        | "TITULAR"
        | "SUPLENTE"
        | "ALTERNO",
      reemplazaId: backendData.replacesId || backendData.reemplazaId || null,
      isCandidate: backendData.isCandidate || false,
      flowActions: flowActions.map((action: any) => ({
        id: action.id,
        candidateStatus: action.candidateStatus,
        actionSetId: action.actionSetId,
      })),
      candidateStatus: candidateStatus || null,
      flowActionId: firstFlowAction?.id || null,
    };
  }

  /**
   * Convertir array de respuestas del backend a array de DTOs
   */
  static fromBackendResponseArray(backendDataArray: any[]): RemovalDirectorResponseDTO[] {
    return backendDataArray.map((item) => this.fromBackendResponse(item));
  }
}

