import type {
  CreateDesignationAttorneyDTO,
  PersonNaturalDTO,
  UpdateDesignationAttorneyDTO,
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
 * Mapper para Designación de Apoderados
 *
 * Transforma el DTO interno a la estructura que espera el backend
 */
export class DesignationAttorneyMapper {
  /**
   * Transforma CreateDesignationAttorneyDTO a la estructura que espera el backend
   *
   * Backend espera:
   * {
   *   "attorney": {
   *     "id": "uuid",
   *     "claseApoderadoId": "uuid",
   *     "persona": {
   *       "id": "uuid",
   *       "tipo": "NATURAL",
   *       "nombre": "...",
   *       "apellidoPaterno": "...",
   *       ...
   *     }
   *   },
   *   "candidatoEstado": "CANDIDATO"
   * }
   */
  static toBackendRequest(
    dto: CreateDesignationAttorneyDTO,
    candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE" = "CANDIDATO"
  ): any {
    // Generar UUIDs para attorney y persona
    const attorneyId = generateUUID();
    const personaId = generateUUID();

    // Transformar persona según el tipo
    if ("firstName" in dto.person) {
      // Es PersonNaturalDTO
      const person = dto.person as PersonNaturalDTO;
      // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
      // Enviar strings vacíos "" cuando no hay datos (no null)
      return {
        attorney: {
          id: attorneyId,
          claseApoderadoId: dto.attorneyClassId,
          persona: {
            id: personaId,
            tipo: "NATURAL",
            nombre: person.firstName || "",
            apellidoPaterno: person.lastNamePaternal || "",
            apellidoMaterno: person.lastNameMaternal || "",
            tipoDocumento: person.typeDocument || "",
            numeroDocumento: person.documentNumber || "",
            paisEmision: person.issuingCountry || "",
            // ⚠️ NO incluir: estadoCivil, regimenMatrimonial, numeroDocumentoConyuge, nombreConyuge, etc.
          },
        },
        candidatoEstado,
      };
    } else {
      // Es PersonJuridicDTO
      const person = dto.person as any; // PersonJuridicDTO
      return {
        attorney: {
          id: attorneyId,
          claseApoderadoId: dto.attorneyClassId,
          persona: {
            id: personaId,
            tipo: "JURIDICA",
            razonSocial: person.businessName || "",
            nombreComercial: person.commercialName || "",
            tipoDocumento: person.typeDocument || "",
            numeroDocumento: person.documentNumber || "",
            paisEmision: person.issuingCountry || "",
            direccion: person.address || "",
            distrito: person.district || "",
            provincia: person.province || "",
            departamento: person.department || "",
            paisOrigen: person.countryOfOrigin || "",
            // Representante legal (si existe)
            // ⚠️ NO incluir campos de cónyuge en representante
            representanteLegal: person.representative
              ? {
                  id: generateUUID(),
                  tipo: "NATURAL",
                  nombre: person.representative.firstName || "",
                  apellidoPaterno: person.representative.lastNamePaternal || "",
                  apellidoMaterno: person.representative.lastNameMaternal || "",
                  tipoDocumento: person.representative.typeDocument || "",
                  numeroDocumento: person.representative.documentNumber || "",
                  paisEmision: person.representative.issuingCountry || "",
                  // ⚠️ NO incluir: estadoCivil, regimenMatrimonial, numeroDocumentoConyuge, nombreConyuge, etc.
                }
              : null,
          },
        },
        candidatoEstado,
      };
    }
  }

  /**
   * Transforma UpdateDesignationAttorneyDTO a la estructura que espera el backend (PUT)
   *
   * Backend espera la misma estructura que POST:
   * {
   *   "attorney": {
   *     "id": "uuid",
   *     "claseApoderadoId": "uuid",
   *     "persona": {
   *       "id": "uuid",
   *       "tipo": "NATURAL",
   *       "nombre": "...",
   *       "apellidoPaterno": "...",
   *       ...
   *     }
   *   },
   *   "candidatoEstado": "CANDIDATO"
   * }
   *
   * ⚠️ NOTA: Si `person` está presente, se transforma igual que en POST
   * Si no está presente, solo se envía `attorneyId` y `candidatoEstado`
   */
  static toBackendUpdateRequest(dto: UpdateDesignationAttorneyDTO): any {
    // Si no hay datos de persona, solo enviar estado
    if (!dto.person) {
      return {
        attorneyId: dto.attorneyId,
        candidatoEstado: dto.candidatoEstado,
      };
    }

    // Si hay datos de persona, transformar igual que POST
    // ⚠️ NOTA: Necesitamos el attorneyClassId para construir la estructura completa
    if (!dto.attorneyClassId) {
      throw new Error(
        "attorneyClassId es requerido cuando se actualizan los datos de la persona"
      );
    }

    if ("firstName" in dto.person) {
      // Es PersonNaturalDTO
      const person = dto.person as PersonNaturalDTO;
      return {
        attorneyId: dto.attorneyId, // ⚠️ REQUERIDO: ID del gerente del snapshot
        attorney: {
          id: dto.attorneyId,
          claseApoderadoId: dto.attorneyClassId,
          persona: {
            id: generateUUID(), // ⚠️ El backend puede requerir un nuevo ID o usar el existente
            tipo: "NATURAL",
            nombre: person.firstName || "",
            apellidoPaterno: person.lastNamePaternal || "",
            apellidoMaterno: person.lastNameMaternal || "",
            tipoDocumento: person.typeDocument || "",
            numeroDocumento: person.documentNumber || "",
            paisEmision: person.issuingCountry || "",
            // ⚠️ NO incluir: estadoCivil, regimenMatrimonial, numeroDocumentoConyuge, nombreConyuge, etc.
          },
        },
        candidatoEstado: dto.candidatoEstado,
      };
    } else {
      // Es PersonJuridicDTO
      const person = dto.person as any; // PersonJuridicDTO
      return {
        attorneyId: dto.attorneyId, // ⚠️ REQUERIDO: ID del gerente del snapshot
        attorney: {
          id: dto.attorneyId,
          claseApoderadoId: dto.attorneyClassId,
          persona: {
            id: generateUUID(), // ⚠️ El backend puede requerir un nuevo ID o usar el existente
            tipo: "JURIDICA",
            razonSocial: person.businessName || "",
            nombreComercial: person.commercialName || "",
            tipoDocumento: person.typeDocument || "",
            numeroDocumento: person.documentNumber || "",
            paisEmision: person.issuingCountry || "",
            direccion: person.address || "",
            distrito: person.district || "",
            provincia: person.province || "",
            departamento: person.department || "",
            paisOrigen: person.countryOfOrigin || "",
            // Representante legal (si existe)
            // ⚠️ NO incluir campos de cónyuge en representante
            representanteLegal: person.representative
              ? {
                  id: generateUUID(),
                  tipo: "NATURAL",
                  nombre: person.representative.firstName || "",
                  apellidoPaterno: person.representative.lastNamePaternal || "",
                  apellidoMaterno: person.representative.lastNameMaternal || "",
                  tipoDocumento: person.representative.typeDocument || "",
                  numeroDocumento: person.representative.documentNumber || "",
                  paisEmision: person.representative.issuingCountry || "",
                  // ⚠️ NO incluir: estadoCivil, regimenMatrimonial, numeroDocumentoConyuge, nombreConyuge, etc.
                }
              : null,
          },
        },
        candidatoEstado: dto.candidatoEstado,
      };
    }
  }
}
