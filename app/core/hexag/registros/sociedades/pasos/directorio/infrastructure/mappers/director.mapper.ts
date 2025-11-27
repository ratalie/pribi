import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { DirectorDTO } from "../../application/dtos/director.dto";
import type { DirectorConfig } from "../../domain/entities/director.entity";
import { TipoDirector } from "../../domain/enums/director-tipo.enum";

type BackendDirectorResponse =
  | (Partial<DirectorDTO> & { id?: string; createdAt?: string; updatedAt?: string })
  | null
  | undefined;

const normalizeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const normalizeTipoDocumento = (value: unknown): TipoDocumentosEnum => {
  const str = normalizeString(value).toUpperCase();
  if (str === "DNI") return "DNI" as TipoDocumentosEnum;
  if (str === "PASAPORTE") return "Pasaporte" as TipoDocumentosEnum;
  if (str === "CARNET_EXTRANJERIA" || str === "CARNET DE EXTRANJERÍA") {
    return "Carnet de Extranjería" as TipoDocumentosEnum;
  }
  return "DNI" as TipoDocumentosEnum; // fallback
};

const normalizeRolDirector = (value: unknown): TipoDirector => {
  const str = normalizeString(value).toUpperCase();
  if (str === "TITULAR") return TipoDirector.TITULAR;
  if (str === "SUPLENTE") return TipoDirector.SUPLENTE;
  if (str === "ALTERNO") return TipoDirector.ALTERNO;
  return TipoDirector.TITULAR; // fallback
};

export const DirectorMapper = {
  toDomain(response: BackendDirectorResponse): DirectorConfig | null {
    if (!response) {
      return null;
    }

    // El backend puede devolver persona como objeto o como relación
    // También puede usar 'nombre' o 'firstName'
    // Si persona es undefined, el backend no cargó la relación (bug del backend)
    const persona = response.persona || (response as any).person;

    // Si persona es undefined, retornar null para que se filtre
    // Esto evita que el frontend falle, pero el problema real está en el backend
    if (!persona) {
      console.warn(
        "[DirectorMapper] Persona no encontrada en respuesta del backend:",
        response
      );
      return null;
    }

    const nombre = persona.nombre || persona.firstName || "";
    const apellidoPaterno =
      persona.apellidoPaterno || persona.lastName || persona.firstLastName || "";
    const apellidoMaterno =
      persona.apellidoMaterno || persona.middleName || persona.secondLastName || "";

    return {
      id: response.id ?? "",
      persona: {
        id: persona.id ?? "",
        nombre: normalizeString(nombre),
        apellidoPaterno: normalizeString(apellidoPaterno),
        apellidoMaterno: normalizeString(apellidoMaterno),
        numeroDocumento: normalizeString(
          persona.numeroDocumento || persona.documentNumber || ""
        ),
        tipoDocumento: normalizeTipoDocumento(persona.tipoDocumento || persona.documentType),
        paisEmision: normalizeString(persona.paisEmision || persona.country || ""),
      },
      rolDirector: normalizeRolDirector(response.rolDirector),
      reemplazaId: response.reemplazaId ?? null,
      createdAt: response.createdAt ?? new Date().toISOString(),
      updatedAt: response.updatedAt ?? new Date().toISOString(),
    };
  },

  toPayload(dto: DirectorDTO) {
    // Convertir rolDirector a mayúsculas (backend espera "TITULAR" | "SUPLENTE" | "ALTERNO")
    const rolDirectorUpper = dto.rolDirector.toUpperCase() as
      | "TITULAR"
      | "SUPLENTE"
      | "ALTERNO";

    // Convertir tipoDocumento al formato que espera el backend
    // Backend puede esperar: "DNI" | "PASAPORTE" | "CARNET_EXTRANJERIA"
    const tipoDocMap: Record<string, string> = {
      DNI: "DNI",
      Pasaporte: "PASAPORTE",
      "Carnet de Extranjería": "CARNET_EXTRANJERIA",
    };
    const tipoDocumentoBackend =
      tipoDocMap[dto.persona?.tipoDocumento || ""] || dto.persona?.tipoDocumento || "DNI";

    const payload: Record<string, unknown> = {
      // Siempre incluir id (generado en frontend o existente)
      id: dto.id || "",
      persona: {
        // Siempre incluir persona.id (generado en frontend o existente)
        id: dto.persona?.id || "",
        nombre: dto.persona?.nombre || "",
        apellidoPaterno: dto.persona?.apellidoPaterno || "",
        apellidoMaterno: dto.persona?.apellidoMaterno || "",
        numeroDocumento: dto.persona?.numeroDocumento || "",
        tipoDocumento: tipoDocumentoBackend,
      },
      rolDirector: rolDirectorUpper,
    };

    // Solo incluir reemplazaId si tiene valor (no enviar null)
    if (dto.reemplazaId) {
      payload.reemplazaId = dto.reemplazaId;
    }

    return payload;
  },
};
