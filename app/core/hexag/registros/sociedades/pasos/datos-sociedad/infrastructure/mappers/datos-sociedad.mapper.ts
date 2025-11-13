import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../domain";

interface DatosSociedadResponse {
  idSociety: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoSocietario: string;
  fechaConstitucion?: string;
  objetoSocial?: string;
  domicilioLegal?: string;
  capitalSocial?: number;
  createdAt: string;
  updatedAt: string;
}

export const DatosSociedadMapper = {
  toDomain(response: DatosSociedadResponse | null): SociedadDatosGenerales | null {
    if (!response) return null;
    return {
      idSociety: response.idSociety,
      razonSocial: response.razonSocial,
      nombreComercial: response.nombreComercial,
      tipoSocietario: response.tipoSocietario,
      fechaConstitucion: response.fechaConstitucion,
      objetoSocial: response.objetoSocial,
      domicilioLegal: response.domicilioLegal,
      capitalSocial: response.capitalSocial,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  toPayload(dto: DatosSociedadDTO): DatosSociedadDTO {
    return { ...dto };
  },
};

export type { DatosSociedadResponse };

