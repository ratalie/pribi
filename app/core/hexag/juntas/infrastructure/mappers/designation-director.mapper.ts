import type {
  CreateDesignationDirectorDTO,
  DesignationDirectorResponseDTO,
  UpdateDesignationDirectorDTO,
} from "../../application/dtos/designation-director.dto";

// Reutilizar tipos de personas de designation-attorney
import type {
  PersonJuridicDTO,
  PersonNaturalDTO,
} from "../../application/dtos/designation-attorney.dto";

/**
 * Helper para generar UUID (compatible con navegador y Node.js)
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback para entornos sin crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mapper para Designación de Directores
 *
 * Transforma el DTO interno a la estructura que espera el backend
 */
export class DesignationDirectorMapper {
  /**
   * Transforma CreateDesignationDirectorDTO a la estructura que espera el backend (POST)
   *
   * ⚠️ IMPORTANTE: El backend espera campos en ESPAÑOL para POST:
   * - "persona" (no "person")
   * - "rolDirector" (no "directorRole")
   * - "candidatoEstado" (no "candidateStatus")
   *
   * Backend espera:
   * {
   *   "director": {
   *     "id": "uuid" (generado frontend o directorId existente),
   *     "persona": {
   *       "id": "uuid",
   *       "tipo": "NATURAL",
   *       "nombre": "...",
   *       "apellidoPaterno": "...",
   *       "apellidoMaterno": "...",
   *       "tipoDocumento": "...",
   *       "numeroDocumento": "...",
   *       "paisEmision": "..."
   *     } | null (null si director existe),
   *     "rolDirector": "TITULAR" | "SUPLENTE" | "ALTERNO",
   *     "reemplazaId": "uuid" | null (solo para ALTERNO)
   *   },
   *   "candidatoEstado": "CANDIDATO" | "DESIGNADO_DIRECTAMENTE"
   * }
   */
  static toBackendRequest(dto: CreateDesignationDirectorDTO): any {
    const directorId = dto.director.id || generateUUID();
    const personaId = generateUUID();

    // Si person es null, significa que es un director existente (solo se envía el ID)
    if (!dto.director.person) {
      return {
        director: {
          id: directorId, // ID del director existente
        },
        candidatoEstado: dto.candidateStatus, // ✅ Usar "candidatoEstado" en español
      };
    }

    // Transformar persona según el tipo
    const person = dto.director.person as PersonNaturalDTO | PersonJuridicDTO;

    if ("firstName" in person) {
      // Es PersonNaturalDTO
      const personNatural = person as PersonNaturalDTO;
      return {
        director: {
          id: directorId,
          persona: {
            // ✅ Usar "persona" en lugar de "person"
            id: personaId,
            tipo: "NATURAL",
            nombre: personNatural.firstName || "",
            apellidoPaterno: personNatural.lastNamePaternal || "",
            apellidoMaterno: personNatural.lastNameMaternal || "",
            tipoDocumento: personNatural.typeDocument || "",
            numeroDocumento: personNatural.documentNumber || "",
            paisEmision: personNatural.issuingCountry || "",
          },
          rolDirector: dto.director.directorRole, // ✅ Usar "rolDirector" en lugar de "directorRole"
          ...(dto.director.replacesId ? { reemplazaId: dto.director.replacesId } : {}), // ✅ Usar "reemplazaId" en lugar de "replacesId"
        },
        candidatoEstado: dto.candidateStatus, // ✅ Usar "candidatoEstado" en lugar de "candidateStatus"
      };
    } else {
      // Es PersonJuridicDTO
      const personJuridic = person as PersonJuridicDTO;
      return {
        director: {
          id: directorId,
          persona: {
            // ✅ Usar "persona" en lugar de "person"
            id: personaId,
            tipo: "JURIDIC",
            razonSocial: personJuridic.businessName || "",
            nombreComercial: personJuridic.commercialName || "",
            tipoDocumento: personJuridic.typeDocument || "",
            numeroDocumento: personJuridic.documentNumber || "",
            paisEmision: personJuridic.issuingCountry || "",
            direccion: personJuridic.address || "",
            distrito: personJuridic.district || "",
            provincia: personJuridic.province || "",
            departamento: personJuridic.department || "",
            paisOrigen: personJuridic.countryOfOrigin || "",
            // Representante legal (si existe)
            representanteLegal: personJuridic.representative
              ? {
                  id: generateUUID(),
                  tipo: "NATURAL",
                  nombre: personJuridic.representative.firstName || "",
                  apellidoPaterno: personJuridic.representative.lastNamePaternal || "",
                  apellidoMaterno: personJuridic.representative.lastNameMaternal || "",
                  tipoDocumento: personJuridic.representative.typeDocument || "",
                  numeroDocumento: personJuridic.representative.documentNumber || "",
                  paisEmision: personJuridic.representative.issuingCountry || "",
                }
              : null,
          },
          rolDirector: dto.director.directorRole, // ✅ Usar "rolDirector" en lugar de "directorRole"
          ...(dto.director.replacesId ? { reemplazaId: dto.director.replacesId } : {}), // ✅ Usar "reemplazaId" en lugar de "replacesId"
        },
        candidatoEstado: dto.candidateStatus, // ✅ Usar "candidatoEstado" en lugar de "candidateStatus"
      };
    }
  }

