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

    return {
      idSociety: pick<string>(["id", "idSociety"], ""),
      numeroRuc: pick<string>(["ruc", "numeroRuc"], ""),
      razonSocial: pick<string>(["reasonSocial", "razonSocial"], ""),
      nombreComercial: pick<string>(["commercialName", "nombreComercial"], ""),
      tipoSocietario: pick<string>(["typeSocietyId", "tipoSocietario"], ""),
      direccion: pick<string>(["address", "direccion"], ""),
      distrito: pick<string>(["district", "distrito"], ""),
      provincia: pick<string>(["province", "provincia"], ""),
      departamento: pick<string>(["department", "departamento"], ""),
      fechaInscripcionRuc: pick<string>(["registrationDate", "fechaInscripcionRuc"], ""),
      actividadExterior: pick<string>(["foreignActivity", "actividadExterior"], ""),
      fechaEscrituraPublica: pick<string | null>(
        ["publicDeedDate", "fechaEscrituraPublica"],
        ""
      ) || "",
      fechaRegistrosPublicos: pick<string | null>(
        ["registrationRecordDate", "fechaRegistrosPublicos"],
        ""
      ) || "",
      partidaRegistral: pick<string>(["registrationRecord", "partidaRegistral"], ""),
      oficinaRegistral: pick<string>(["registryOffice", "oficinaRegistral"], ""),
      createdAt: pick<string>(["createdAt"], ""),
      updatedAt: pick<string>(["updatedAt"], ""),
    };
  },

  toPayload(dto: DatosSociedadDTO) {
    return {
      ...(dto.idSociety ? { id: dto.idSociety } : {}),
      ruc: dto.numeroRuc,
      reasonSocial: dto.razonSocial,
      typeSocietyId: dto.tipoSocietario,
      commercialName: dto.nombreComercial,
      address: dto.direccion,
      district: dto.distrito,
      province: dto.provincia,
      department: dto.departamento,
      registrationDate: dto.fechaInscripcionRuc || null,
      foreignActivity: dto.actividadExterior,
      publicDeedDate: dto.fechaEscrituraPublica || null,
      registryOffice: dto.oficinaRegistral,
      registrationRecord: dto.partidaRegistral,
    };
  },
};

export type { BackendSocietyResponse };

