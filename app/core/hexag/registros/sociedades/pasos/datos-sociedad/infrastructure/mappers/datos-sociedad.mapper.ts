import { normalizeRegistryOfficeCode, normalizeTypeSocietyCode } from "~/constants/inputs/enum-helpers";
import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../domain";

type BackendSocietyResponse =
  | {
      id?: string;
      ruc?: string;
      reasonSocial?: string;
      typeSocietyId?: string;
      commercialName?: string;
      address?: string;
      district?: string;
      province?: string;
      department?: string;
      registrationDate?: string;
      foreignActivity?: string;
      publicDeedDate?: string | null;
      registryOffice?: string;
      registrationRecord?: string;
      createdAt?: string;
      updatedAt?: string;
    }
  | {
      idSociety?: string;
      numeroRuc?: string;
      razonSocial?: string;
      tipoSocietario?: string;
      nombreComercial?: string;
      direccion?: string;
      distrito?: string;
      provincia?: string;
      departamento?: string;
      fechaInscripcionRuc?: string;
      actividadExterior?: string;
      fechaEscrituraPublica?: string | null;
      fechaRegistrosPublicos?: string | null;
      oficinaRegistral?: string;
      partidaRegistral?: string;
      createdAt?: string;
      updatedAt?: string;
    };

export const DatosSociedadMapper = {
  toDomain(response: BackendSocietyResponse | null): SociedadDatosGenerales | null {
    if (!response) return null;
    const source = response as Record<string, unknown>;
    const pick = <T = string>(keys: Array<string>, fallback: T): T => {
      for (const key of keys) {
        if (key in source) {
          const value = source[key];
          if (value !== undefined && value !== null) {
            return value as T;
          }
        }
      }
      return fallback;
    };

    const toDateValue = (value: unknown): string => {
      if (typeof value !== "string") return "";
      if (value.length === 0) return "";
      const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
      return isoMatch ? isoMatch[0] : value;
    };

    return {
      idSociety: pick<string>(["id", "idSociety"], ""),
      numeroRuc: pick<string>(["ruc", "numeroRuc"], ""),
      razonSocial: pick<string>(["reasonSocial", "razonSocial"], ""),
      nombreComercial: pick<string>(["commercialName", "nombreComercial"], ""),
      tipoSocietario: normalizeTypeSocietyCode(
        pick<string>(["typeSociety", "typeSocietyId", "tipoSociedad", "tipoSocietario"], "")
      ),
      direccion: pick<string>(["address", "direccion"], ""),
      distrito: pick<string>(["district", "distrito"], ""),
      provincia: pick<string>(["province", "provincia"], ""),
      departamento: pick<string>(["department", "departamento"], ""),
      fechaInscripcionRuc: toDateValue(
        pick<string>(["registrationDate", "fechaRegistro", "fechaInscripcionRuc"], "")
      ),
      actividadExterior: pick<string>(
        ["foreignActivity", "actividadExtranjera", "actividadExterior"],
        ""
      ),
      fechaEscrituraPublica: toDateValue(
        pick<string | null>(
          ["publicDeedDate", "fechaEscritura", "fechaEscrituraPublica"],
          ""
        ) || ""
      ),
      fechaRegistrosPublicos: toDateValue(
        pick<string | null>(
          [
            "registrationRecordDate",
            "fechaRegistrosPublicos",
            "fechaRegistroPublico",
            "fechaRegistros",
          ],
          ""
        ) || ""
      ),
      partidaRegistral: pick<string>(["registrationRecord", "partidaRegistral"], ""),
      oficinaRegistral: normalizeRegistryOfficeCode(
        pick<string>(["registryOffice", "oficinaRegistral"], "")
      ),
      createdAt: pick<string>(["createdAt"], ""),
      updatedAt: pick<string>(["updatedAt"], ""),
    };
  },

  toPayload(dto: DatosSociedadDTO) {
    const payload = {
      ruc: dto.numeroRuc,
      razonSocial: dto.razonSocial,
      tipoSociedad: normalizeTypeSocietyCode(dto.tipoSocietario),
      nombreComercial: dto.nombreComercial,
      direccion: dto.direccion,
      distrito: dto.distrito,
      provincia: dto.provincia,
      departamento: dto.departamento,
      fechaRegistro: dto.fechaInscripcionRuc || null,
      actividadExtranjera: dto.actividadExterior,
      fechaEscritura: dto.fechaEscrituraPublica || null,
      oficinaRegistral: normalizeRegistryOfficeCode(dto.oficinaRegistral),
      partidaRegistral: dto.partidaRegistral,
    };

    return payload;
  },
};

export type { BackendSocietyResponse };

