import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../domain";

interface BackendSocietyResponse {
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

export const DatosSociedadMapper = {
  toDomain(response: BackendSocietyResponse | null): SociedadDatosGenerales | null {
    if (!response) return null;
    return {
      idSociety: response.id ?? "",
      numeroRuc: response.ruc ?? "",
      razonSocial: response.reasonSocial ?? "",
      nombreComercial: response.commercialName ?? "",
      tipoSocietario: response.typeSocietyId ?? "",
      direccion: response.address ?? "",
      distrito: response.district ?? "",
      provincia: response.province ?? "",
      departamento: response.department ?? "",
      fechaInscripcionRuc: response.registrationDate ?? "",
      actividadExterior: response.foreignActivity ?? "",
      fechaEscrituraPublica: response.publicDeedDate ?? "",
      fechaRegistrosPublicos: response.publicDeedDate ?? "",
      partidaRegistral: response.registrationRecord ?? "",
      oficinaRegistral: response.registryOffice ?? "",
      createdAt: response.createdAt ?? "",
      updatedAt: response.updatedAt ?? "",
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

