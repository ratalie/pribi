import { cloneDeep } from "lodash-es";
import type {
  Accionista,
  Persona,
  PersonaFideicomiso,
  PersonaFondoInversion,
  PersonaJuridica,
  PersonaNatural,
  PersonaSucursal,
  PersonaSucesionIndivisa,
  Representante,
} from "../../domain";
import type { AccionistaDTO } from "../../application/dtos/accionista.dto";

type BackendPersona = Record<string, any> & { tipo?: string };

const normalizeRepresentante = (value: any) => {
  if (!value) return undefined;
  return {
    nombre: value.nombre ?? "",
    apellidoPaterno: value.apellidoPaterno ?? "",
    apellidoMaterno: value.apellidoMaterno ?? "",
    tipoDocumento: value.tipoDocumento ?? "",
    numeroDocumento: value.numeroDocumento ?? "",
    paisEmision: value.paisEmision,
  };
};

const hasRepresentante = (value: Persona | undefined): value is Persona & {
  representante?: Representante;
} => Boolean(value && "representante" in value);

const mapPersona = (data: BackendPersona | undefined): Persona => {
  const tipo = (data?.tipo ?? "NATURAL").toUpperCase() as Persona["tipo"];
  const base = { ...(data ?? {}), tipo } as Record<string, any>;

  switch (tipo) {
    case "JURIDICA":
      return {
        id: base.id,
        tipo,
        tipoDocumento: base.tipoDocumento ?? "RUC",
        numeroDocumento: base.numeroDocumento ?? "",
        razonSocial: base.razonSocial ?? "",
        direccion: base.direccion,
        constituida: base.constituida,
        nombreComercial: base.nombreComercial,
        distrito: base.distrito,
        provincia: base.provincia,
        departamento: base.departamento,
        pais: base.pais,
        jurisdiccion: base.jurisdiccion,
        // El backend envía "representante", mapearlo al dominio
        representante: normalizeRepresentante(base.representante ?? base.representadoPor),
      } as PersonaJuridica;
    case "SUCURSAL":
      return {
        id: base.id,
        tipo,
        ruc: base.ruc ?? "",
        nombreSucursal: base.nombreSucursal ?? "",
        partidaRegistral: base.partidaRegistral,
        oficinaRegistrada: base.oficinaRegistrada,
        direccionFiscal: base.direccionFiscal,
        representante: normalizeRepresentante(base.representante),
      } as PersonaSucursal;
    case "FONDO_INVERSION":
      return {
        id: base.id,
        tipo,
        ruc: base.ruc ?? "",
        razonSocial: base.razonSocial ?? "",
        direccion: base.direccion,
        tipoFondo: base.tipoFondo ?? "PRIVADO",
        representante: normalizeRepresentante(base.representante),
        fiduciario: base.fiduciario
          ? {
              ruc: base.fiduciario.ruc,
              razonSocial: base.fiduciario.razonSocial,
            }
          : undefined,
      } as PersonaFondoInversion;
    case "FIDEICOMISO":
      return {
        id: base.id,
        tipo,
        tieneRuc: base.tieneRuc,
        ruc: base.ruc,
        razonSocial: base.razonSocial,
        numeroRegistroFideicomiso: base.numeroRegistroFideicomiso,
        partidaRegistral: base.partidaRegistral,
        oficinaRegistrada: base.oficinaRegistrada,
        direccionFiscal: base.direccionFiscal,
        representante: normalizeRepresentante(base.representante),
        fiduciario: base.fiduciario
          ? {
              ruc: base.fiduciario.ruc,
              razonSocial: base.fiduciario.razonSocial,
            }
          : undefined,
      } as PersonaFideicomiso;
    case "SUCESION_INDIVISA":
      return {
        id: base.id,
        tipo,
        ruc: base.ruc,
        razonSocial: base.razonSocial ?? "",
        distrito: base.distrito,
        provincia: base.provincia,
        departamento: base.departamento,
        direccion: base.direccion,
        representante: normalizeRepresentante(base.representante),
      } as PersonaSucesionIndivisa;
    case "NATURAL":
    default:
      return {
        id: base.id,
        tipo: "NATURAL",
        nombre: base.nombre ?? "",
        apellidoPaterno: base.apellidoPaterno ?? "",
        apellidoMaterno: base.apellidoMaterno,
        tipoDocumento: base.tipoDocumento ?? "DNI",
        numeroDocumento: base.numeroDocumento ?? "",
        paisEmision: base.paisEmision,
      } as PersonaNatural;
  }
};

export const AccionistasMapper = {
  toDomain(payload: Record<string, any>): Accionista {
    const personaSource = payload.persona ?? payload.person ?? payload;
    return {
      id: payload.id ?? payload.shareholderId ?? "",
      persona: mapPersona(personaSource),
      participacionPorcentual: payload.participacionPorcentual,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  },

  toDomainList(list: Array<Record<string, any>> = []): Accionista[] {
    return list.map((item) => AccionistasMapper.toDomain(item));
  },

  toPayload(dto: AccionistaDTO) {
    const clone = cloneDeep(dto);
    if (hasRepresentante(clone.persona) && clone.persona.representante && !clone.persona.representante.apellidoMaterno) {
      delete clone.persona.representante.apellidoMaterno;
    }
    return clone;
  },
};

