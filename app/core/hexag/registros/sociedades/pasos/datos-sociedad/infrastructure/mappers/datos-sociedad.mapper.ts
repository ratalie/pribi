import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../domain";

interface DatosSociedadResponse {
  idSociety: string;
  numeroRuc: string;
  razonSocial: string;
  nombreComercial?: string;
  tipoSocietario: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  fechaInscripcionRuc?: string;
  actividadExterior?: string;
  fechaEscrituraPublica?: string;
  fechaRegistrosPublicos?: string;
  partidaRegistral?: string;
  oficinaRegistral?: string;
  createdAt: string;
  updatedAt: string;
}

export const DatosSociedadMapper = {
  toDomain(response: DatosSociedadResponse | null): SociedadDatosGenerales | null {
    if (!response) return null;
    return {
      idSociety: response.idSociety,
      numeroRuc: response.numeroRuc ?? "",
      razonSocial: response.razonSocial,
      nombreComercial: response.nombreComercial ?? "",
      tipoSocietario: response.tipoSocietario,
      direccion: response.direccion ?? "",
      distrito: response.distrito ?? "",
      provincia: response.provincia ?? "",
      departamento: response.departamento ?? "",
      fechaInscripcionRuc: response.fechaInscripcionRuc ?? "",
      actividadExterior: response.actividadExterior ?? "",
      fechaEscrituraPublica: response.fechaEscrituraPublica ?? "",
      fechaRegistrosPublicos: response.fechaRegistrosPublicos ?? "",
      partidaRegistral: response.partidaRegistral ?? "",
      oficinaRegistral: response.oficinaRegistral ?? "",
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  toPayload(dto: DatosSociedadDTO): DatosSociedadDTO {
    return { ...dto };
  },
};

export type { DatosSociedadResponse };