  /**
   * Transforma UpdateDesignationDirectorDTO a la estructura que espera el backend (PUT)
   *
   * Backend espera:
   * {
   *   "directorId": "uuid" (ID del DirectorFlowAction),
   *   "candidatoEstado": "ELEGIDO" | "NO_ELEGIDO"
   * }
   */
  static toBackendUpdateRequest(dto: UpdateDesignationDirectorDTO): any {
    return {
      directorId: dto.directorId,
      candidatoEstado: dto.candidatoEstado,
    };
  }

  /**
   * Transforma la respuesta del backend (GET) al DTO interno
   *
   * ⚠️ IMPORTANTE: El GET devuelve campos en INGLÉS:
   * - "person" (con "natural.firstName", "natural.lastNamePaternal", etc.)
   * - "directorRole" (se mantiene igual)
   * - "candidateStatus" (valores: "CANDIDATE", "ELECTED", "NOT_ELECTED", "DIRECT_APPOINTED")
   *
   * Se transforma a:
   * - "person" con campos en español: "nombre", "apellidoPaterno", etc.
   * - "directorRole" (se mantiene igual)
   * - "designationStatus" con valores traducidos: "CANDIDATO", "ELEGIDO", etc.
   */
  static fromBackendResponse(
    backendData: any
  ): import("../../application/dtos/designation-director.dto").DesignationDirectorResponseDTO {
    const person = backendData.person || {};
    const natural = person.natural || {};
    const juridic = person.juridic || {};

    // Mapear candidateStatus del backend (inglés) a designationStatus (español)
    const candidateStatusMap: Record<
      string,
      "CANDIDATO" | "DESIGNADO_DIRECTAMENTE" | "ELEGIDO" | "NO_ELEGIDO" | null
    > = {
      CANDIDATE: "CANDIDATO",
      DIRECT_APPOINTED: "DESIGNADO_DIRECTAMENTE",
      ELECTED: "ELEGIDO",
      NOT_ELECTED: "NO_ELEGIDO",
    };
    const designationStatus = candidateStatusMap[backendData.candidateStatus] || null;

    // Mapear datos de persona (del formato inglés al español)
    let personMapped: {
      id: string;
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      tipoDocumento: string;
      numeroDocumento: string;
    };

    if (person.type === "NATURAL" || natural.firstName) {
      // Persona natural
      personMapped = {
        id: person.id || "",
        nombre: natural.firstName || "",
        apellidoPaterno: natural.lastNamePaternal || "",
        apellidoMaterno: natural.lastNameMaternal || "",
        tipoDocumento: natural.typeDocument || "",
        numeroDocumento: natural.documentNumber || "",
      };
    } else {
      // Persona jurídica (si aplica en el futuro)
      // Por ahora, usar valores por defecto si no hay natural
      personMapped = {
        id: person.id || "",
        nombre: juridic.businessName || "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        tipoDocumento: juridic.typeDocument || "",
        numeroDocumento: juridic.documentNumber || "",
      };
    }

    // ⚠️ IMPORTANTE: Según la documentación del GET, el backend devuelve:
    // - "id": ID del DirectorFlowAction (registro de designación) - este es el "id" que usamos en el DTO
    // - No hay un campo "directorId" explícito en la respuesta, así que usamos el mismo "id"
    // En el contexto de nombramiento, el "id" del DirectorFlowAction también identifica al director
    return {
      id: backendData.id || "", // ID del DirectorFlowAction (registro de designación)
      directorId: backendData.id || "", // Usar el mismo id (en nombramiento, el DirectorFlowAction.id identifica al director)
      person: personMapped,
      directorRole: backendData.directorRole as "TITULAR" | "SUPLENTE" | "ALTERNO",
      isCandidate: backendData.isCandidate || false,
      isDesignationCandidate: backendData.isCandidate || false,
      isDesignated: backendData.isCandidate !== undefined,
      designationStatus,
      replacesId: backendData.replacesId || null,
    };
  }

  /**
   * Transforma array de respuestas del backend a array de DTOs
   */
  static fromBackendResponseArray(backendDataArray: any[]): DesignationDirectorResponseDTO[] {
    return backendDataArray.map((item) => this.fromBackendResponse(item));
  }
}
